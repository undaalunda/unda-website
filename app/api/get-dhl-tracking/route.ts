import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const trackingNumber = searchParams.get('trackingNumber');

  console.log('📦 DHL Tracking API called');
  console.log('🔢 Tracking number:', trackingNumber);

  if (!trackingNumber) {
    return NextResponse.json(
      { error: 'Tracking number is required' },
      { status: 400 }
    );
  }

  const username = process.env.DHL_USERNAME;
  const password = process.env.DHL_PASSWORD;
  const trackingAuth = process.env.DHL_TRACKING_AUTH;

  if (!username || !password) {
    return NextResponse.json(
      { error: 'DHL credentials not configured' },
      { status: 500 }
    );
  }

  const credentials = Buffer.from(`${username}:${password}`).toString('base64');
  const apiUrl = process.env.DHL_API_URL || 'https://express.api.dhl.com/mydhlapi';

  try {
    console.log('🌐 Calling DHL API:', `${apiUrl}/shipments/${trackingNumber}/tracking`);
    
    const response = await fetch(
      `${apiUrl}/shipments/${trackingNumber}/tracking`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

    const text = await response.text();
    console.log('📄 Raw response:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      return NextResponse.json(
        { 
          error: 'Invalid response from DHL',
          status: response.status,
          body: text.substring(0, 500)
        },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error('❌ DHL API Error:', data);
      return NextResponse.json(
        { 
          error: data.detail || data.title || 'Failed to fetch tracking info',
          status: response.status,
          data: data
        },
        { status: response.status }
      );
    }

    console.log('✅ DHL Tracking Data:', JSON.stringify(data, null, 2));
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('🔥 DHL Tracking Error:', error);
    console.error('🔥 Error message:', error.message);
    console.error('🔥 Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch tracking information',
        details: error.message,
        type: error.name
      },
      { status: 500 }
    );
  }
}