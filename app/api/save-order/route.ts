// app/api/save-order/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createMockShipment } from '../../../lib/shipping/mock-create-shipment';
import { v4 as uuidv4 } from 'uuid';
import supabase from '../../../lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { billingInfo, shippingInfo, cartItems, shippingMethod, email } = body;

    if (!billingInfo || !cartItems || !email || !shippingMethod) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const finalShipping = shippingInfo || billingInfo;

    const shipment = createMockShipment({
      orderId: `order-${uuidv4()}`,
      fullName: `${finalShipping.firstName} ${finalShipping.lastName}`,
      address: finalShipping.address,
      country: finalShipping.country,
      method: shippingMethod,
    });

    const amount = cartItems.reduce(
      (total: number, item: any) => total + item.price * item.quantity,
      0
    );

    const { error } = await supabase.from('Orders').insert([
      {
        email,
        amount,
        currency: 'usd',
        items: cartItems,
        payment_status: 'succeeded', // หรือจะเอาจาก Webhook ก็ได้
      },
    ]);

    if (error) {
      console.error('❌ Supabase insert error:', error.message);
      return NextResponse.json({ error: 'Failed to save order to DB' }, { status: 500 });
    }

    return NextResponse.json({ success: true, tracking: shipment });
  } catch (err: any) {
    console.error('🔥 Unexpected error in save-order:', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}