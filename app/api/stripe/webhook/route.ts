// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import supabase from '.../../lib/supabase';

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
      
      // 🔍 DEBUG: ดู metadata ทั้งหมด
      console.log('🔍 FULL METADATA:', JSON.stringify(object.metadata, null, 2));
      
      // ✅ ลองหา orderId จากหลาย field
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
        // 🔍 DEBUG: ค้นหา order ทุกวิธี
        console.log('🔍 Searching for order with:', { email, orderId });
        
        // ✅ ค้นหาแบบ flexible - ลอง search ทั้ง string และ UUID
        const { data: orders, error: fetchError } = await supabase
          .from('Orders')
          .select('*')
          .eq('email', email)
          .or(`id.eq.${orderId},id.eq."${orderId}"`);

        if (fetchError) {
          console.error('❌ Supabase fetch error:', fetchError.message);
          
          // ✅ ลองค้นหาแบบอื่น
          const { data: allOrders, error: altError } = await supabase
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
          // ✅ ลองค้นหาด้วย email อย่างเดียว
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

        // ✅ อัพเดทสถานะถ้ายังไม่เป็น succeeded
        if (order.payment_status !== 'succeeded') {
          const updateData: any = { 
            payment_status: 'succeeded'
          };

          // ✅ ถ้าเป็น digital only ให้เปลี่ยนสถานะเป็น paid
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
        } else {
          console.log('🟢 Order already marked as succeeded');
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