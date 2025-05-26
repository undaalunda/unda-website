import { buffer } from 'micro'
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import supabase from '../../../lib/supabase'

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST!, {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_TEST!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed')
  }

  const buf = await buffer(req)
  const sig = req.headers['stripe-signature'] as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  console.log('📬 Event received:', event.type)

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    const email = paymentIntent.metadata?.email
    if (!email) {
      console.warn('⚠️ No email in metadata')
      return res.status(200).end()
    }

    const { data: orders } = await supabase
      .from('Orders')
      .select('id')
      .eq('email', email)
      .eq('payment_status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)

    const order = orders?.[0]
    if (order) {
      await supabase
        .from('Orders')
        .update({ payment_status: 'succeeded' })
        .eq('id', order.id)

      console.log(`✅ Updated order ${order.id} to succeeded`)
    }
  }

  return res.json({ received: true })
}