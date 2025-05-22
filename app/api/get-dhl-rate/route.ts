// app/api/get-dhl-rate/route.ts

import { NextRequest, NextResponse } from 'next/server';

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

    const payload = {
      customerDetails: {
        shipperDetails: {
          postalCode: '10200',
          cityName: 'Bangkok',
          countryCode: 'TH',
          addressLine1: 'Nakhon Pathom HQ',
          addressLine2: 'Address 2',
          addressLine3: 'Address 3',
        },
        receiverDetails: {
          postalCode,
          cityName,
          countryCode,
          provinceCode: countryCode,
          addressLine1: 'Customer Address 1',
          addressLine2: 'Customer Address 2',
          addressLine3: 'Customer Address 3',
        },
      },
      plannedShippingDateAndTime: new Date().toISOString(),
      unitOfMeasurement: 'metric',
      isCustomsDeclarable: true,
      packages: [
        {
          weight,
          dimensions: {
            length: 10,
            width: 10,
            height: 10,
          },
        },
      ],
      accounts: [
        {
          typeCode: 'shipper',
          number: accountNumber,
        },
      ],
      productCode: 'P',
      localProductCode: 'P',
      payerCountryCode: 'TH',
      requestAllValueAddedServices: false,
      returnStandardProductsOnly: false,
      nextBusinessDay: true,
      productTypeCode: 'timeDefinite',
    };

    console.log('[📨 DHL Request Input]', { countryCode, postalCode, cityName, weight });
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