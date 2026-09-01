// app/api/create-payment-intent/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const isLive = process.env.NODE_ENV === 'production';

const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY ??
  (isLive ? process.env.STRIPE_SECRET_KEY_LIVE : process.env.STRIPE_SECRET_KEY_TEST);

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

// 🇹🇭 Fallback USD → THB rate used only if the live FX lookup fails.
// Update this number occasionally so it doesn't drift too far from reality.
const FALLBACK_USD_TO_THB = 36.5;

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

// 🇹🇭 Live USD → THB rate, with a safe fallback so checkout never blocks on this.
async function getUsdToThbRate(): Promise<number> {
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error('FX API bad response');
    const data = await res.json();
    const rate = data?.rates?.THB;
    if (typeof rate === 'number' && rate > 0) return rate;
    throw new Error('FX API missing THB rate');
  } catch (err) {
    console.warn('⚠️ FX rate lookup failed, using fallback rate:', err);
    return FALLBACK_USD_TO_THB;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      paymentMethodId,
      paymentMethod = 'card', // 🆕 'card' | 'promptpay'
      amount, // always arrives as USD cents from the cart
      token,
      email = 'unknown@example.com',
      marketing = false,
      orderId,
    } = body;

    if (!amount || !token || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, token, or orderId.' },
        { status: 400 }
      );
    }

    if (paymentMethod !== 'card' && paymentMethod !== 'promptpay') {
      return NextResponse.json(
        { error: 'Invalid paymentMethod.' },
        { status: 400 }
      );
    }

    if (paymentMethod === 'card') {
      if (!paymentMethodId) {
        return NextResponse.json(
          { error: 'Missing required field: paymentMethodId.' },
          { status: 400 }
        );
      }
      if (!isValidPaymentMethodId(paymentMethodId)) {
        return NextResponse.json(
          { error: 'Invalid paymentMethodId format.' },
          { status: 400 }
        );
      }
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

    const baseMetadata = {
      email: email,
      marketing_consent: marketing ? 'yes' : 'no',
      source: 'UndaAlundaStore',
      created_from: 'create-payment-intent-endpoint',
      id: orderId,
    };

    // 💳 CARD FLOW — unchanged behavior from before
    if (paymentMethod === 'card') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
        metadata: baseMetadata,
        expand: ['latest_charge'],
      });

      const receiptUrl = (paymentIntent.latest_charge as Stripe.Charge)?.receipt_url || null;

      return NextResponse.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        receiptUrl,
      });
    }

    // 📱 PROMPTPAY FLOW — settles in THB only, so convert from the USD cart total
    const usdToThb = await getUsdToThbRate();
    const amountUsd = amount / 100; // amount arrives as USD cents
    const amountThbSatang = Math.round(amountUsd * usdToThb * 100); // THB minor unit

    const paymentIntent = await stripe.paymentIntents.create({
  amount: amountThbSatang,
  currency: 'thb',
  payment_method_types: ['promptpay'],
  payment_method_data: {
    type: 'promptpay',
    billing_details: {
      email: email,
    },
  },
  confirm: true,
  metadata: {
    ...baseMetadata,
    original_amount_usd: amountUsd.toFixed(2),
    usd_to_thb_rate: usdToThb.toFixed(4),
  },
});

    const qrData = paymentIntent.next_action?.promptpay_display_qr_code;

    if (!qrData) {
      console.error('❌ No PromptPay QR data returned:', paymentIntent);
      return NextResponse.json(
        { error: 'Failed to generate PromptPay QR code.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      qrCodeUrl: qrData.image_url_png,
      hostedInstructionsUrl: qrData.hosted_instructions_url,
      amountThb: amountThbSatang / 100,
    });

  } catch (err: any) {
    console.error('🔥 PaymentIntent error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}