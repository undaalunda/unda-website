// app/api/create-payment-intent/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const isLive = process.env.NODE_ENV === 'production';

const stripeSecretKey = isLive
  ? process.env.STRIPE_SECRET_KEY_LIVE
  : process.env.STRIPE_SECRET_KEY_TEST;

const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('🧨 STRIPE_SECRET_KEY is not defined.');
}
if (!recaptchaSecretKey) {
  throw new Error('🧨 RECAPTCHA_SECRET_KEY is not defined.');
}

const stripe = new Stripe(stripeSecretKey as string, {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
});

function isValidAmount(amount: any): boolean {
  return typeof amount === 'number' && amount > 0 && amount < 1000000;
}

function isValidPaymentMethodId(id: any): boolean {
  return typeof id === 'string' && /^pm_/.test(id);
}

async function verifyCaptcha(token: string, ip?: string) {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: recaptchaSecretKey!,
      response: token,
      ...(ip ? { remoteip: ip } : {}),
    }),
  });

  const data = await response.json();
  return data;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      paymentMethodId,
      amount,
      token,
      email = 'unknown@example.com',
      marketing = false,
      orderId,
    } = body;

    if (!paymentMethodId || !amount || !token || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields: paymentMethodId, amount, token, or orderId.' },
        { status: 400 }
      );
    }

    if (!isValidPaymentMethodId(paymentMethodId)) {
      return NextResponse.json(
        { error: 'Invalid paymentMethodId format.' },
        { status: 400 }
      );
    }

    if (!isValidAmount(amount)) {
      return NextResponse.json(
        { error: 'Invalid amount. Must be a number greater than 0.' },
        { status: 400 }
      );
    }

    const ip = req.headers.get('x-forwarded-for') || undefined;
    const captchaResult = await verifyCaptcha(token, ip);

    if (!captchaResult.success || captchaResult.score < 0.5 || captchaResult.action !== 'checkout') {
      console.warn('❌ CAPTCHA failed:', captchaResult);
      return NextResponse.json(
        { error: 'Captcha verification failed.' },
        { status: 403 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      metadata: {
        email: email,
        marketing_consent: marketing ? 'yes' : 'no',
        source: 'UndaAlundaStore',
        created_from: 'create-payment-intent-endpoint',
        id: orderId, // 🧨 THE MISSING PIECE
      },
      expand: ['latest_charge'],
    });

    const receiptUrl = (paymentIntent.latest_charge as Stripe.Charge)?.receipt_url || null;

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      receiptUrl,
    });
  } catch (err: any) {
    console.error('🔥 PaymentIntent error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}