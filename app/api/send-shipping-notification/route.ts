// app/api/send-shipping-notification/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import supabase from '../../../lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  console.log('📧 Shipping notification API called');
  
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is missing!');
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
  }

  try {
    const { orderId, trackingNumber } = await req.json();
    
    console.log('📦 Request data:', { orderId, trackingNumber });

    if (!orderId || !trackingNumber) {
      return NextResponse.json({ 
        error: 'Missing orderId or trackingNumber' 
      }, { status: 400 });
    }

    // 🔍 ดึงข้อมูล order จาก Supabase
    const { data: order, error: fetchError } = await supabase
      .from('Orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      console.error('❌ Order not found:', orderId, fetchError);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    console.log('✅ Order found:', {
      orderId: order.id,
      email: order.email,
      status: order.status
    });

    // 🔗 สร้าง tracking URL
    const trackingUrl = `https://www.dhl.com/th-en/home/tracking.html?tracking-id=${trackingNumber}`;
    const publicBaseUrl = process.env.NODE_ENV === 'production'
      ? (process.env.NEXT_PUBLIC_BASE_URL || 'https://unda-website.vercel.app')
      : 'http://localhost:3000';

    // 📧 สร้างเนื้อหา email
    const customerName = order.billing_info?.firstName || 'Customer';
    
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
                      Your Order Has Been Shipped!
                    </h1>
                    <p style="color: #f8fcdc; margin-bottom: 16px;">
                      Hi <strong>${customerName}</strong>,
                    </p>
                    <p style="color: #f8fcdc; margin-bottom: 16px;">
                      Great news! Your order has been shipped via DHL.
                    </p>
                    
                    <div style="background-color: rgba(220, 158, 99, 0.1); border-left: 4px solid #dc9e63; padding: 20px; margin: 30px 0;">
                      <p style="margin: 0 0 10px 0; color: #dc9e63; font-weight: bold;">
                        Tracking Information
                      </p>
                      <p style="margin: 0 0 5px 0; color: #f8fcdc;">
                        <strong>Tracking Number:</strong> ${trackingNumber}
                      </p>
                      <p style="margin: 0; color: #f8fcdc;">
                        <strong>Courier:</strong> DHL Express
                      </p>
                    </div>

                    <a href="${trackingUrl}" target="_blank"
                      style="display: inline-block; background-color: #dc9e63; color: #000000; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 14px; margin-top: 20px;">
                      Track Your Package
                    </a>

                    <p style="font-size: 14px; color: #999; margin-top: 30px;">
                      You can track your package anytime using the link above.
                    </p>

                    <a href="${publicBaseUrl}" 
                      style="display: inline-block; color: #dc9e63; text-decoration: underline; margin-top: 20px; font-size: 14px;">
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

    console.log('📨 Sending email to:', order.email);

    // ✉️ ส่ง email
    const emailResult = await resend.emails.send({
      from: 'Unda Alunda <noreply@updates.undaalunda.com>',
      to: [order.email],
      subject: 'Your Order Has Been Shipped — Unda Alunda',
      html,
    });

    console.log('✅ Email sent successfully:', JSON.stringify(emailResult, null, 2));

    return NextResponse.json({ 
      success: true
    });  // ← แก้ตรงนี้ ง่ายสุด!

  } catch (error) {
    console.error('🔥 Email send failed:', error);
    return NextResponse.json({ 
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}