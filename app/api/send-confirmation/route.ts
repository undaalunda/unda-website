// /app/api/send-confirmation/route.ts - ก๊อปทั้งไฟล์นี้แทนที่ของเดิม

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
  // ถ้าเป็น Backing Track หรือ digital product
  if (item.category === 'Backing Track' || item.type === 'digital') {
    // สร้าง filename จาก title และ subtitle
    const titleSlug = item.title.toLowerCase().replace(/\s+/g, '-');
    const subtitleSlug = item.subtitle.toLowerCase();
    
    // Map ตาม pattern ที่มีอยู่
    const possibleIds = [
      item.id,
      `${titleSlug}-${subtitleSlug}`,
      `${titleSlug}`,
    ];
    
    const downloadMap: Record<string, string> = {
      'anomic-drums': '/files/anomic-drums.wav',
      'jyy-guitars': '/files/jyy-guitars.wav', 
      'atlantic-guitar': '/files/atlantic-guitar.wav',
      'out-dark-drums': '/files/out-dark-drums.wav',
      'feign-guitars': '/files/feign-guitars.wav',
      'dark-keys': '/files/dark-keys.wav',
      'reddown-bass': '/files/reddown-bass.wav',
      'quietness-bass': '/files/quietness-bass.wav',
    };
    
    // Log เพื่อ debug
    console.log('🔍 Looking for download file:', {
      itemId: item.id,
      itemTitle: item.title,
      itemSubtitle: item.subtitle,
      possibleIds,
      category: item.category,
      type: item.type
    });
    
    // ลองหาจาก possible IDs
    for (const id of possibleIds) {
      if (downloadMap[id]) {
        console.log('✅ Found file for ID:', id);
        return downloadMap[id];
      }
    }
    
    // ถ้าไม่เจอใน map ให้ลองสร้าง path เอง
    const defaultFile = `/download/${titleSlug}-${subtitleSlug}.wav`;
    console.log('⚠️ No mapping found, using default:', defaultFile);
    return defaultFile;
  }
  
  return null;
};

export async function POST(req: NextRequest) {
  console.log('📧 Send confirmation API called');
  
  // Check if API key exists
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is missing!');
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
  }

  const { name, email, cartItems, receiptUrl, orderId } = await req.json();
  console.log('🧾 Request data:', { name, email, cartItemsCount: cartItems?.length, receiptUrl, orderId });

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
        console.log('🎵 Processing digital item:', {
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          category: item.category,
          type: item.type
        });
        
        const filePath = getDownloadFileForItem(item);
        console.log('📁 File path for item:', filePath);
        
        if (filePath) {
          // ✅ ใช้ environment-aware base URL
          const apiBaseUrl = process.env.NODE_ENV === 'production' 
            ? (process.env.NEXT_PUBLIC_BASE_URL || 'https://unda-website.vercel.app')
            : 'http://localhost:3000';
            
          const publicBaseUrl = process.env.NODE_ENV === 'production'
            ? (process.env.NEXT_PUBLIC_BASE_URL || 'https://unda-website.vercel.app')
            : 'http://localhost:3000';
          
          console.log('🔗 Creating download link for:', filePath);
          console.log('🌐 API Base URL:', apiBaseUrl);
          console.log('🌐 Public Base URL:', publicBaseUrl);
          
          const tokenRes = await fetch(`${apiBaseUrl}/api/download-link`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              filePath, 
              orderId,
              expiresInMinutes: 2880 // 🆕 48 ชั่วโมง = 48 * 60 = 2880 นาที
            })
          });

          if (!tokenRes.ok) {
            console.error('❌ Failed to create download token:', await tokenRes.text());
            continue;
          }

          const tokenData = await tokenRes.json();
          console.log('✅ Download token created:', tokenData.token);
          
          if (tokenData.token) {
            linksHtml += `<li style="margin-bottom: 10px;">
              <a href="${publicBaseUrl}/download/${tokenData.token}" target="_blank" 
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

    // ✅ สร้าง content แยกตาม order type (แก้ข้อความให้สุขุม)
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
          Digital Downloads (${digitalItemsCount} items)
        </p>
        <p style="margin-top: 10px;">Here are your download links (valid for 48 hours):</p>
        <ul style="padding-left: 20px;">${linksHtml}</ul>
        <p style="margin-top: 30px; font-weight: bold; color: #dc9e63;">
          Physical Items
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
        <p style="margin-top: 30px;">Here are your download links (valid for 48 hours):</p>
        <ul style="padding-left: 20px;">${linksHtml}</ul>
        <p style="margin-top: 20px; font-size: 14px; color: #999;">
          Download links are valid for 48 hours.
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

    // ✅ สร้าง receipt link (ใช้ production URL สำหรับ email images)
    const publicBaseUrl = 'https://unda-website.vercel.app'; // Force production URL for email images
      
    const receiptHtml = receiptUrl
      ? `<p style="margin-top: 24px;">You can view your payment receipt here:<br/>
          <a href="${receiptUrl}" target="_blank" style="color: #dc9e63; text-decoration: underline;">
            Stripe Payment Receipt
          </a>
        </p>`
      : '';

    // ✅ Email HTML template - ใช้จากไฟล์สั้น (หน้าตาสวย)
    const html = `
      <body style="margin: 0; padding: 0; font-family: Cinzel, serif; background-color: #000;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" 
          style="background-image: url('${publicBaseUrl}/catmoon-bg.jpeg'); background-size: cover; background-position: center;">
          <tr>
            <td align="center" style="background-color: rgba(0, 0, 0, 0.8); padding: 60px 20px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" 
                style="margin: 0 auto; background-image: url('${publicBaseUrl}/redsky-bg.webp'); background-size: cover; border-radius: 12px; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
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
                    <a href="${publicBaseUrl}" 
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
    console.log('⏰ Download links valid for: 48 hours');
    console.log('🌐 Public Base URL:', publicBaseUrl);
    
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