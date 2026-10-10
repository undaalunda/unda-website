// lib/owner-notification.ts
// 📧 อีเมลแจ้งเจ้าของร้านเมื่อมีออเดอร์ใหม่ (เรียกจาก Stripe webhook ตอนเงินเข้า)

import { Resend } from 'resend';
import { allItems } from '../src/components/allItems';

const resend = new Resend(process.env.RESEND_API_KEY);
const OWNER_NOTIFICATION_EMAILS = ['unda.alunda@gmail.com', 'zandy.nwt@gmail.com'];

export async function sendOwnerNotification({
  orderId,
  email,
  billingInfo,
  shippingInfo,
  cartItems,
  amount,
  isDigitalOnly,
  shippingMethod,
}: {
  orderId: string;
  email: string;
  billingInfo: any;
  shippingInfo: any;
  cartItems: any[];
  amount: number;
  isDigitalOnly: boolean;
  shippingMethod: string | null;
}) {
  try {
    const addr = shippingInfo || billingInfo;

    const itemsHtml = cartItems.map((item: any) => {
      const product = allItems.find((p) => p.id === item.id);
      const title = product?.title || item.title || item.id;
      const subtitle = product?.subtitle || '';
      const qty = item.quantity || 1;
      const size = item.size ? ` (Size: ${item.size})` : '';
      return `<li style="margin-bottom: 6px;">${title}${subtitle ? ` – ${subtitle}` : ''}${size} × ${qty}</li>`;
    }).join('');

    const addressHtml = !isDigitalOnly && addr ? `
      <h3 style="color: #dc9e63; margin-top: 24px;">Ship To</h3>
      <p style="margin: 4px 0;">${addr.firstName || ''} ${addr.lastName || ''}</p>
      ${addr.company ? `<p style="margin: 4px 0;">${addr.company}</p>` : ''}
      <p style="margin: 4px 0;">${addr.address || ''}${addr.address2 ? `, ${addr.address2}` : ''}</p>
      <p style="margin: 4px 0;">${addr.city || ''}${addr.county ? `, ${addr.county}` : ''} ${addr.postcode || ''}</p>
      <p style="margin: 4px 0;">${addr.country || ''}</p>
      ${billingInfo?.phone ? `<p style="margin: 4px 0;">Phone: ${billingInfo.phone}</p>` : ''}
      ${shippingMethod ? `<p style="margin: 4px 0;">Shipping Method: ${shippingMethod}</p>` : ''}
    ` : '';

    const html = `
      <body style="font-family: Arial, sans-serif; background-color: #160000; color: #f8fcdc; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1a0000; padding: 24px; border-radius: 12px; border: 1px solid #dc9e63;">
          <h1 style="color: #dc9e63; font-size: 22px; margin-bottom: 16px;">🛒 New Order Received!</h1>

          <p style="margin: 4px 0;"><strong>Order ID:</strong> ${orderId}</p>
          <p style="margin: 4px 0;"><strong>Customer Email:</strong> ${email}</p>
          <p style="margin: 4px 0;"><strong>Amount:</strong> $${(amount / 100).toFixed(2)}</p>
          <p style="margin: 4px 0;"><strong>Type:</strong> ${isDigitalOnly ? 'Digital Only' : 'Physical Order'}</p>

          <h3 style="color: #dc9e63; margin-top: 24px;">Items</h3>
          <ul style="padding-left: 20px; margin: 0;">
            ${itemsHtml}
          </ul>

          ${addressHtml}
        </div>
      </body>
    `;

    await resend.emails.send({
      from: 'Unda Alunda Orders <noreply@updates.undaalunda.com>',
      to: OWNER_NOTIFICATION_EMAILS,
      subject: `🛒 New Order: ${isDigitalOnly ? 'Digital' : 'Physical'} — $${(amount / 100).toFixed(2)}`,
      html,
    });

    console.log('✅ Owner notification email sent for order:', orderId);
  } catch (err: any) {
    console.error('❌ Failed to send owner notification email:', err.message);
  }
}