// app/api/save-order/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { createMockShipment } from '../../../lib/shipping/mock-create-shipment';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { billingInfo, shippingInfo, cartItems, shippingMethod, email } = body;

    if (!billingInfo || !cartItems || !email || !shippingMethod) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const finalShipping = shippingInfo || billingInfo;

    // 🔧 MOCK จัดส่งของ
    const shipment = createMockShipment({
      orderId: `order-${uuidv4()}`,
      fullName: `${finalShipping.firstName} ${finalShipping.lastName}`,
      address: finalShipping.address,
      country: finalShipping.country,
      method: shippingMethod,
    });

    const order = {
      id: shipment.trackingNumber,
      email,
      billingInfo,
      shippingInfo: finalShipping,
      cartItems,
      shippingMethod,
      createdAt: new Date().toISOString(),
      shipmentDetails: shipment,
    };

    const ordersPath = path.join(process.cwd(), 'data/orders.json');
    let existing = [];
    try {
      const file = await fs.readFile(ordersPath, 'utf-8');
      existing = JSON.parse(file);
    } catch {
      existing = [];
    }

    existing.push(order);
    await fs.writeFile(ordersPath, JSON.stringify(existing, null, 2));

    return NextResponse.json({ success: true, orderId: order.id, tracking: shipment });
  } catch (err) {
    console.error('🔥 Save Order Error:', err);
    return NextResponse.json({ error: 'Failed to save order.' }, { status: 500 });
  }
}