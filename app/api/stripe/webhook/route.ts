// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import supabase from '../../../../lib/supabase';

const isLive = process.env.NODE_ENV === 'production';

// ลองหา STRIPE_SECRET_KEY จากหลายแหล่ง
const stripeSecretKey = 
  process.env.STRIPE_SECRET_KEY ||
  process.env.STRIPE_SECRET_KEY_TEST ||
  process.env.STRIPE_SECRET_KEY_LIVE;

// ลองหา WEBHOOK_SECRET จากหลายแหล่ง  
const webhookSecret = 
  process.env.STRIPE_WEBHOOK_SECRET_TEST ||  // ✅ ตรงกับที่มีใน Vercel
  process.env.STRIPE_WEBHOOK_SECRET_LIVE ||
  process.env.STRIPE_WEBHOOK_SECRET;

console.log('🔍 Environment check:', {
  isLive,
  hasStripeKey: !!stripeSecretKey,
  hasWebhookSecret: !!webhookSecret,
  nodeEnv: process.env.NODE_ENV,
  availableKeys: Object.keys(process.env).filter(key => key.includes('STRIPE'))
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
    console.log('🔍 Full event metadata:', JSON.stringify(event.data.object, null, 2));

    if (event.type === 'payment_intent.succeeded' || event.type === 'charge.succeeded') {
      const object = event.data.object as any;
      const { email, id: orderId } = object.metadata || {};

      console.log('📧 Email from metadata:', email);
      console.log('🆔 OrderId from metadata:', orderId);

      if (!email || !orderId) {
        console.warn('⚠️ Missing metadata (email or orderId)');
        return NextResponse.json({ received: true, warning: 'Missing metadata' });
      }

      try {
        // ค้นหา order ใน database
        const { data: order, error: fetchError } = await supabase
          .from('Orders')
          .select('*')
          .eq('id', orderId)
          .eq('email', email)
          .single();

        if (fetchError) {
          console.error('❌ Supabase fetch error:', fetchError.message);
          return NextResponse.json({ error: 'Database fetch failed' }, { status: 500 });
        }

        if (!order) {
          console.error('❌ Order not found');
          return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        console.log('📦 Found order:', order.id, 'Status:', order.payment_status);

        // อัพเดทสถานะถ้ายังไม่เป็น succeeded
        if (order.payment_status !== 'succeeded') {
          const updateData: any = { 
            payment_status: 'succeeded',
            updated_at: new Date().toISOString()
          };

          // ถ้าเป็น digital only ให้เปลี่ยนสถานะเป็น paid เลย
          if (!order.shipping_method && !order.tracking_number) {
            updateData.status = 'paid';
          }

          const { error: updateError } = await supabase
            .from('Orders')
            .update(updateData)
            .eq('id', orderId);

          if (updateError) {
            console.error('❌ Supabase update error:', updateError.message);
            return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
          }

          console.log(`✅ Order ${orderId} updated successfully to payment_status: succeeded`);
        } else {
          console.log('🟢 Order already marked as succeeded');
        }

      } catch (dbError: any) {
        console.error('💥 Database operation error:', dbError.message);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }
      
    } else {
      console.log('🙅 Ignored event type:', event.type);
    }

    return NextResponse.json({ received: true });

  } catch (err: any) {
    console.error('💥 Webhook handler unexpected error:', err.message);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}