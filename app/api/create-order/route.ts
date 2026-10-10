// app/api/create-order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import supabase from '../../../lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, amount, cartItems, shippingMethod, shippingZone, billingInfo, shippingInfo, shippingRate } = body;

  console.log('📦 Incoming order:', {
    email,
    amount,
    cartItems,
    shippingMethod,
    shippingZone,
  });

  const { data: order, error } = await supabase
    .from('Orders')
    .insert({
      email,
      amount,
      items: cartItems,
      shipping_method: shippingMethod,
      shipping_zone: shippingZone,
      payment_status: 'pending',
      currency: 'usd',
      billing_info: billingInfo || null,
      shipping_info: shippingInfo || null,
      shipping_rate: typeof shippingRate === 'number' ? shippingRate : null,
    })
    .select()
    .single();

  if (error || !order) {
    console.error('❌ Supabase insert failed:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }

  console.log('✅ Order created:', order.id);
  return NextResponse.json({
    orderId: order.id,
    order, // 🧠 ส่ง full object เผื่อจะได้ใช้ฝั่ง client
  });
}