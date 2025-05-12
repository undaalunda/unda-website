//send-confirmation

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();

  try {
    const data = await resend.emails.send({
      from: 'Unda Alunda <noreply@updates.undaalunda.com>',
      to: [email],
      subject: 'Thank you for your order — Unda Alunda',
      html: `
        <body style="margin: 0; padding: 0; font-family: Cinzel, serif; background-color: #000;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" 
            style="background-image: url('https://unda-website.vercel.app/catmoon-bg.jpeg'); background-size: cover; background-position: center; background-repeat: no-repeat;">
            <tr>
              <td align="center" style="background-color: rgba(0, 0, 0, 0.8); padding: 60px 20px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" 
                  style="margin: 0 auto; background-image: url('https://unda-website.vercel.app/redsky-bg.jpeg'); background-size: cover; background-position: center; border-radius: 12px; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
                  <tr>
                    <td style="padding: 40px; color: #f8fcdc !important;">
                      <h1 style="color: #dc9e63 !important; font-size: 28px; margin-bottom: 20px;">Thank you for your purchase!</h1>
                      <p style="margin-bottom: 16px;">Hi <strong>${name}</strong>,</p>
                      <p style="margin-bottom: 16px;">We're thrilled to let you know that your order has been successfully received and is now being processed.</p>
                      <p style="margin-bottom: 30px;">You’ll receive another email once your items have shipped.</p>
                      <a href="https://www.undaalunda.com" 
                        style="display: inline-block; background-color: #dc9e63; color: #000000 !important; text-decoration: none !important; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 14px;">
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
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('🔥 Email send failed:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}