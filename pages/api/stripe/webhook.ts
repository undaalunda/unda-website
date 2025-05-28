// pages/api/stripe/webhook.ts

import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import supabase from '../../../lib/supabase';

// 👇 Important: Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed'); // This was the 405 source, dummy.
  }

  const isLive = process.env.NODE_ENV === 'production';

  const stripeSecretKey =
    process.env.STRIPE_SECRET_KEY ??
    (isLive ? process.env.STRIPE_SECRET_KEY_LIVE : process.env.STRIPE_SECRET_KEY_TEST);

  const webhookSecret = isLive
    ? process.env.STRIPE_WEBHOOK_SECRET_LIVE
    : process.env.STRIPE_WEBHOOK_SECRET_TEST;

  if (!stripeSecretKey || !webhookSecret) {
    console.error('🚨 Missing Stripe keys.');
    return res.status(500).end('Internal Server Error');
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
  });

  let event: Stripe.Event;

  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'] as string;

    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error('❌ Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('📬 Stripe event received:', event.type);

  if (event.type === 'payment_intent.succeeded' || event.type === 'charge.succeeded') {
    const object = event.data.object as any;
    const { email, id: orderId } = object.metadata || {};

    if (!email || !orderId) {
      console.warn('⚠️ Missing metadata (email or id)');
      return res.json({ received: true });
    }

    const { data, error: fetchError } = await supabase
      .from('Orders')
      .select('*')
      .eq('id', orderId)
      .eq('email', email)
      .single();

    if (fetchError) {
      console.error('❌ Supabase fetch failed:', fetchError.message);
      return res.json({ received: true });
    }

    if (data.payment_status !== 'succeeded') {
      const updateData: any = { payment_status: 'succeeded' };
      if (!data.shipping_method && !data.tracking_number) updateData.status = 'paid';

      const { error: updateError } = await supabase
        .from('Orders')
        .update(updateData)
        .eq('id', orderId);

      if (updateError) {
        console.error('❌ Failed to update order:', updateError.message);
      } else {
        console.log(`✅ Order ${orderId} updated successfully`);
      }
    } else {
      console.log('🟢 Order already marked as succeeded');
    }
  } else {
    console.log('🙅 Ignored event:', event.type);
  }

  return res.json({ received: true });
}