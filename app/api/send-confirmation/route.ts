// /app/api/send-confirmation/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

const resend = new Resend(process.env.RESEND_API_KEY);
const DOWNLOAD_DB = path.join(process.cwd(), 'data', 'downloads.json');

interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  type?: string; // for safety
}

const getDownloadFileForItem = (item: CartItem): string | null => {
  const demoMap: Record<string, string> = {
    'anomic-drums': '/demo/anomic-drums.pdf',
    'jyy-guitars': '/demo/jyy-guitars.pdf',
    'atlantic-guitar': '/demo/atlantic-guitar.wav',
    'out-dark-drums': '/demo/out-dark-drums.wav',
    'reddown-bass': '/demo/reddown-bass.wav',
    // 👉 เพิ่มตามที่ต้องการ
  };
  return demoMap[item.id] || null;
};

export async function POST(req: NextRequest) {
  const { name, email, cartItems, receiptUrl } = await req.json(); // 👈 เพิ่ม receiptUrl

  console.log('🧾 cartItems received:', cartItems);

  try {
    let linksHtml = '';

    for (const item of cartItems || []) {
      if (item.type === 'digital' || item.category === 'Backing Track') {
        const filePath = getDownloadFileForItem(item);
        if (filePath) {
          const token = uuidv4();
          const entry = {
            token,
            filePath,
            createdAt: new Date().toISOString(),
            expiresInMinutes: 60,
          };

          let existing = [];
          try {
            const raw = await fs.readFile(DOWNLOAD_DB, 'utf-8');
            existing = JSON.parse(raw);
          } catch {}

          existing.push(entry);
          await fs.writeFile(DOWNLOAD_DB, JSON.stringify(existing, null, 2));

          const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000';

          linksHtml += `<li style="margin-bottom: 10px;"><a href="${baseUrl}/download/${token}" target="_blank" style="color: #dc9e63; text-decoration: underline;">${item.title} – ${item.subtitle}</a></li>`;
        }
      }
    }

    const receiptHtml = receiptUrl
      ? `<p style="margin-top: 24px;">You can also view your payment receipt here:<br/>
          <a href="${receiptUrl}" target="_blank" style="color: #dc9e63; text-decoration: underline;">Stripe Payment Receipt</a></p>`
      : '';

    const html = `
      <body style="margin: 0; padding: 0; font-family: Cinzel, serif; background-color: #000;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" 
          style="background-image: url('https://unda-website.vercel.app/catmoon-bg.jpeg'); background-size: cover; background-position: center;">
          <tr>
            <td align="center" style="background-color: rgba(0, 0, 0, 0.8); padding: 60px 20px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" 
                style="margin: 0 auto; background-image: url('https://unda-website.vercel.app/redsky-bg.jpeg'); background-size: cover; border-radius: 12px; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
                <tr>
                  <td style="padding: 40px; color: #f8fcdc !important;">
                    <h1 style="color: #dc9e63 !important; font-size: 28px; margin-bottom: 20px;">Thank you for your purchase!</h1>
                    <p style="color: #f8fcdc; margin-bottom: 16px;">Hi <strong>${name}</strong>,</p>
<p style="color: #f8fcdc; margin-bottom: 16px;">We're thrilled to let you know that your order has been successfully received and is now being processed.</p>
                    ${
                      linksHtml
                        ? `<p style="margin-top: 30px;">Here are your download links (valid for 1 hour):</p><ul style="padding-left: 20px;">${linksHtml}</ul>`
                        : '<p style="margin-bottom: 30px;">You’ll receive another email once your items have shipped.</p>'
                    }
                    ${receiptHtml}
                    <a href="https://www.undaalunda.com" 
                      style="display: inline-block; background-color: #dc9e63; color: #000000 !important; text-decoration: none !important; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 14px; margin-top: 30px;">
                      Return to Store
                    </a>
                    <p style="font-size: 12px; color: #999 !important; margin-top: 30px; text-align: center;">
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

    await resend.emails.send({
      from: 'Unda Alunda <noreply@updates.undaalunda.com>',
      to: [email],
      subject: 'Thank you for your order — Unda Alunda',
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('🔥 Email send failed:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}