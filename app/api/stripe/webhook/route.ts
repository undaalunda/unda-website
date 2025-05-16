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

      // 🔍 Extract metadata
      const email = paymentIntent.metadata?.email;
      const marketing = paymentIntent.metadata?.marketing_consent;

      if (!email) {
        console.warn('⚠️ Missing email in metadata. Skipping order save.');
        break;
      }

      // 🧠 Call internal API to save order (dummy payload for now)
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/save-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            source: 'webhook',
            stripePaymentIntentId: paymentIntent.id,
            metadata: paymentIntent.metadata,
            createdAt: new Date().toISOString(),
          }),
        });
        console.log('✅ Order saved from webhook!');
      } catch (saveErr) {
        console.error('🔥 Failed to save order from webhook:', saveErr);
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