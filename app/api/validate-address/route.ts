import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('📍 Validate Address API called');

  try {
    const { countryCode, postalCode, cityName } = await req.json();

    const username = process.env.DHL_USERNAME!;
    const password = process.env.DHL_PASSWORD!;
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');

    // ✅ Endpoint ที่ถูกต้อง
    const endpoint = `${process.env.DHL_API_URL}/address-validate`;

    const payload = {
      type: 'delivery',
      cityName: cityName || 'New York',
      countyName: '',
      postalCode: postalCode,
      countryCode: countryCode
    };

    console.log('🔍 Validating:', payload);

    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    const data = await res.json();

    console.log('📬 Validation Response:', JSON.stringify(data, null, 2));

    if (!res.ok) {
      return NextResponse.json({
        valid: false,
        error: data
      });
    }

    return NextResponse.json({
      valid: true,
      data
    });

  } catch (error) {
    console.error('🔥 Validation Error:', error);
    return NextResponse.json({
      valid: false,
      error: 'Validation failed'
    }, { status: 500 });
  }
}