// /app/api/admin/ship-order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  console.log('📦 Ship Order API called');

  try {
    const { orderId, trackingNumber } = await req.json();

    console.log('📋 Request:', { orderId, trackingNumber });

    if (!orderId || !trackingNumber) {
      return NextResponse.json(
        { error: 'Missing orderId or trackingNumber' },
        { status: 400 }
      );
    }

    // 1. ดึงข้อมูล Order
    const { data: orderData, error: fetchError } = await supabase
      .from('Orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError || !orderData) {
      console.error('❌ Order not found:', orderId, fetchError);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('✅ Order found:', {
      id: orderData.id,
      email: orderData.email,
      status: orderData.status
    });

    // 2. Update Order Status + Tracking Number
    const { error: updateError } = await supabase
      .from('Orders')
      .update({
        status: 'shipped',
        tracking_number: trackingNumber,
        shipped_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('❌ Update failed:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    console.log('✅ Order updated to shipped');

    // 3. สร้าง URLs
    const trackingUrl = `https://www.dhl.com/th-en/home/tracking.html?tracking-id=${trackingNumber}`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://unda-website.vercel.app';
    const orderStatusUrl = `${baseUrl}/order-status?orderId=${orderId}&trackingNumber=${trackingNumber}`;

    // 4. ส่ง Email
    const customerName = orderData.shipping_info?.name || orderData.billing_info?.firstName || 'Customer';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Order Has Been Shipped!</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
        <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);">
          
          <!-- Header -->
          <div style="position: relative; height: 300px; background-image: url('${baseUrl}/email-header-bg.webp'); background-size: cover; background-position: center;">
            <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(10,10,10,0.95));"></div>
            <div style="position: relative; padding: 60px 40px; text-align: center;">
              <h1 style="color: #d4af37; font-size: 36px; font-weight: 700; margin: 0 0 20px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                Your Order Has Been Shipped!
              </h1>
              <p style="color: #ffffff; font-size: 18px; margin: 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
                Hi ${customerName},
              </p>
            </div>
          </div>

          <!-- Content -->
          <div style="padding: 40px;">
            <p style="color: #e0e0e0; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Great news! Your order has been shipped via <strong style="color: #d4af37;">DHL Express</strong>. 🎉
            </p>

            <!-- Tracking Info Box -->
            <div style="background: rgba(212, 175, 55, 0.1); border-left: 4px solid #d4af37; padding: 24px; margin: 30px 0; border-radius: 4px;">
              <h2 style="color: #d4af37; font-size: 20px; font-weight: 600; margin: 0 0 16px 0;">
                Tracking Information
              </h2>
              <div style="margin-bottom: 12px;">
                <span style="color: #999999; font-size: 14px;">Tracking Number:</span>
                <p style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 4px 0 0 0; font-family: 'Courier New', monospace;">
                  ${trackingNumber}
                </p>
              </div>
              <div>
                <span style="color: #999999; font-size: 14px;">Courier:</span>
                <p style="color: #ffffff; font-size: 16px; margin: 4px 0 0 0;">
                  DHL Express
                </p>
              </div>
            </div>

            <!-- Track Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${trackingUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); color: #000000; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);">
                Track Your Package
              </a>
            </div>

            <p style="color: #999999; font-size: 14px; text-align: center; margin: 20px 0;">
              You can track your package anytime using the link above.
            </p>

            <!-- Alternative Tracking Link -->
            <div style="margin: 30px 0; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 8px;">
              <p style="color: #999999; font-size: 14px; margin: 0 0 12px 0;">
                Or view your order status on our website:
              </p>
              <a href="${orderStatusUrl}" 
                 style="color: #d4af37; text-decoration: none; font-size: 14px; word-break: break-all;">
                ${orderStatusUrl}
              </a>
            </div>

            <p style="color: #e0e0e0; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
              Your package should arrive within <strong>3-7 business days</strong>.
            </p>

            <p style="color: #e0e0e0; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
              Thank you for your order!
            </p>

            <p style="color: #d4af37; font-size: 16px; font-weight: 600; margin: 30px 0 0 0;">
              UNDA ALUNDA
            </p>
          </div>

          <!-- Footer -->
          <div style="background: rgba(0,0,0,0.3); padding: 30px 40px; text-align: center; border-top: 1px solid rgba(212, 175, 55, 0.2);">
            <a href="${baseUrl}" 
               style="color: #d4af37; text-decoration: none; font-size: 14px; margin: 0 0 10px 0; display: inline-block;">
              Return to Store
            </a>
            <p style="color: #666666; font-size: 12px; margin: 15px 0 0 0;">
              Copyright © 2025 Unda Alunda
            </p>
          </div>

        </div>
      </body>
      </html>
    `;

    console.log('📧 Sending email to:', orderData.email);

    const emailResult = await resend.emails.send({
      from: 'UNDA Orders <orders@unda-website.vercel.app>',
      to: orderData.email,
      subject: `📦 Your Order Has Been Shipped! - Order #${orderId}`,
      html: emailHtml,
    });

    console.log('✅ Email sent:', emailResult);

    return NextResponse.json({
      success: true,
      message: 'Order shipped successfully',
      trackingNumber,
      emailSent: true
    });

  } catch (error) {
    console.error('🔥 Ship order error:', error);
    return NextResponse.json(
      {
        error: 'Failed to ship order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}