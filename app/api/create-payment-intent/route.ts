// app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// ป้องกัน build-time crash ถ้า STRIPE_SECRET_KEY หาย
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('🧨 STRIPE_SECRET_KEY is not defined in environment variables. Please set it in .env or deployment settings.');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-04-10' as any,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paymentMethodId, amount } = body;

    if (!paymentMethodId || !amount) {
      return NextResponse.json(
        { error: 'Missing paymentMethodId or amount in request body.' },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
    });

    return NextResponse.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error('🔥 PaymentIntent error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}