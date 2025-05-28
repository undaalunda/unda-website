// /pages/api/stripe/webhook.ts

import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import supabase from '../../../lib/supabase';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isLive = process.env.NODE_ENV === 'production';

  console.log('🚨 ENV STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY);

const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY ??
  (isLive ? process.env.STRIPE_SECRET_KEY_LIVE : process.env.STRIPE_SECRET_KEY_TEST);

  const webhookSecret = isLive
    ? process.env.STRIPE_WEBHOOK_SECRET_LIVE
    : process.env.STRIPE_WEBHOOK_SECRET_TEST;

  if (!stripeSecretKey || !webhookSecret) {
    throw new Error('🚫 Missing Stripe secret key or webhook secret.');
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
  });

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('📬 Received event:', event.type);

  if (
    event.type === 'payment_intent.succeeded' ||
    event.type === 'charge.succeeded'
  ) {
    const object = event.data.object as any;
    const metadata = object.metadata || {};

    const email = metadata?.email;
    const orderId = metadata?.id;

    console.log('🔍 Metadata:', metadata);
    console.log('📨 email:', email, '| 🧾 orderId:', orderId);

    if (!email || !orderId) {
      console.warn('⚠️ Missing email or order ID in metadata');
      return res.json({ received: true });
    }

    await new Promise((r) => setTimeout(r, 3000));

    const { data: orders, error: fetchError } = await supabase
      .from('Orders')
      .select()
      .eq('email', email)
      .eq('id', orderId)
      .limit(1);

    if (fetchError) {
      console.error('❌ Supabase fetch error:', fetchError.message);
      return res.json({ received: true });
    }

    const order = orders?.[0];
    console.log('📦 Fetched order from Supabase:', order);

    if (!order) {
      console.warn('🚫 Order not found in Supabase');
    } else if (order.payment_status === 'succeeded') {
      console.log('🟢 Already marked as succeeded.');
    } else {
      const updateData: any = { payment_status: 'succeeded' };

      if (!order.shipping_method && !order.tracking_number) {
        updateData.status = 'paid';
      }

      console.log('🧠 Will update with:', updateData);

      const { error: updateError } = await supabase
        .from('Orders')
        .update(updateData)
        .eq('id', order.id);

      if (updateError) {
        console.error('❌ Failed to update order:', updateError.message);
      } else {
        console.log(`✅ Order ${order.id} updated with`, updateData);
      }
    }
  } else {
    console.log('🙅‍♀️ Ignored event type:', event.type);
  }

  res.json({ received: true });
}