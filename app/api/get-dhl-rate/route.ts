// app/api/get-dhl-rate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { format } from 'date-fns-tz';

export async function POST(req: NextRequest) {
  try {
    const { countryCode, postalCode, cityName, weight = 1 } = await req.json();

    if (!countryCode || !postalCode || !cityName) {
      return NextResponse.json(
        { error: 'Missing countryCode, postalCode or cityName' },
        { status: 400 }
      );
    }

    const username = process.env.DHL_USERNAME!;
    const password = process.env.DHL_PASSWORD!;
    const accountNumber = process.env.DHL_ACCOUNT_NUMBER!;
    const apiUrl = process.env.DHL_API_URL!;

    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    const productCode = countryCode === 'TH' ? 'N' : undefined;

    // Format pickup date in Thailand time zone (+07:00)
    const plannedDate = format(
      new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd'T'HH:mm:ssXXX",
      { timeZone: 'Asia/Bangkok' }
    );

    const payload: any = {
      customerDetails: {
        shipperDetails: {
          postalCode: '73000',
          cityName: 'Nakhon Pathom',
          countryCode: 'TH',
        },
        receiverDetails: {
          postalCode,
          cityName,
          countryCode,
        },
      },
      plannedShippingDateAndTime: plannedDate,
      unitOfMeasurement: 'metric',
      isCustomsDeclarable: false,
      packages: [
        {
          weight,
          dimensions: {
            length: 10,
            width: 10,
            height: 5,
          },
        },
      ],
      accounts: [
        {
          typeCode: 'shipper',
          number: accountNumber,
        },
      ],
    };

    if (productCode) payload.productCode = productCode;

    console.log('[📅 DHL Planned Shipping Date]', plannedDate);
    console.log('[📦 DHL Payload]', JSON.stringify(payload, null, 2));

    const res = await fetch(`${apiUrl}/rates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify(payload),
    });

    const raw = await res.text();
    console.log('[📬 RAW DHL Response]', raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.error('[🧨 JSON Parse Fail]', err);
      return NextResponse.json(
        { error: 'Invalid JSON received from DHL', raw },
        { status: 502 }
      );
    }

    if (!res.ok) {
      console.error('[❌ DHL API Error]', data);
      return NextResponse.json(
        { error: data?.detail || 'DHL API error', data },
        { status: res.status }
      );
    }

    return NextResponse.json({ products: data.products });

  } catch (err: any) {
    console.error('🔥 Unhandled Server Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error', message: err?.message },
      { status: 500 }
    );
  }
}