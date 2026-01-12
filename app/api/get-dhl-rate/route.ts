// app/api/get-dhl-rate/route.ts - WITH DEBUG LOGGING

import { NextRequest, NextResponse } from 'next/server';

function getNextBusinessDay(daysAhead: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  
  const dayOfWeek = date.getDay();
  
  if (dayOfWeek === 6) {
    date.setDate(date.getDate() + 2);
  } else if (dayOfWeek === 0) {
    date.setDate(date.getDate() + 1);
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+07:00`;
}

async function fetchDHLRate(
  credentials: string,
  endpoint: string,
  payload: any
) {
  console.log('🌐 Calling DHL API:', {
    endpoint,
    hasCredentials: !!credentials,
    credentialsLength: credentials.length
  });

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const raw = await res.text();
  
  // 🔍 แสดง Response detail
  console.log('📡 DHL Response:', {
    status: res.status,
    statusText: res.statusText,
    bodyPreview: raw.substring(0, 500) // แสดง 500 ตัวอักษรแรก
  });
  
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error('❌ Failed to parse JSON. Raw:', raw);
    throw new Error('Invalid JSON response from DHL');
  }

  return { ok: res.ok, status: res.status, data, raw };
}

export async function POST(req: NextRequest) {
  console.log('📦 DHL Rate API called');

  try {
    const { countryCode, postalCode, cityName, weight = 1, declaredValue = 50 } = await req.json();

    console.log('📥 Request:', { countryCode, postalCode, cityName, weight, declaredValue });

    if (!countryCode || !postalCode || !cityName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // ✅ Thailand Domestic = Fixed Rate
    if (countryCode === 'TH') {
      console.log('🇹🇭 Domestic Thailand - using domestic rate');
      
      return NextResponse.json({
        success: true,
        products: [{
          productName: 'Domestic Delivery (Thailand Post)',
          productCode: 'DOMESTIC',
          totalPrice: [{
            currencyType: 'BILLC',
            price: 200
          }]
        }],
        exchangeRates: [{
          currency: 'THB',
          baseCurrency: 'USD',
          currentExchangeRate: 0.029
        }]
      });
    }

    // 🌍 International = DHL API
    console.log('🌍 International shipping - calling DHL API');

    const username = process.env.DHL_USERNAME!;
    const password = process.env.DHL_PASSWORD!;
    const accountNumber = process.env.DHL_ACCOUNT_NUMBER || '561225618';
    const baseUrl = process.env.DHL_API_URL || 'https://express.api.dhl.com/mydhlapi';
    const endpoint = `${baseUrl}/rates`;

    // 🔍 Debug credentials
    console.log('🔐 Credentials Check:', {
      hasUsername: !!username,
      hasPassword: !!password,
      usernameLength: username?.length || 0,
      passwordLength: password?.length || 0,
      usernamePreview: username ? username.substring(0, 3) + '***' : 'undefined',
      accountNumber,
      endpoint
    });

    if (!username || !password) {
      console.error('❌ Missing DHL credentials');
      return NextResponse.json(
        { 
          success: false,
          error: 'Shipping service temporarily unavailable. Please try again later.' 
        },
        { status: 500 }
      );
    }

    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    const actualWeight = Math.max(0.5, weight);

    // ลอง strategy แรกเท่านั้น (เพื่อดู error ชัดเจน)
    const plannedDate = getNextBusinessDay(5);
    
    const payload: any = {
      customerDetails: {
        shipperDetails: {
          postalCode: '73000',
          cityName: 'Nakhon Pathom',
          countryCode: 'TH',
          addressLine1: 'Wang Taku',
          addressLine2: 'Mueang Nakhon Pathom District'
        },
        receiverDetails: {
          postalCode: postalCode,
          cityName: cityName,
          countryCode: countryCode,
          addressLine1: 'Customer Address'
        }
      },
      accounts: [
        {
          typeCode: 'shipper',
          number: accountNumber
        }
      ],
      plannedShippingDateAndTime: plannedDate,
      unitOfMeasurement: 'metric',
      isCustomsDeclarable: true,
      packages: [
        {
          weight: actualWeight,
          dimensions: {
            length: 20,
            width: 15,
            height: 10
          }
        }
      ],
      monetaryAmount: [
        {
          typeCode: 'declaredValue',
          value: declaredValue,
          currency: 'USD'
        }
      ],
      productCode: 'P'
    };

    console.log('📤 Sending payload to DHL...');

    try {
      const { ok, status, data, raw } = await fetchDHLRate(credentials, endpoint, payload);

      if (ok && data.products && data.products.length > 0) {
        console.log('✅ DHL Rate found!');
        
        return NextResponse.json({
          success: true,
          products: data.products,
          exchangeRates: data.exchangeRates || [{
            currency: 'THB',
            baseCurrency: 'USD',
            currentExchangeRate: 0.029
          }]
        });
      }

      // แสดง error detail
      console.error('❌ DHL API failed:', {
        status,
        error: data
      });

      return NextResponse.json({
        success: false,
        error: 'Unable to calculate shipping rate. Please verify your shipping address and try again. If the problem persists, please contact support.',
        debug: {
          status,
          message: data.detail || data.message || 'Unknown error'
        }
      }, { status: 500 });

    } catch (err: any) {
      console.error('❌ DHL API Exception:', err);
      
      return NextResponse.json({
        success: false,
        error: 'Shipping calculation failed. Please try again.',
        debug: {
          message: err.message
        }
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('🔥 DHL Rate API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Shipping calculation failed. Please try again.'
    }, { status: 500 });
  }
}