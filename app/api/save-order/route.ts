// app/api/save-order/route.ts

import { NextRequest, NextResponse } from 'next/server';
import supabase from '../../../lib/supabase';
import { allItems } from '../../../src/components/allItems'; // 🧠 ใช้คำนวณราคาและเช็ค digital

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
        dimensions: { length: 10, width: 10, height: 5 },
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
  console.log('[📨 RAW DHL Shipment Response]', raw);

  try {
    const data = JSON.parse(raw);
    const tracking = data?.shipmentTrackingNumber;

    return {
      tracking_number: tracking || null,
      courier: tracking ? 'dhl' : null,
      tracking_url: tracking ? `https://track.dhl.com/${tracking}` : null,
      estimated_delivery: tracking
        ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toDateString()
        : null,
      label_url: tracking
        ? `https://fake-labels.undaalunda.com/${tracking}.pdf`
        : null,
    };
  } catch (err) {
    console.error('[🪨 JSON Parse Fail]', raw);
    return {
      tracking_number: null,
      courier: null,
      tracking_url: null,
      estimated_delivery: null,
      label_url: null,
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
      orderId,
    } = body;

    if (!billingInfo || !cartItems || !email || !orderId) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const finalShipping = shippingInfo || billingInfo;
    const isDigitalOnly = cartItems.every((cartItem: any) => {
      const product = allItems.find(p => p.id === cartItem.id);
      if (!product) {
        console.warn('[⚠️ NOT FOUND IN allItems]', cartItem.id);
        return false;
      }
      return product.type === 'digital';
    });

    const amount = Math.round(
      cartItems.reduce((total: number, cartItem: any) => {
        const product = allItems.find((p) => p.id === cartItem.id);
        if (!product) return total;
        const price =
          typeof product.price === 'number' ? product.price : product.price.sale;
        return total + price;
      }, 0) * 100
    );

    let shipmentResult: {
      tracking_number: string | null;
      courier: string | null;
      tracking_url: string | null;
      estimated_delivery: string | null;
      label_url: string | null;
    } = {
      tracking_number: null,
      courier: null,
      tracking_url: null,
      estimated_delivery: null,
      label_url: null,
    };

    if (!isDigitalOnly) {
      if (!shippingMethod || !shippingZone) {
        return NextResponse.json(
          { error: 'Missing shipping info for physical items.' },
          { status: 400 }
        );
      }

      shipmentResult = await createDHLShipment({
        orderId,
        fullName: `${finalShipping.firstName} ${finalShipping.lastName}`,
        address: finalShipping.address,
        country: finalShipping.country,
      });

      console.log('[🚚 DHL Shipment Result]', shipmentResult);
    }

    const updateData = {
      billing_info: billingInfo,
      shipping_info: shippingInfo || null,
      shipping_method: isDigitalOnly ? null : shippingMethod,
      shipping_zone: isDigitalOnly ? null : shippingZone,
      shipping_rate: isDigitalOnly ? null : shippingRate || 0,
      tracking_number: shipmentResult.tracking_number,
      courier: shipmentResult.courier,
      tracking_url: shipmentResult.tracking_url,
      estimated_delivery: shipmentResult.estimated_delivery,
      label_url: shipmentResult.label_url,
      amount,
      status: isDigitalOnly ? 'paid' : 'pending',
    };

    console.log('[📦 Updating order in Supabase]', updateData);

    const { error } = await supabase
      .from('Orders')
      .update(updateData)
      .eq('id', orderId);

    if (error) {
      console.error('❌ Supabase update error:', error.message);
      return NextResponse.json({ error: 'Failed to update order in DB' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      tracking: shipmentResult,
      orderId,
    });
  } catch (err: any) {
    console.error('🔥 Unexpected error in save-order:', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}