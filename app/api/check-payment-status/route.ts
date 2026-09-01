// app/api/check-payment-status/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const isLive = process.env.NODE_ENV === 'production';

const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY ??
  (isLive ? process.env.STRIPE_SECRET_KEY_LIVE : process.env.STRIPE_SECRET_KEY_TEST);

if (!stripeSecretKey) {
  throw new Error('🧨 STRIPE_SECRET_KEY is not defined.');
}

const stripe = new Stripe(stripeSecretKey as string, {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
});

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const paymentIntentId = searchParams.get('paymentIntentId');

    if (!paymentIntentId || !/^pi_/.test(paymentIntentId)) {
      return NextResponse.json(
        { error: 'Missing or invalid paymentIntentId.' },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return NextResponse.json({
      status: paymentIntent.status, // 'succeeded' | 'processing' | 'requires_action' | 'requires_payment_method' | ...
      orderId: paymentIntent.metadata?.id || null,
    });

  } catch (err: any) {
    console.error('🔥 check-payment-status error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}