// app/api/save-order/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import supabase from '../../../lib/supabase';
import { createRealShipment } from '../../../lib/shipping/create-real-shipment';

// 👇 ฟังก์ชันสร้าง shipment จริงจาก DHL (ใช้ test credentials)
async function createDHLShipment({
  orderId,
  fullName,
  address,
  country,
}: {
  orderId: string;
  fullName: string;
  address: string;
  country: string;
}) {
  const endpoint = `https://express.api.dhl.com/mydhlapi/test/shipments`;

  const credentials = process.env.DHL_TRACKING_AUTH!;
  const plannedDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    .toISOString()
    .replace('Z', '+07:00');

  const payload = {
    plannedShippingDateAndTime: plannedDate,
    pickup: { isRequested: false },
    productCode: country === 'TH' ? 'N' : 'P',
    customerDetails: {
      shipperDetails: {
        postalCode: '10200',
        cityName: 'Bangkok',
        countryCode: 'TH',
        name: 'My Company',
        addressLine1: '123 Mock Road',
        email: 'contact@example.com',
      },
      receiverDetails: {
        postalCode: '00000',
        cityName: 'Somewhere',
        countryCode: country,
        name: fullName,
        addressLine1: address,
        email: 'customer@example.com',
      },
    },
    accounts: [
      {
        typeCode: 'shipper',
        number: process.env.DHL_ACCOUNT_NUMBER!,
      },
    ],
    packages: [
      {
        weight: 1,
        dimensions: {
          length: 10,
          width: 10,
          height: 5,
        },
      },
    ],
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const raw = await res.text();
  console.log('[📬 RAW DHL Shipment Response]', raw);
  try {
    const data = JSON.parse(raw);
    const tracking = data?.shipmentTrackingNumber;
    return {
      tracking_number: tracking,
      courier: 'dhl',
      tracking_url: `https://track.dhl.com/${tracking}`,
      estimated_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toDateString(),
      label_url: 'https://fake-labels.undaalunda.com/' + tracking + '.pdf',
    };
  } catch (err) {
    console.error('[🧨 JSON Parse Fail]', raw);
    return {
      tracking_number: null,
      courier: 'dhl',
      tracking_url: '',
      estimated_delivery: '',
      label_url: '',
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      billingInfo,
      shippingInfo,
      cartItems,
      shippingMethod,
      shippingZone,
      shippingRate,
      email,
    } = body;

    if (!billingInfo || !cartItems || !email || !shippingMethod || !shippingZone) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const finalShipping = shippingInfo || billingInfo;

    // 👇 เปลี่ยนมาใช้ DHL จริง
    const orderId = `order-${uuidv4()}`;
    const shipment = await createDHLShipment({
      orderId,
      fullName: `${finalShipping.firstName} ${finalShipping.lastName}`,
      address: finalShipping.address,
      country: finalShipping.country,
    });

    console.log('[🚚 DHL Shipment Result]', shipment);

    const itemAmount = cartItems.reduce((total: number, item: any) => {
      const price =
        typeof item.price === 'object' && item.price?.sale
          ? item.price.sale
          : item.price;
      return total + price * item.quantity;
    }, 0);

    const amount = itemAmount + (shippingRate || 0);

    const { data, error } = await supabase
      .from('Orders')
      .insert([
        {
          email,
          amount,
          currency: 'usd',
          items: cartItems,
          payment_status: 'succeeded',
          created_at: new Date().toISOString(),
          tracking_number: shipment.tracking_number,
          courier: shipment.courier,
          shipping_zone: shippingZone,
          shipping_method: shippingMethod,
          shipping_rate: shippingRate || 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase insert error:', error.message);
      return NextResponse.json({ error: 'Failed to save order to DB' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      tracking: shipment,
      orderId: data.id,
    });
  } catch (err: any) {
    console.error('🔥 Unexpected error in save-order:', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}