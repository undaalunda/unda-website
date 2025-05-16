///app/api/stripe/webhook/route.ts 

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import supabase from '../../../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    console.error('❌ Missing Stripe signature header.');
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  let event;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('❌ Stripe webhook verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

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
        const { error } = await supabase
          .from('Orders')
          .update({ payment_status: 'succeeded' })
          .eq('email', email)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('❌ Failed to update payment status in Supabase:', error.message);
        } else {
          console.log('✅ Updated payment_status to succeeded in Supabase');
        }
      } catch (err) {
        console.error('🔥 Unexpected DB error:', err);
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