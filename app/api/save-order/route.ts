// app/api/save-order/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import supabase from '../../../lib/supabase';
import { allItems } from '../../../src/components/allItems';

const resend = new Resend(process.env.RESEND_API_KEY);
const OWNER_NOTIFICATION_EMAILS = ['unda.alunda@gmail.com', 'zandy.nwt@gmail.com'];

// 🆕 ส่งอีเมลแจ้งเตือนเจ้าของร้านทุกครั้งที่มีออเดอร์ใหม่
// มีข้อมูลครบสำหรับเตรียมแพ็ค/ส่งของทันที
async function sendOwnerNotification({
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
    // ไม่ throw error ต่อ เพราะ order บันทึกสำเร็จแล้ว แค่แจ้งเตือนพลาดเท่านั้น
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      billingInfo,
      shippingInfo,
      cartItems,
      shippingMethod,
      shippingZone,
      shippingRate,
      email,
      orderId,
    } = body;

    if (!billingInfo || !cartItems || !email || !orderId) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const finalShipping = shippingInfo || billingInfo;
    
    // ✅ เช็คว่าเป็น digital only หรือไม่
    const isDigitalOnly = cartItems.every((cartItem: any) => {
      const product = allItems.find(p => p.id === cartItem.id);
      if (!product) {
        console.warn('[⚠️ NOT FOUND IN allItems]', cartItem.id);
        return false;
      }
      return product.type === 'digital';
    });

    const amount = Math.round(
      cartItems.reduce((total: number, cartItem: any) => {
        const product = allItems.find((p) => p.id === cartItem.id);
        if (!product) return total;
        const price =
          typeof product.price === 'number' ? product.price : product.price.sale;
        return total + price;
      }, 0) * 100
    );

    // 🆕 ไม่สร้าง tracking ปลอมอีกต่อไป!
    let shipmentResult: {
      tracking_number: string | null;
      courier: string | null;
      tracking_url: string | null;
      estimated_delivery: string | null;
      label_url: string | null;
    };

    // ✅ ถ้าเป็น physical items
    if (!isDigitalOnly) {
      if (!shippingMethod || !shippingZone) {
        return NextResponse.json(
          { error: 'Missing shipping info for physical items.' },
          { status: 400 }
        );
      }

      shipmentResult = {
        tracking_number: null,
        courier: 'dhl',
        tracking_url: null,
        estimated_delivery: null,
        label_url: null,
      };
      
      console.log('[📦 Physical order - will need manual shipping]');
    } else {
      // ✅ Digital order
      shipmentResult = {
        tracking_number: null,
        courier: null,
        tracking_url: null,
        estimated_delivery: null,
        label_url: null,
      };
    }

    const updateData = {
      billing_info: billingInfo,
      shipping_info: shippingInfo || null,
      shipping_method: isDigitalOnly ? null : shippingMethod,
      shipping_zone: isDigitalOnly ? null : shippingZone,
      shipping_rate: isDigitalOnly ? null : shippingRate || 0,
      tracking_number: shipmentResult.tracking_number,
      courier: shipmentResult.courier,
      tracking_url: shipmentResult.tracking_url,
      estimated_delivery: shipmentResult.estimated_delivery,
      label_url: shipmentResult.label_url,
      amount,
      status: isDigitalOnly ? 'paid' : 'pending_shipment',
    };

    console.log('[📦 Updating order in Supabase]', updateData);

    const { error } = await supabase
      .from('Orders')
      .update(updateData)
      .eq('id', orderId);

    if (error) {
      console.error('❌ Supabase update error:', error.message);
      return NextResponse.json({ error: 'Failed to update order in DB' }, { status: 500 });
    }

    console.log('✅ Order saved successfully:', {
      orderId,
      isDigitalOnly,
      status: isDigitalOnly ? 'paid' : 'pending_shipment'
    });

    // 🆕 ส่งอีเมลแจ้งเตือนเจ้าของร้าน (ไม่ block response หลักถ้าส่งพลาด)
    await sendOwnerNotification({
      orderId,
      email,
      billingInfo,
      shippingInfo,
      cartItems,
      amount,
      isDigitalOnly,
      shippingMethod: isDigitalOnly ? null : shippingMethod,
    });

    return NextResponse.json({
      success: true,
      tracking: shipmentResult,
      orderId,
    });
  } catch (err: any) {
    console.error('🔥 Unexpected error in save-order:', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}