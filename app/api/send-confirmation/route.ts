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
  // ========== BACKING TRACKS ==========
  // THE DARK
  'the-dark-guitars': '/files/the-dark-guitars-backing.wav',
  'the-dark-lead-guitar': '/files/the-dark-lead-guitar-backing.wav',
  'the-dark-keys': '/files/the-dark-keys-backing.wav',
  'the-dark-bass': '/files/the-dark-bass-backing.wav',
  'the-dark-drums': '/files/the-dark-drums-backing.wav',
  
  // ANOMIC
  'anomic-guitars': '/files/anomic-guitars-backing.wav',
  'anomic-lead-guitar': '/files/anomic-lead-guitar-backing.wav',
  'anomic-keys': '/files/anomic-keys-backing.wav',
  'anomic-bass': '/files/anomic-bass-backing.wav',
  'anomic-drums': '/files/anomic-drums-backing.wav',
  
  // CONSONANCE
  'consonance-guitars': '/files/consonance-guitars-backing.wav',
  'consonance-lead-guitar': '/files/consonance-lead-guitar-backing.wav',
  'consonance-keys': '/files/consonance-keys-backing.wav',
  'consonance-bass': '/files/consonance-bass-backing.wav',
  'consonance-drums': '/files/consonance-drums-backing.wav',
  
  // JYY
  'jyy-guitars': '/files/jyy-guitars-backing.wav',
  'jyy-lead-guitar': '/files/jyy-lead-guitar-backing.wav',
  'jyy-keys': '/files/jyy-keys-backing.wav',
  'jyy-bass': '/files/jyy-bass-backing.wav',
  'jyy-drums': '/files/jyy-drums-backing.wav',
  
  // OUT OF THE DARK
  'out-of-the-dark-guitars': '/files/out-of-the-dark-guitars-backing.wav',
  'out-of-the-dark-lead-guitar': '/files/out-of-the-dark-lead-guitar-backing.wav',
  'out-of-the-dark-keys': '/files/out-of-the-dark-keys-backing.wav',
  'out-of-the-dark-bass': '/files/out-of-the-dark-bass-backing.wav',
  'out-of-the-dark-drums': '/files/out-of-the-dark-drums-backing.wav',
  
  // RED DOWN
  'red-down-guitars': '/files/red-down-guitars-backing.wav',
  'red-down-lead-guitar': '/files/red-down-lead-guitar-backing.wav',
  'red-down-keys': '/files/red-down-keys-backing.wav',
  'red-down-bass': '/files/red-down-bass-backing.wav',
  'red-down-drums': '/files/red-down-drums-backing.wav',
  
  // ATLANTIC
  'atlantic-guitars': '/files/atlantic-guitars-backing.wav',
  'atlantic-lead-guitar': '/files/atlantic-lead-guitar-backing.wav',
  'atlantic-keys': '/files/atlantic-keys-backing.wav',
  'atlantic-bass': '/files/atlantic-bass-backing.wav',
  'atlantic-drums': '/files/atlantic-drums-backing.wav',
  
  // FEIGN
  'feign-guitars': '/files/feign-guitars-backing.wav',
  'feign-lead-guitar': '/files/feign-lead-guitar-backing.wav',
  'feign-keys': '/files/feign-keys-backing.wav',
  'feign-bass': '/files/feign-bass-backing.wav',
  'feign-drums': '/files/feign-drums-backing.wav',
  
  // DARK WONDERFUL WORLD
  'dark-wonderful-world-guitars': '/files/dark-wonderful-world-guitars-backing.wav',
  'dark-wonderful-world-lead-guitar': '/files/dark-wonderful-world-lead-guitar-backing.wav',
  'dark-wonderful-world-keys': '/files/dark-wonderful-world-keys-backing.wav',
  'dark-wonderful-world-bass': '/files/dark-wonderful-world-bass-backing.wav',
  'dark-wonderful-world-drums': '/files/dark-wonderful-world-drums-backing.wav',
  
  // QUIETNESS
  'quietness-guitars': '/files/quietness-guitars-backing.wav',
  'quietness-lead-guitar': '/files/quietness-lead-guitar-backing.wav',
  'quietness-keys': '/files/quietness-keys-backing.wav',
  'quietness-bass': '/files/quietness-bass-backing.wav',
  'quietness-drums': '/files/quietness-drums-backing.wav',
  
  // ========== STEMS ==========
  // THE DARK
  'the-dark-guitars-stem': '/files/the-dark-guitars-stem.wav',
  'the-dark-guitar-lead-stem': '/files/the-dark-lead-guitar-stem.wav',
  'the-dark-keys-stem': '/files/the-dark-keys-stem.wav',
  'the-dark-bass-stem': '/files/the-dark-bass-stem.wav',
  'the-dark-drums-stem': '/files/the-dark-drums-stem.wav',
  
  // ANOMIC
  'anomic-guitars-stem': '/files/anomic-guitars-stem.wav',
  'anomic-guitar-lead-stem': '/files/anomic-lead-guitar-stem.wav',
  'anomic-keys-stem': '/files/anomic-keys-stem.wav',
  'anomic-bass-stem': '/files/anomic-bass-stem.wav',
  'anomic-drums-stem': '/files/anomic-drums-stem.wav',
  
  // CONSONANCE
  'consonance-guitars-stem': '/files/consonance-guitars-stem.wav',
  'consonance-guitar-lead-stem': '/files/consonance-lead-guitar-stem.wav',
  'consonance-keys-stem': '/files/consonance-keys-stem.wav',
  'consonance-bass-stem': '/files/consonance-bass-stem.wav',
  'consonance-drums-stem': '/files/consonance-drums-stem.wav',
  
  // JYY
  'jyy-guitars-stem': '/files/jyy-guitars-stem.wav',
  'jyy-guitar-lead-stem': '/files/jyy-lead-guitar-stem.wav',
  'jyy-keys-stem': '/files/jyy-keys-stem.wav',
  'jyy-bass-stem': '/files/jyy-bass-stem.wav',
  'jyy-drums-stem': '/files/jyy-drums-stem.wav',
  
  // OUT OF THE DARK
  'out-of-the-dark-guitars-stem': '/files/out-of-the-dark-guitars-stem.wav',
  'out-of-the-dark-guitar-lead-stem': '/files/out-of-the-dark-lead-guitar-stem.wav',
  'out-of-the-dark-keys-stem': '/files/out-of-the-dark-keys-stem.wav',
  'out-of-the-dark-bass-stem': '/files/out-of-the-dark-bass-stem.wav',
  'out-of-the-dark-drums-stem': '/files/out-of-the-dark-drums-stem.wav',
  
  // RED DOWN
  'red-down-guitars-stem': '/files/red-down-guitars-stem.wav',
  'red-down-guitar-lead-stem': '/files/red-down-lead-guitar-stem.wav',
  'red-down-keys-stem': '/files/red-down-keys-stem.wav',
  'red-down-bass-stem': '/files/red-down-bass-stem.wav',
  'red-down-drums-stem': '/files/red-down-drums-stem.wav',
  
  // ATLANTIC
  'atlantic-guitars-stem': '/files/atlantic-guitars-stem.wav',
  'atlantic-guitar-lead-stem': '/files/atlantic-lead-guitar-stem.wav',
  'atlantic-keys-stem': '/files/atlantic-keys-stem.wav',
  'atlantic-bass-stem': '/files/atlantic-bass-stem.wav',
  'atlantic-drums-stem': '/files/atlantic-drums-stem.wav',
  
  // FEIGN
  'feign-guitars-stem': '/files/feign-guitars-stem.wav',
  'feign-guitar-lead-stem': '/files/feign-lead-guitar-stem.wav',
  'feign-keys-stem': '/files/feign-keys-stem.wav',
  'feign-bass-stem': '/files/feign-bass-stem.wav',
  'feign-drums-stem': '/files/feign-drums-stem.wav',
  
  // DARK WONDERFUL WORLD
  'dark-wonderful-world-guitars-stem': '/files/dark-wonderful-world-guitars-stem.wav',
  'dark-wonderful-world-guitar-lead-stem': '/files/dark-wonderful-world-lead-guitar-stem.wav',
  'dark-wonderful-world-keys-stem': '/files/dark-wonderful-world-keys-stem.wav',
  'dark-wonderful-world-bass-stem': '/files/dark-wonderful-world-bass-stem.wav',
  'dark-wonderful-world-drums-stem': '/files/dark-wonderful-world-drums-stem.wav',
  
  // QUIETNESS
  'quietness-guitars-stem': '/files/quietness-guitars-stem.wav',
  'quietness-guitar-lead-stem': '/files/quietness-lead-guitar-stem.wav',
  'quietness-keys-stem': '/files/quietness-keys-stem.wav',
  'quietness-bass-stem': '/files/quietness-bass-stem.wav',
  'quietness-drums-stem': '/files/quietness-drums-stem.wav',
  
  // ========== TABS ==========
  // THE DARK
  'the-dark-guitar-tab': '/files/the-dark-guitar-tab.pdf',
  'the-dark-keys-tab': '/files/the-dark-keys-tab.pdf',
  'the-dark-bass-tab': '/files/the-dark-bass-tab.pdf',
  'the-dark-drums-tab': '/files/the-dark-drums-tab.pdf',
  
  // ANOMIC
  'anomic-guitar-tab': '/files/anomic-guitar-tab.pdf',
  'anomic-keys-tab': '/files/anomic-keys-tab.pdf',
  'anomic-bass-tab': '/files/anomic-bass-tab.pdf',
  'anomic-drums-tab': '/files/anomic-drums-tab.pdf',
  
  // CONSONANCE
  'consonance-guitar-tab': '/files/consonance-guitar-tab.pdf',
  'consonance-keys-tab': '/files/consonance-keys-tab.pdf',
  'consonance-bass-tab': '/files/consonance-bass-tab.pdf',
  'consonance-drums-tab': '/files/consonance-drums-tab.pdf',
  
  // JYY
  'jyy-guitar-tab': '/files/jyy-guitar-tab.pdf',
  'jyy-keys-tab': '/files/jyy-keys-tab.pdf',
  'jyy-bass-tab': '/files/jyy-bass-tab.pdf',
  'jyy-drums-tab': '/files/jyy-drums-tab.pdf',
  
  // OUT OF THE DARK
  'out-of-the-dark-guitar-tab': '/files/out-of-the-dark-guitar-tab.pdf',
  'out-of-the-dark-keys-tab': '/files/out-of-the-dark-keys-tab.pdf',
  'out-of-the-dark-bass-tab': '/files/out-of-the-dark-bass-tab.pdf',
  'out-of-the-dark-drums-tab': '/files/out-of-the-dark-drums-tab.pdf',
  
  // RED DOWN
  'red-down-guitar-tab': '/files/red-down-guitar-tab.pdf',
  'red-down-keys-tab': '/files/red-down-keys-tab.pdf',
  'red-down-bass-tab': '/files/red-down-bass-tab.pdf',
  'red-down-drums-tab': '/files/red-down-drums-tab.pdf',
  
  // ATLANTIC
  'atlantic-guitar-tab': '/files/atlantic-guitar-tab.pdf',
  'atlantic-keys-tab': '/files/atlantic-keys-tab.pdf',
  'atlantic-bass-tab': '/files/atlantic-bass-tab.pdf',
  'atlantic-drums-tab': '/files/atlantic-drums-tab.pdf',
  
  // FEIGN
  'feign-guitar-tab': '/files/feign-guitar-tab.pdf',
  'feign-keys-tab': '/files/feign-keys-tab.pdf',
  'feign-bass-tab': '/files/feign-bass-tab.pdf',
  'feign-drums-tab': '/files/feign-drums-tab.pdf',
  
  // DARK WONDERFUL WORLD
  'dark-wonderful-world-guitar-tab': '/files/dark-wonderful-world-guitar-tab.pdf',
  'dark-wonderful-world-keys-tab': '/files/dark-wonderful-world-keys-tab.pdf',
  'dark-wonderful-world-bass-tab': '/files/dark-wonderful-world-bass-tab.pdf',
  'dark-wonderful-world-drums-tab': '/files/dark-wonderful-world-drums-tab.pdf',
  
  // QUIETNESS
  'quietness-guitar-tab': '/files/quietness-guitar-tab.pdf',
  'quietness-keys-tab': '/files/quietness-keys-tab.pdf',
  'quietness-bass-tab': '/files/quietness-bass-tab.pdf',
  'quietness-drums-tab': '/files/quietness-drums-tab.pdf',
  
  // CAN'T FEEL MY FACE
  'cant-feel-my-face-guitar-tab': '/files/cant-feel-my-face-guitar-tab.pdf',
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