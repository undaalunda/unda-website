// app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10' as any,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { paymentMethodId, amount } = body;

  try {
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