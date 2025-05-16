// /app/api/stripe/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

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
    const rawBody = await req.text(); // ใช้แบบ web API
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('❌ Stripe webhook verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // ✅ ตรวจจับ event ตามประเภท
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('✅ PaymentIntent succeeded:', paymentIntent.id);
      // 👉 ทำอะไรต่อ เช่น update สถานะ order, ส่งอีเมล, ฯลฯ
      break;

    case 'payment_intent.payment_failed':
      const failedIntent = event.data.object as Stripe.PaymentIntent;
      console.warn('❌ Payment failed:', failedIntent.id);
      break;

    default:
      console.log(`🔔 Received unknown event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}