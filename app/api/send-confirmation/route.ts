// /app/api/send-confirmation/route.ts - ก๊อปทั้งไฟล์นี้แทนที่ของเดิม

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import supabase from '../../../lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);
const R2_URL = process.env.R2_PUBLIC_URL || '';

// 🆕 เช็คสมุดบันทึกก่อนส่ง — ถ้ายังไม่มีใครส่ง ให้ "จอง" สิทธิ์ทันทีแล้วส่งได้
// ถ้ามีคนจองไปแล้ว ให้หยุด ไม่ส่งซ้ำ
async function tryClaimEmailSending(orderId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('Orders')
    .update({ confirmation_email_sent: true })
    .eq('id', orderId)
    .eq('confirmation_email_sent', false)
    .select();

  if (error) {
    console.error('❌ Error claiming email sending right:', error.message);
    return false;
  }

  return !!(data && data.length > 0);
}

interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  type?: string;
}

const getDownloadFileForItem = (item: CartItem): string | null => {
  if (item.category === 'Backing Track' || item.type === 'digital') {
    const titleSlug = item.title.toLowerCase().replace(/\s+/g, '-');
    const subtitleSlug = item.subtitle.toLowerCase();
    
    const possibleIds = [
      item.id,
      `${titleSlug}-${subtitleSlug}`,
      `${titleSlug}`,
    ];
    
    const downloadMap: Record<string, string> = {
      // ========== BACKING TRACKS ==========
      'the-dark-guitars': `${R2_URL}/the-dark-guitars-backing.wav`,
      'the-dark-lead-guitar': `${R2_URL}/the-dark-lead-guitar-backing.wav`,
      'the-dark-keys': `${R2_URL}/the-dark-keys-backing.wav`,
      'the-dark-bass': `${R2_URL}/the-dark-bass-backing.wav`,
      'the-dark-drums': `${R2_URL}/the-dark-drums-backing.wav`,
      
      'anomic-guitars': `${R2_URL}/anomic-guitars-backing.wav`,
      'anomic-lead-guitar': `${R2_URL}/anomic-lead-guitar-backing.wav`,
      'anomic-keys': `${R2_URL}/anomic-keys-backing.wav`,
      'anomic-bass': `${R2_URL}/anomic-bass-backing.wav`,
      'anomic-drums': `${R2_URL}/anomic-drums-backing.wav`,
      
      'consonance-guitars': `${R2_URL}/consonance-guitars-backing.wav`,
      'consonance-lead-guitar': `${R2_URL}/consonance-lead-guitar-backing.wav`,
      'consonance-keys': `${R2_URL}/consonance-keys-backing.wav`,
      'consonance-bass': `${R2_URL}/consonance-bass-backing.wav`,
      'consonance-drums': `${R2_URL}/consonance-drums-backing.wav`,
      
      'jyy-guitars': `${R2_URL}/jyy-guitars-backing.wav`,
      'jyy-lead-guitar': `${R2_URL}/jyy-lead-guitar-backing.wav`,
      'jyy-keys': `${R2_URL}/jyy-keys-backing.wav`,
      'jyy-bass': `${R2_URL}/jyy-bass-backing.wav`,
      'jyy-drums': `${R2_URL}/jyy-drums-backing.wav`,
      
      'out-of-the-dark-guitars': `${R2_URL}/out-of-the-dark-guitars-backing.wav`,
      'out-of-the-dark-lead-guitar': `${R2_URL}/out-of-the-dark-lead-guitar-backing.wav`,
      'out-of-the-dark-keys': `${R2_URL}/out-of-the-dark-keys-backing.wav`,
      'out-of-the-dark-bass': `${R2_URL}/out-of-the-dark-bass-backing.wav`,
      'out-of-the-dark-drums': `${R2_URL}/out-of-the-dark-drums-backing.wav`,
      
      'red-down-guitars': `${R2_URL}/red-down-guitars-backing.wav`,
      'red-down-lead-guitar': `${R2_URL}/red-down-lead-guitar-backing.wav`,
      'red-down-keys': `${R2_URL}/red-down-keys-backing.wav`,
      'red-down-bass': `${R2_URL}/red-down-bass-backing.wav`,
      'red-down-drums': `${R2_URL}/red-down-drums-backing.wav`,
      
      'atlantic-guitars': `${R2_URL}/atlantic-guitars-backing.wav`,
      'atlantic-lead-guitar': `${R2_URL}/atlantic-lead-guitar-backing.wav`,
      'atlantic-keys': `${R2_URL}/atlantic-keys-backing.wav`,
      'atlantic-bass': `${R2_URL}/atlantic-bass-backing.wav`,
      'atlantic-drums': `${R2_URL}/atlantic-drums-backing.wav`,
      
      'feign-guitars': `${R2_URL}/feign-guitars-backing.wav`,
      'feign-lead-guitar': `${R2_URL}/feign-lead-guitar-backing.wav`,
      'feign-keys': `${R2_URL}/feign-keys-backing.wav`,
      'feign-bass': `${R2_URL}/feign-bass-backing.wav`,
      'feign-drums': `${R2_URL}/feign-drums-backing.wav`,
      
      'dark-wonderful-world-guitars': `${R2_URL}/dark-wonderful-world-guitars-backing.wav`,
      'dark-wonderful-world-lead-guitar': `${R2_URL}/dark-wonderful-world-lead-guitar-backing.wav`,
      'dark-wonderful-world-keys': `${R2_URL}/dark-wonderful-world-keys-backing.wav`,
      'dark-wonderful-world-bass': `${R2_URL}/dark-wonderful-world-bass-backing.wav`,
      'dark-wonderful-world-drums': `${R2_URL}/dark-wonderful-world-drums-backing.wav`,
      
      'quietness-guitars': `${R2_URL}/quietness-guitars-backing.wav`,
      'quietness-lead-guitar': `${R2_URL}/quietness-lead-guitar-backing.wav`,
      'quietness-keys': `${R2_URL}/quietness-keys-backing.wav`,
      'quietness-bass': `${R2_URL}/quietness-bass-backing.wav`,
      'quietness-drums': `${R2_URL}/quietness-drums-backing.wav`,
      
      // ========== STEMS ==========
      'the-dark-guitars-stem': `${R2_URL}/the-dark-guitars-stem.wav`,
      'the-dark-guitar-lead-stem': `${R2_URL}/the-dark-lead-guitar-stem.wav`,
      'the-dark-keys-stem': `${R2_URL}/the-dark-keys-stem.wav`,
      'the-dark-bass-stem': `${R2_URL}/the-dark-bass-stem.wav`,
      'the-dark-drums-stem': `${R2_URL}/the-dark-drums-stem.wav`,
      
      'anomic-guitars-stem': `${R2_URL}/anomic-guitars-stem.wav`,
      'anomic-guitar-lead-stem': `${R2_URL}/anomic-lead-guitar-stem.wav`,
      'anomic-keys-stem': `${R2_URL}/anomic-keys-stem.wav`,
      'anomic-bass-stem': `${R2_URL}/anomic-bass-stem.wav`,
      'anomic-drums-stem': `${R2_URL}/anomic-drums-stem.wav`,
      
      'consonance-guitars-stem': `${R2_URL}/consonance-guitars-stem.wav`,
      'consonance-guitar-lead-stem': `${R2_URL}/consonance-lead-guitar-stem.wav`,
      'consonance-keys-stem': `${R2_URL}/consonance-keys-stem.wav`,
      'consonance-bass-stem': `${R2_URL}/consonance-bass-stem.wav`,
      'consonance-drums-stem': `${R2_URL}/consonance-drums-stem.wav`,
      
      'jyy-guitars-stem': `${R2_URL}/jyy-guitars-stem.wav`,
      'jyy-guitar-lead-stem': `${R2_URL}/jyy-lead-guitar-stem.wav`,
      'jyy-keys-stem': `${R2_URL}/jyy-keys-stem.wav`,
      'jyy-bass-stem': `${R2_URL}/jyy-bass-stem.wav`,
      'jyy-drums-stem': `${R2_URL}/jyy-drums-stem.wav`,
      
      'out-of-the-dark-guitars-stem': `${R2_URL}/out-of-the-dark-guitars-stem.wav`,
      'out-of-the-dark-guitar-lead-stem': `${R2_URL}/out-of-the-dark-lead-guitar-stem.wav`,
      'out-of-the-dark-keys-stem': `${R2_URL}/out-of-the-dark-keys-stem.wav`,
      'out-of-the-dark-bass-stem': `${R2_URL}/out-of-the-dark-bass-stem.wav`,
      'out-of-the-dark-drums-stem': `${R2_URL}/out-of-the-dark-drums-stem.wav`,
      
      'red-down-guitars-stem': `${R2_URL}/red-down-guitars-stem.wav`,
      'red-down-guitar-lead-stem': `${R2_URL}/red-down-lead-guitar-stem.wav`,
      'red-down-keys-stem': `${R2_URL}/red-down-keys-stem.wav`,
      'red-down-bass-stem': `${R2_URL}/red-down-bass-stem.wav`,
      'red-down-drums-stem': `${R2_URL}/red-down-drums-stem.wav`,
      
      'atlantic-guitars-stem': `${R2_URL}/atlantic-guitars-stem.wav`,
      'atlantic-guitar-lead-stem': `${R2_URL}/atlantic-lead-guitar-stem.wav`,
      'atlantic-keys-stem': `${R2_URL}/atlantic-keys-stem.wav`,
      'atlantic-bass-stem': `${R2_URL}/atlantic-bass-stem.wav`,
      'atlantic-drums-stem': `${R2_URL}/atlantic-drums-stem.wav`,
      
      'feign-guitars-stem': `${R2_URL}/feign-guitars-stem.wav`,
      'feign-guitar-lead-stem': `${R2_URL}/feign-lead-guitar-stem.wav`,
      'feign-keys-stem': `${R2_URL}/feign-keys-stem.wav`,
      'feign-bass-stem': `${R2_URL}/feign-bass-stem.wav`,
      'feign-drums-stem': `${R2_URL}/feign-drums-stem.wav`,
      
      'dark-wonderful-world-guitars-stem': `${R2_URL}/dark-wonderful-world-guitars-stem.wav`,
      'dark-wonderful-world-guitar-lead-stem': `${R2_URL}/dark-wonderful-world-lead-guitar-stem.wav`,
      'dark-wonderful-world-keys-stem': `${R2_URL}/dark-wonderful-world-keys-stem.wav`,
      'dark-wonderful-world-bass-stem': `${R2_URL}/dark-wonderful-world-bass-stem.wav`,
      'dark-wonderful-world-drums-stem': `${R2_URL}/dark-wonderful-world-drums-stem.wav`,
      
      'quietness-guitars-stem': `${R2_URL}/quietness-guitars-stem.wav`,
      'quietness-guitar-lead-stem': `${R2_URL}/quietness-lead-guitar-stem.wav`,
      'quietness-keys-stem': `${R2_URL}/quietness-keys-stem.wav`,
      'quietness-bass-stem': `${R2_URL}/quietness-bass-stem.wav`,
      'quietness-drums-stem': `${R2_URL}/quietness-drums-stem.wav`,
      
      // ========== TABS ==========
      'the-dark-guitar-tab': `${R2_URL}/the-dark-guitar-tab.pdf`,
      'the-dark-keys-tab': `${R2_URL}/the-dark-keys-tab.pdf`,
      'the-dark-bass-tab': `${R2_URL}/the-dark-bass-tab.pdf`,
      'the-dark-drums-tab': `${R2_URL}/the-dark-drums-tab.pdf`,
      
      'anomic-guitar-tab': `${R2_URL}/anomic-guitar-tab.pdf`,
      'anomic-keys-tab': `${R2_URL}/anomic-keys-tab.pdf`,
      'anomic-bass-tab': `${R2_URL}/anomic-bass-tab.pdf`,
      'anomic-drums-tab': `${R2_URL}/anomic-drums-tab.pdf`,
      
      'consonance-guitar-tab': `${R2_URL}/consonance-guitar-tab.pdf`,
      'consonance-keys-tab': `${R2_URL}/consonance-keys-tab.pdf`,
      'consonance-bass-tab': `${R2_URL}/consonance-bass-tab.pdf`,
      'consonance-drums-tab': `${R2_URL}/consonance-drums-tab.pdf`,
      
      'jyy-guitar-tab': `${R2_URL}/jyy-guitar-tab.pdf`,
      'jyy-keys-tab': `${R2_URL}/jyy-keys-tab.pdf`,
      'jyy-bass-tab': `${R2_URL}/jyy-bass-tab.pdf`,
      'jyy-drums-tab': `${R2_URL}/jyy-drums-tab.pdf`,
      
      'out-of-the-dark-guitar-tab': `${R2_URL}/out-of-the-dark-guitar-tab.pdf`,
      'out-of-the-dark-keys-tab': `${R2_URL}/out-of-the-dark-keys-tab.pdf`,
      'out-of-the-dark-bass-tab': `${R2_URL}/out-of-the-dark-bass-tab.pdf`,
      'out-of-the-dark-drums-tab': `${R2_URL}/out-of-the-dark-drums-tab.pdf`,
      
      'red-down-guitar-tab': `${R2_URL}/red-down-guitar-tab.pdf`,
      'red-down-keys-tab': `${R2_URL}/red-down-keys-tab.pdf`,
      'red-down-bass-tab': `${R2_URL}/red-down-bass-tab.pdf`,
      'red-down-drums-tab': `${R2_URL}/red-down-drums-tab.pdf`,
      
      'atlantic-guitar-tab': `${R2_URL}/atlantic-guitar-tab.pdf`,
      'atlantic-keys-tab': `${R2_URL}/atlantic-keys-tab.pdf`,
      'atlantic-bass-tab': `${R2_URL}/atlantic-bass-tab.pdf`,
      'atlantic-drums-tab': `${R2_URL}/atlantic-drums-tab.pdf`,
      
      'feign-guitar-tab': `${R2_URL}/feign-guitar-tab.pdf`,
      'feign-keys-tab': `${R2_URL}/feign-keys-tab.pdf`,
      'feign-bass-tab': `${R2_URL}/feign-bass-tab.pdf`,
      'feign-drums-tab': `${R2_URL}/feign-drums-tab.pdf`,
      
      'dark-wonderful-world-guitar-tab': `${R2_URL}/dark-wonderful-world-guitar-tab.pdf`,
      'dark-wonderful-world-keys-tab': `${R2_URL}/dark-wonderful-world-keys-tab.pdf`,
      'dark-wonderful-world-bass-tab': `${R2_URL}/dark-wonderful-world-bass-tab.pdf`,
      'dark-wonderful-world-drums-tab': `${R2_URL}/dark-wonderful-world-drums-tab.pdf`,
      
      'quietness-guitar-tab': `${R2_URL}/quietness-guitar-tab.pdf`,
      'quietness-keys-tab': `${R2_URL}/quietness-keys-tab.pdf`,
      'quietness-bass-tab': `${R2_URL}/quietness-bass-tab.pdf`,
      'quietness-drums-tab': `${R2_URL}/quietness-drums-tab.pdf`,
      
      'cant-feel-my-face-guitar-tab': `${R2_URL}/cant-feel-my-face-guitar-tab.pdf`,
    };
    
    console.log('🔍 Looking for download file:', {
      itemId: item.id,
      itemTitle: item.title,
      itemSubtitle: item.subtitle,
      possibleIds,
      category: item.category,
      type: item.type
    });
    
    for (const id of possibleIds) {
      if (downloadMap[id]) {
        console.log('✅ Found file for ID:', id);
        return downloadMap[id];
      }
    }
    
    const defaultFile = `/download/${titleSlug}-${subtitleSlug}.wav`;
    console.log('⚠️ No mapping found, using default:', defaultFile);
    return defaultFile;
  }
  
  return null;
};

export async function POST(req: NextRequest) {
  console.log('📧 Send confirmation API called');
  
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is missing!');
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
  }

  const { name, email, cartItems, receiptUrl, orderId } = await req.json();
  console.log('🧾 Request data:', { name, email, cartItemsCount: cartItems?.length, receiptUrl, orderId });

  // 🆕 เช็คสมุดบันทึกก่อนส่ง กันอีเมลซ้ำ (ไม่ว่าจะเรียกจากหน้าเว็บหรือระบบหลังบ้าน)
  if (orderId) {
    const claimed = await tryClaimEmailSending(orderId);
    if (!claimed) {
      console.log('🟢 Email already sent for this order — skipping duplicate send');
      return NextResponse.json({ success: true, skipped: true });
    }
  }

  try {
    let linksHtml = '';
    let hasDigitalItems = false;
    let hasPhysicalItems = false;
    let digitalItemsCount = 0;

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
              expiresInMinutes: 2880
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

    let mainContent = '';
    
    if (hasDigitalItems && hasPhysicalItems) {
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

    const publicBaseUrl = 'https://unda-website.vercel.app';
      
    const receiptHtml = receiptUrl
      ? `<p style="margin-top: 24px;">You can view your payment receipt here:<br/>
          <a href="${receiptUrl}" target="_blank" style="color: #dc9e63; text-decoration: underline;">
            Stripe Payment Receipt
          </a>
        </p>`
      : '';

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