// app/api/get-tracking-info/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const trackingNumber = req.nextUrl.searchParams.get('tracking_number');

  if (!trackingNumber) {
    return NextResponse.json({ error: 'Missing tracking number' }, { status: 400 });
  }

  const auth = process.env.DHL_TRACKING_AUTH;
  if (!auth) {
    return NextResponse.json({ error: 'Missing DHL_TRACKING_AUTH env var' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://express.api.dhl.com/mydhlapi/test/shipments/${trackingNumber}/tracking?trackingView=last-checkpoint`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const raw = await response.text();
    let data;

    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.error('[🧨 Failed to parse DHL tracking response]', raw);
      return NextResponse.json({ error: 'Invalid JSON from DHL' }, { status: 502 });
    }

    if (!response.ok) {
      console.error('[❌ DHL Tracking API error]', data);
      return NextResponse.json({ error: 'DHL tracking failed', detail: data }, { status: response.status });
    }

    return NextResponse.json({ tracking: data });
  } catch (err) {
    console.error('[🔥 Unexpected error]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}