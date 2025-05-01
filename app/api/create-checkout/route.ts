import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, items, shippingAddress } = body;

    const shop = 'undaalunda.myshopify.com'; // ใส่ชื่อร้านของมึง
    const accessToken = 'a596922f1a2551cf50215f635f68e3ee'; // ใส่ token จาก Shopify
    const endpoint = `https://${shop}/admin/api/2023-07/checkouts.json`;

    const checkoutData = {
      checkout: {
        email,
        line_items: items,
        shipping_address: shippingAddress,
      },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData),
    });

    const data = await response.json();

    return NextResponse.json({ checkoutUrl: data.checkout?.web_url });
  } catch (err) {
    return NextResponse.json(
      { error: 'Shopify checkout creation failed', detail: err },
      { status: 500 }
    );
  }
}