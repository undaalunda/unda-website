///app/api/stripe/webhook/route.ts 

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import supabase from '../../../../lib/supabase';

// ✅ ใช้ ENV ให้ถูกฝั่งตาม NODE_ENV
const isLive = process.env.NODE_ENV === 'production';

const stripe = new Stripe(
  isLive
    ? process.env.STRIPE_SECRET_KEY_LIVE!
    : process.env.STRIPE_SECRET_KEY_TEST!,
  { apiVersion: '2024-04-10' as Stripe.LatestApiVersion }
);

const webhookSecret = isLive
  ? process.env.STRIPE_WEBHOOK_SECRET_LIVE!
  : process.env.STRIPE_WEBHOOK_SECRET_TEST!;

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    console.error('❌ Missing Stripe signature header.');
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  let event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('❌ Stripe webhook verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log('[📬 Webhook] Event received:', event.type);

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('✅ PaymentIntent succeeded:', paymentIntent.id);

      const email = paymentIntent.metadata?.email;
      if (!email) {
        console.warn('⚠️ Missing email in metadata. Skipping DB update.');
        break;
      }

      try {
        // ⚙️ หารายการ order ล่าสุดที่ payment_status ยังเป็น pending
        const { data: orders, error: fetchError } = await supabase
          .from('Orders')
          .select('id')
          .eq('email', email)
          .eq('payment_status', 'pending')
          .order('created_at', { ascending: false })
          .limit(1);

        if (fetchError || !orders || orders.length === 0) {
          console.warn('⚠️ No pending order found for email:', email);
          break;
        }

        const latestOrderId = orders[0].id;

        const { error: updateError } = await supabase
          .from('Orders')
          .update({ payment_status: 'succeeded' })
          .eq('id', latestOrderId);

        if (updateError) {
          console.error(
            '❌ Failed to update payment status in Supabase:',
            updateError.message
          );
        } else {
          console.log(
            `✅ Updated payment_status to "succeeded" for order ID: ${latestOrderId}`
          );
        }
      } catch (err) {
        console.error('🔥 Unexpected DB error during update:', err);
      }

      break;
    }

    case 'payment_intent.payment_failed': {
      const failedIntent = event.data.object as Stripe.PaymentIntent;
      console.warn('❌ Payment failed:', failedIntent.id);
      break;
    }

    default:
      console.log(`🔔 Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}