import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import supabase from '../../../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST!, {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_TEST!;

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log('📬 Received event:', event.type);

  if (event.type === 'payment_intent.succeeded' || event.type === 'charge.succeeded') {
    const object = event.data.object as any;
    const metadata = object.metadata;

    const email = metadata?.email;
    const orderId = metadata?.id;

    if (!email || !orderId) {
      console.warn('⚠️ Missing email or order ID in metadata');
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    await new Promise((r) => setTimeout(r, 3000)); // wait for Supabase consistency

    const { data: orders, error: fetchError } = await supabase
      .from('Orders')
      .select('id, payment_status, shipping_method, tracking_number')
      .eq('email', email)
      .eq('id', orderId)
      .limit(1);

    const order = orders?.[0];

    if (!order) {
      console.warn('🚫 Order not found');
    } else if (order.payment_status === 'succeeded') {
      console.log('🟢 Already succeeded.');
    } else {
      const updateData: any = { payment_status: 'succeeded' };
      if (!order.shipping_method && !order.tracking_number) {
        updateData.status = 'paid';
      }

      const { error: updateError } = await supabase
        .from('Orders')
        .update(updateData)
        .eq('id', order.id);

      if (updateError) {
        console.error('❌ Failed to update order:', updateError.message);
      } else {
        console.log(`✅ Order ${order.id} updated`);
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}