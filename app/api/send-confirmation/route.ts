// /app/api/send-confirmation/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  type?: string;
}

const getDownloadFileForItem = (item: CartItem): string | null => {
  const downloadMap: Record<string, string> = {
    'anomic-drums': '/files/anomic-drums.wav',
    'jyy-guitars': '/files/jyy-guitars.pdf', 
    'atlantic-guitar': '/files/atlantic-guitar.wav',
    'out-dark-drums': '/files/out-dark-drums.wav',
    'feign-guitars': '/files/feign-guitars.wav',
    'dark-keys': '/files/dark-keys.wav',
    'reddown-bass': '/files/reddown-bass.wav',
    'quietness-bass': '/files/quietness-bass.wav',
  };
  return downloadMap[item.id] || null;
};

export async function POST(req: NextRequest) {
  console.log('📧 Send confirmation API called');
  
  // Check if API key exists
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is missing!');
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
  }

  const { name, email, cartItems, receiptUrl } = await req.json();
  console.log('🧾 Request data:', { name, email, cartItemsCount: cartItems?.length, receiptUrl });

  try {
    let linksHtml = '';
    let hasDigitalItems = false;
    let hasPhysicalItems = false;
    let digitalItemsCount = 0;

    // ✅ ตรวจสอบว่ามี digital items หรือไม่
    for (const item of cartItems || []) {
      if (item.type === 'digital' || item.category === 'Backing Track') {
        hasDigitalItems = true;
        digitalItemsCount++;
        console.log('🎵 Processing digital item:', item.id);
        
        const filePath = getDownloadFileForItem(item);
        if (filePath) {
          // ✅ เรียก API สร้าง download token
          const baseUrl = process.env.NODE_ENV === 'production' 
            ? 'https://unda-website.vercel.app' 
            : 'http://localhost:3000';
            
          console.log('🔗 Creating download link for:', filePath);
          
          const tokenRes = await fetch(`${baseUrl}/api/download-link`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filePath })
          });

          if (!tokenRes.ok) {
            console.error('❌ Failed to create download token:', await tokenRes.text());
            continue;
          }

          const tokenData = await tokenRes.json();
          console.log('✅ Download token created:', tokenData.token);
          
          if (tokenData.token) {
            linksHtml += `<li style="margin-bottom: 10px;">
              <a href="${baseUrl}/download/${tokenData.token}" target="_blank" 
                 style="color: #dc9e63; text-decoration: underline;">
                ${item.title} – ${item.subtitle}
              </a>
            </li>`;
          }
        }
      } else {
        hasPhysicalItems = true;
      }
    }

    // ✅ สร้าง content แยกตาม order type
    let mainContent = '';
    
    if (hasDigitalItems && hasPhysicalItems) {
      // Mixed order - มีทั้ง digital และ physical
      mainContent = `
        <p style="color: #f8fcdc; margin-bottom: 16px;">
          We're thrilled to let you know that your order has been successfully received!
        </p>
        <p style="color: #f8fcdc; margin-bottom: 16px;">
          Your order contains both digital and physical items:
        </p>
        <p style="margin-top: 30px; font-weight: bold; color: #dc9e63;">
          📥 Digital Downloads (${digitalItemsCount} items)
        </p>
        <p style="margin-top: 10px;">Here are your download links (valid for 1 hour):</p>
        <ul style="padding-left: 20px;">${linksHtml}</ul>
        <p style="margin-top: 30px; font-weight: bold; color: #dc9e63;">
          📦 Physical Items
        </p>
        <p style="margin-top: 10px;">
          Your physical items are being prepared for shipping. You will receive another email with tracking information once they have been dispatched.
        </p>
      `;
    } else if (hasDigitalItems) {
      // Digital only order
      mainContent = `
        <p style="color: #f8fcdc; margin-bottom: 16px;">
          We're thrilled to let you know that your digital order has been successfully received!
        </p>
        <p style="color: #f8fcdc; margin-bottom: 16px;">
          Your downloads are ready immediately:
        </p>
        <p style="margin-top: 30px;">Here are your download links (valid for 1 hour):</p>
        <ul style="padding-left: 20px;">${linksHtml}</ul>
        <p style="margin-top: 20px; font-size: 14px; color: #999;">
          💡 Tip: Save your files to a safe location as download links expire after 1 hour.
        </p>
      `;
    } else {
      // Physical only order
      mainContent = `
        <p style="color: #f8fcdc; margin-bottom: 16px;">
          We're thrilled to let you know that your order has been successfully received and is now being processed!
        </p>
        <p style="color: #f8fcdc; margin-bottom: 16px;">
          Your items are being carefully prepared for shipping.
        </p>
        <p style="margin-bottom: 30px;">
          You will receive another email with tracking information once your items have been dispatched.
        </p>
      `;
    }

    // ✅ สร้าง receipt link
    const receiptHtml = receiptUrl
      ? `<p style="margin-top: 24px;">You can view your payment receipt here:<br/>
          <a href="${receiptUrl}" target="_blank" style="color: #dc9e63; text-decoration: underline;">
            Stripe Payment Receipt
          </a>
        </p>`
      : '';

    // ✅ Email HTML template
    const html = `
      <body style="margin: 0; padding: 0; font-family: Cinzel, serif; background-color: #000;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" 
          style="background-image: url('https://unda-website.vercel.app/catmoon-bg.jpeg'); background-size: cover; background-position: center;">
          <tr>
            <td align="center" style="background-color: rgba(0, 0, 0, 0.8); padding: 60px 20px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" 
                style="margin: 0 auto; background-image: url('https://unda-website.vercel.app/redsky-bg.jpeg'); background-size: cover; border-radius: 12px; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
                <tr>
                  <td style="padding: 40px; color: #f8fcdc;">
                    <h1 style="color: #dc9e63; font-size: 28px; margin-bottom: 20px;">
                      Thank you for your purchase!
                    </h1>
                    <p style="color: #f8fcdc; margin-bottom: 16px;">
                      Hi <strong>${name}</strong>,
                    </p>
                    ${mainContent}
                    ${receiptHtml}
                    <a href="https://www.undaalunda.com" 
                      style="display: inline-block; background-color: #dc9e63; color: #000000; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 14px; margin-top: 30px;">
                      Return to Store
                    </a>
                    <p style="font-size: 12px; color: #999; margin-top: 30px; text-align: center;">
                      Copyright © 2025 Unda Alunda
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    `;

    console.log('📨 Sending email to:', email);
    console.log('📦 Order type:', hasDigitalItems && hasPhysicalItems ? 'Mixed' : hasDigitalItems ? 'Digital only' : 'Physical only');
    
    // ✅ ส่ง email
    const emailResult = await resend.emails.send({
      from: 'Unda Alunda <noreply@updates.undaalunda.com>',
      to: [email],
      subject: 'Thank you for your order — Unda Alunda',
      html,
    });

    console.log('✅ Email sent successfully:', JSON.stringify(emailResult, null, 2));
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('🔥 Email send failed:', error);
    return NextResponse.json({ 
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}