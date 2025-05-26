// app/api/stripe/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Readable } from 'stream'
import supabase from '../../../../lib/supabase'

async function readStreamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = []
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST!, {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_TEST!

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') || ''
  const rawBody = await readStreamToBuffer(req.body as any)

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  console.log('📬 Received event:', event.type)
  console.log('🧠 Full payload:', JSON.stringify(event, null, 2))

  // 🎯 Handle payment success events
  if (event.type === 'payment_intent.succeeded' || event.type === 'charge.succeeded') {
    const object = event.data.object as any
    const metadata = object.metadata

    const email = metadata?.email
    const orderId = metadata?.id

    console.log('📩 Email from metadata:', email)
    console.log('🧾 Order ID from metadata:', orderId)

    if (!email || !orderId) {
      console.warn('⚠️ Missing email or order ID in metadata')
      return NextResponse.json({ received: true })
    }

    // 🧘 Delay a bit for consistency
    await new Promise((r) => setTimeout(r, 1000))

    console.log('🔍 Looking for order with:', { email, orderId })

    const { data: orders, error: fetchError } = await supabase
      .from('Orders')
      .select('id, payment_status')
      .eq('email', email)
      .eq('id', orderId)
      .limit(1)

    if (fetchError) {
      console.error('❌ Error fetching order:', fetchError.message)
      return NextResponse.json({ received: true })
    }

    const order = orders?.[0]

    if (!order) {
      console.warn('🚫 Order not found with matching email + id')
    } else if (order.payment_status === 'succeeded') {
      console.log('🟢 Order already marked as succeeded. Skipping update.')
    } else {
      console.log('✏️ Attempting to update order status to succeeded...')

      const { error: updateError } = await supabase
        .from('Orders')
        .update({ payment_status: 'succeeded' })
        .eq('id', order.id)

      if (updateError) {
        console.error('❌ Error updating order:', updateError.message)
      } else {
        console.log(`✅ Successfully updated order ${order.id} to succeeded`)
      }
    }
  } else {
    console.log(`ℹ️ Ignoring event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}