// app/api/stripe/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Readable } from 'stream'
import supabase from '../../../../lib/supabase'

// 🧽 แปลง Readable stream เป็น Buffer
async function readStreamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = []
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

// 🐍 สร้าง Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST!, {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
})

// 🎯 Secret สำหรับตรวจ webhook
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

  console.log('📬 Event received:', event.type)

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    const email = paymentIntent.metadata?.email

    console.log('📩 Email from metadata:', email)

    if (!email) {
      console.warn('⚠️ No email in metadata')
      return NextResponse.json({ received: true })
    }

    const { data: orders, error: fetchError } = await supabase
      .from('Orders')
      .select('id')
      .eq('email', email)
      .eq('payment_status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)

    if (fetchError) {
      console.error('❌ Error fetching orders:', fetchError.message)
    }

    console.log('🧾 Orders fetched:', orders?.length, orders)

    const order = orders?.[0]
    if (order) {
      const { error: updateError } = await supabase
        .from('Orders')
        .update({ payment_status: 'succeeded' })
        .eq('id', order.id)

      if (updateError) {
        console.error('❌ Error updating order status:', updateError.message)
      } else {
        console.log(`✅ Updated order ${order.id} to succeeded`)
      }
    } else {
      console.warn('⚠️ No pending order found for email:', email)
    }
  }

  return NextResponse.json({ received: true })
}