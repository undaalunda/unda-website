// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import supabase from '../../../../lib/supabase';

const isLive = process.env.NODE_ENV === 'production';

const stripeSecretKey = 
  process.env.STRIPE_SECRET_KEY ||
  process.env.STRIPE_SECRET_KEY_TEST ||
  process.env.STRIPE_SECRET_KEY_LIVE;

const webhookSecret = 
  process.env.STRIPE_WEBHOOK_SECRET_TEST ||
  process.env.STRIPE_WEBHOOK_SECRET_LIVE ||
  process.env.STRIPE_WEBHOOK_SECRET;

console.log('🔍 Environment check:', {
  isLive,
  hasStripeKey: !!stripeSecretKey,
  hasWebhookSecret: !!webhookSecret,
  nodeEnv: process.env.NODE_ENV,
});

if (!stripeSecretKey || !webhookSecret) {
  console.error('🚨 Missing Stripe keys. StripeKey:', !!stripeSecretKey, 'WebhookSecret:', !!webhookSecret);
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
}) : null;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 🆕 อีเมลสำรอง — ยิงกรณีลูกค้าปิดแท็บไปก่อนที่ frontend จะส่งอีเมลเองได้ทัน
// (เช่น สแกน PromptPay QR แล้วปิดเว็บก่อนที่ polling จะจับได้ว่าจ่ายสำเร็จ)
async function sendFallbackConfirmation(order: any) {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.undaalunda.com';
    const res = await fetch(`${siteUrl}/api/send-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: order.billing_info?.firstName || '',
        email: order.email,
        cartItems: order.items || [],
        receiptUrl: null,
        orderId: order.id,
      }),
    });

    if (!res.ok) {
      console.error('❌ Fallback send-confirmation failed:', await res.text());
    } else {
      console.log('✅ Fallback confirmation email sent for order:', order.id);
    }
  } catch (err: any) {
    console.error('❌ Fallback send-confirmation error:', err.message);
  }
}

// 🆕 เช็คว่า frontend บันทึก billing_info เสร็จหรือยัง (แปลว่า frontend
// น่าจะส่งอีเมลที่ถูกต้องไปแล้ว) รอสูงสุด ~6 วิ ก่อนตัดสินใจว่าต้องส่ง fallback ไหม
async function shouldSendFallbackEmail(orderId: string): Promise<{ send: boolean; latestOrder: any }> {
  for (let attempt = 0; attempt < 3; attempt++) {
    await wait(2000); // รอ 2 วิต่อรอบ รวม 3 รอบ = 6 วิ

    const { data: latestOrder } = await supabase
      .from('Orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (latestOrder?.billing_info?.firstName) {
      // frontend บันทึกข้อมูลลูกค้าสำเร็จแล้ว = น่าจะส่งอีเมลไปแล้วเช่นกัน
      return { send: false, latestOrder };
    }
  }

  // รอครบแล้วยังไม่มีข้อมูล — frontend น่าจะไม่ได้ทำงานต่อ (ลูกค้าปิดแท็บ) ต้องส่ง fallback
  const { data: latestOrder } = await supabase
    .from('Orders')
    .select('*')
    .eq('id', orderId)
    .single();

  return { send: true, latestOrder };
}

export async function POST(req: NextRequest) {
  try {
    console.log('🎯 Webhook received');

    if (!stripe) {
      console.error('❌ Stripe not initialized');
      return NextResponse.json({ error: 'Stripe configuration missing' }, { status: 500 });
    }

    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!sig) {
      console.error('❌ No signature found');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret!);
      console.log('✅ Event constructed successfully:', event.type);
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('📬 Stripe event received:', event.type);

    if (event.type === 'payment_intent.succeeded' || event.type === 'charge.succeeded') {
      const object = event.data.object as any;

      console.log('🔍 FULL METADATA:', JSON.stringify(object.metadata, null, 2));

      const email = object.metadata?.email;
      const orderId = object.metadata?.id || object.metadata?.orderId || object.metadata?.order_id;

      console.log('📧 Email from metadata:', email);
      console.log('🆔 OrderId from metadata:', orderId);
      console.log('🔍 Available metadata keys:', Object.keys(object.metadata || {}));

      if (!email || !orderId) {
        console.warn('⚠️ Missing metadata:', { email: !!email, orderId: !!orderId });
        console.warn('⚠️ Full metadata object:', object.metadata);
        return NextResponse.json({
          received: true,
          warning: 'Missing metadata',
          debug: { metadata: object.metadata }
        });
      }

      try {
        console.log('🔍 Searching for order with:', { email, orderId });

        const { data: orders, error: fetchError } = await supabase
          .from('Orders')
          .select('*')
          .eq('email', email)
          .or(`id.eq.${orderId},id.eq."${orderId}"`);

        if (fetchError) {
          console.error('❌ Supabase fetch error:', fetchError.message);

          const { data: allOrders } = await supabase
            .from('Orders')
            .select('*')
            .eq('email', email)
            .order('created_at', { ascending: false })
            .limit(5);

          console.log('🔍 Recent orders for email:', allOrders?.map(o => ({ id: o.id, status: o.payment_status })));

          return NextResponse.json({ error: 'Database fetch failed' }, { status: 500 });
        }

        console.log('🔍 Found orders:', orders?.length || 0);
        console.log('🔍 Orders data:', orders?.map(o => ({
          id: o.id,
          payment_status: o.payment_status,
          created_at: o.created_at
        })));

        if (!orders || orders.length === 0) {
          const { data: emailOrders } = await supabase
            .from('Orders')
            .select('*')
            .eq('email', email)
            .order('created_at', { ascending: false })
            .limit(3);

          console.log('🔍 All orders for this email:', emailOrders?.map(o => ({
            id: o.id,
            payment_status: o.payment_status
          })));

          console.error('❌ Order not found for ID:', orderId, 'Email:', email);
          return NextResponse.json({
            error: 'Order not found',
            debug: {
              searchedOrderId: orderId,
              searchedEmail: email,
              foundOrders: emailOrders?.length || 0
            }
          }, { status: 404 });
        }

        const order = orders[0];
        console.log('📦 Found order:', order.id, 'Current payment_status:', order.payment_status);

        // ✅ ทำงาน (update + ลด stock) เฉพาะตอนที่เพิ่ง "สำเร็จใหม่" เท่านั้น
        const wasAlreadySucceeded = order.payment_status === 'succeeded';

        if (!wasAlreadySucceeded) {
          const updateData: any = {
            payment_status: 'succeeded'
          };

          if (!order.shipping_method || order.shipping_method === null) {
            updateData.status = 'paid';
            console.log('🎵 Digital order detected, setting status to paid');
          }

          console.log('🔄 Updating order with data:', updateData);

          const { data: updatedData, error: updateError } = await supabase
            .from('Orders')
            .update(updateData)
            .eq('id', order.id)
            .select();

          if (updateError) {
            console.error('❌ Supabase update error:', updateError.message);
            console.error('❌ Full error details:', JSON.stringify(updateError, null, 2));
            return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
          }

          console.log(`✅ Order ${order.id} updated successfully!`);
          console.log('📋 Updated data:', updatedData);

          // 📦 ลด Stock สำหรับสินค้าที่ track_stock = true
          try {
            const items = order.items || [];
            console.log('📦 Processing stock reduction for', items.length, 'items');

            for (const item of items) {
              const { data: product } = await supabase
                .from('Products')
                .select('stock, track_stock')
                .eq('id', item.id)
                .single();

              if (product && product.track_stock && product.stock > 0) {
                const newStock = Math.max(0, product.stock - (item.quantity || 1));

                const { error: stockError } = await supabase
                  .from('Products')
                  .update({
                    stock: newStock,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', item.id);

                if (stockError) {
                  console.error(`❌ Failed to reduce stock for ${item.id}:`, stockError);
                } else {
                  console.log(`📦 Reduced stock for ${item.id}: ${product.stock} → ${newStock}`);
                }
              }
            }
          } catch (stockError: any) {
            console.error('❌ Stock reduction error:', stockError.message);
          }

          // 🆕 รอเช็คว่า frontend บันทึก billing_info เสร็จหรือยัง ก่อนตัดสินใจส่ง fallback email
          // กันไม่ให้ webhook แซงส่งอีเมลก่อน frontend ทำเสร็จ (ซึ่งจะทำให้อีเมลไม่มีชื่อ/ลิงก์ใช้ไม่ได้)
          const { send, latestOrder } = await shouldSendFallbackEmail(order.id);

          if (send) {
            console.log('📧 Frontend did not complete in time — sending fallback email');
            await sendFallbackConfirmation(latestOrder || { ...order, ...updatedData?.[0] });
          } else {
            console.log('🟢 Frontend already completed the order — skipping fallback email');
          }

        } else {
          console.log('🟢 Order already marked as succeeded — skipping duplicate processing');
        }

        return NextResponse.json({
          received: true,
          processed: true,
          orderId: order.id,
          newStatus: 'succeeded'
        });

      } catch (dbError: any) {
        console.error('💥 Database operation error:', dbError.message);
        console.error('💥 Full stack:', dbError.stack);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }

    } else {
      console.log('🙅 Ignored event type:', event.type);
    }

    return NextResponse.json({ received: true });

  } catch (err: any) {
    console.error('💥 Webhook handler unexpected error:', err.message);
    console.error('💥 Full error stack:', err.stack);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}