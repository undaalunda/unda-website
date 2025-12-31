// app/api/get-dhl-rate/route.ts

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
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const raw = await res.text();
  
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
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

    // ✅ Thailand Domestic = Fixed Rate (ตามที่คุณโจ๊กบอก)
    if (countryCode === 'TH') {
      console.log('🇹🇭 Domestic Thailand - using domestic rate');
      
      return NextResponse.json({
        success: true,
        products: [{
          productName: 'Domestic Delivery (Thailand Post)',
          productCode: 'DOMESTIC',
          totalPrice: [{
            currencyType: 'BILLC',
            price: 200  // 200 THB
          }]
        }],
        exchangeRates: [{
          currency: 'THB',
          baseCurrency: 'USD',
          currentExchangeRate: 0.029
        }]
      });
    }

    // 🌍 International = DHL API (ต้องได้ราคาจริงเท่านั้น!)
    console.log('🌍 International shipping - calling DHL API');

    const username = process.env.DHL_USERNAME!;
    const password = process.env.DHL_PASSWORD!;
    const accountNumber = process.env.DHL_ACCOUNT_NUMBER || '561225618';
    const baseUrl = process.env.DHL_API_URL || 'https://express.api.dhl.com/mydhlapi';
    const endpoint = `${baseUrl}/rates`;

    console.log('🔗 Using endpoint:', endpoint);

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

    // 🔄 ลองหลาย strategy
    const strategies = [
      { days: 3, productCode: 'P', name: 'Express Worldwide (3 days)' },
      { days: 5, productCode: 'P', name: 'Express Worldwide (5 days)' },
      { days: 7, productCode: 'P', name: 'Express Worldwide (7 days)' },
      { days: 10, productCode: 'P', name: 'Express Worldwide (10 days)' },
      { days: 3, productCode: undefined, name: 'Auto Select (3 days)' },
      { days: 5, productCode: undefined, name: 'Auto Select (5 days)' },
      { days: 7, productCode: undefined, name: 'Auto Select (7 days)' },
    ];
    
    for (const strategy of strategies) {
      console.log(`\n🔄 Trying: ${strategy.name}`);
      
      const plannedDate = getNextBusinessDay(strategy.days);
      
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
        ]
      };

      if (strategy.productCode) {
        payload.productCode = strategy.productCode;
      }

      try {
        const { ok, status, data, raw } = await fetchDHLRate(credentials, endpoint, payload);

        console.log(`[📬 Response Status: ${status}]`);

        if (ok && data.products && data.products.length > 0) {
          console.log('✅ DHL Rate found!');
          console.log('[💰 Products]', JSON.stringify(data.products, null, 2));
          
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

        if (data.detail) {
          console.warn(`⚠️ ${data.detail}`);
        }

      } catch (err: any) {
        console.error(`❌ Error: ${err.message}`);
      }
    }

    // ❌ ถ้าลองทุกวิธีแล้วยังไม่ได้ = Error ไม่ใช่ราคาประมาณการ!
    console.error('\n❌ All DHL rate strategies failed');
    
    return NextResponse.json({
      success: false,
      error: 'Unable to calculate shipping rate. Please verify your shipping address and try again. If the problem persists, please contact support.'
    }, { status: 500 });

  } catch (error) {
    console.error('🔥 DHL Rate API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Shipping calculation failed. Please try again.'
    }, { status: 500 });
  }
}