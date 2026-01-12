// app/api/get-dhl-rate/route.ts - FIXED VERSION

import { NextRequest, NextResponse } from 'next/server';

/**
 * คำนวณวันทำการถัดไป โดยคำนึงถึง:
 * 1. เวลาทำการ (หลัง 5 โมงเย็นนับเป็นวันถัดไป)
 * 2. วันหยุดสุดสัปดาห์ (เสาร์-อาทิตย์)
 */
/**
 * คำนวณขนาดกล่องตามน้ำหนักสินค้า
 */
function getBoxSize(weight: number) {
  if (weight <= 0.15) {
    // กล่องพัสดุเล็ก (สำหรับ CD, Sticker, Keychain)
    return { length: 15, width: 12, height: 3 };
    // Volumetric: (15×12×3)/5000 = 0.108 kg
  } else if (weight <= 0.5) {
    // กล่องเล็ก (สำหรับเสื้อ 1 ตัว, CD + Keychain)
    return { length: 25, width: 20, height: 5 };
    // Volumetric: (25×20×5)/5000 = 0.5 kg
  } else if (weight <= 2) {
    // กล่องกลาง (สำหรับเสื้อ 2-3 ตัว, CD + เสื้อ)
    return { length: 30, width: 25, height: 10 };
    // Volumetric: (30×25×10)/5000 = 1.5 kg
  } else if (weight <= 5) {
    // กล่องใหญ่ (สำหรับหนังสือ + เสื้อ, หลายชิ้น)
    return { length: 40, width: 30, height: 20 };
    // Volumetric: (40×30×20)/5000 = 4.8 kg
  } else {
    // กล่องใหญ่พิเศษ (มากกว่า 5 kg)
    return { length: 50, width: 40, height: 30 };
    // Volumetric: (50×40×30)/5000 = 12 kg
  }
}

function getNextBusinessDay(daysAhead: number): string {
  const now = new Date();
  const pickupDate = new Date(now);
  
  // ✅ ถ้าสั่งหลัง 5 โมงเย็น (17:00) เริ่มนับจากวันถัดไป
  if (now.getHours() >= 17) {
    pickupDate.setDate(pickupDate.getDate() + 1);
    console.log('⏰ After 5 PM - starting from tomorrow');
  }
  
  // เพิ่มจำนวนวันทำการ
  let businessDaysAdded = 0;
  
  while (businessDaysAdded < daysAhead) {
    pickupDate.setDate(pickupDate.getDate() + 1);
    
    const dayOfWeek = pickupDate.getDay();
    // ถ้าไม่ใช่เสาร์ (6) หรืออาทิตย์ (0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      businessDaysAdded++;
    }
  }
  
  // Set เวลาเป็น 12:00 น.
  pickupDate.setHours(12, 0, 0, 0);
  
  const year = pickupDate.getFullYear();
  const month = String(pickupDate.getMonth() + 1).padStart(2, '0');
  const day = String(pickupDate.getDate()).padStart(2, '0');
  
  const formattedDate = `${year}-${month}-${day}T12:00:00 GMT+07:00`;
  
  console.log('📅 Calculated pickup date:', formattedDate, `(${businessDaysAdded} business days from now)`);
  
  return formattedDate;
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
  
  console.log('📡 DHL Response:', {
    status: res.status,
    statusText: res.statusText,
    bodyPreview: raw.substring(0, 500)
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
  console.log('🌍 Environment:', process.env.NODE_ENV);
  console.log('🔍 Vercel Region:', process.env.VERCEL_REGION || 'local');

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
      console.log('🇹🇭 Domestic Thailand - using fixed rate');
      
      return NextResponse.json({
        success: true,
        products: [{
          productName: 'Domestic Delivery (Thailand Post)',
          productCode: 'DOMESTIC',
          totalPrice: [{
            currencyType: 'BILLC',
            price: 200 // 200 บาท
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

    // 🔍 Debug: Check environment variables
    const username = process.env.DHL_USERNAME;
    const password = process.env.DHL_PASSWORD;
    const accountNumber = process.env.DHL_ACCOUNT_NUMBER || '561225618';
    const baseUrl = process.env.DHL_API_URL || 'https://express.api.dhl.com/mydhlapi';
    const endpoint = `${baseUrl}/rates`;

    console.log('🔐 Environment Variables Check:', {
      DHL_USERNAME_exists: !!process.env.DHL_USERNAME,
      DHL_USERNAME_type: typeof process.env.DHL_USERNAME,
      DHL_USERNAME_length: process.env.DHL_USERNAME?.length || 0,
      DHL_USERNAME_preview: process.env.DHL_USERNAME ? process.env.DHL_USERNAME.substring(0, 3) + '***' : 'MISSING',
      
      DHL_PASSWORD_exists: !!process.env.DHL_PASSWORD,
      DHL_PASSWORD_type: typeof process.env.DHL_PASSWORD,
      DHL_PASSWORD_length: process.env.DHL_PASSWORD?.length || 0,
      DHL_PASSWORD_preview: process.env.DHL_PASSWORD ? '***' + process.env.DHL_PASSWORD.substring(process.env.DHL_PASSWORD.length - 3) : 'MISSING',
      
      DHL_ACCOUNT_NUMBER: accountNumber,
      DHL_API_URL: baseUrl,
      endpoint
    });

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
      console.error('❌ All env vars:', Object.keys(process.env).filter(key => key.includes('DHL')));
      return NextResponse.json(
        { 
          success: false,
          error: 'Shipping service temporarily unavailable. Please try again later.',
          debug: {
            hasUsername: !!username,
            hasPassword: !!password,
            availableEnvVars: Object.keys(process.env).filter(key => key.includes('DHL'))
          }
        },
        { status: 500 }
      );
    }

    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    const actualWeight = Math.max(0.5, weight);

    // 🔍 Debug: Credentials encoding
    console.log('🔐 Credentials Encoding:', {
      rawUsernameLength: username.length,
      rawPasswordLength: password.length,
      base64Length: credentials.length,
      base64Preview: credentials.substring(0, 20) + '...',
      authHeader: `Basic ${credentials.substring(0, 20)}...`
    });

    // ✅ คำนวณขนาดกล่องตามน้ำหนัก
    const boxSize = getBoxSize(actualWeight);
    
    console.log('📦 Box calculation:', {
      weight: actualWeight,
      boxSize
    });

    // ✅ คำนวณวันรับสินค้า - เพิ่มเป็น 5 วันทำการ (ข้ามวันหยุด)
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
      productCode: 'P',  // ✅ บังคับใช้ DHL Express Worldwide (ถูกกว่า Medical Express)
      packages: [
        {
          weight: actualWeight,
          dimensions: boxSize  // ✅ ใช้ขนาดที่คำนวณแล้ว
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

    console.log('📤 Sending payload to DHL:', JSON.stringify(payload, null, 2));

    try {
      const { ok, status, data, raw } = await fetchDHLRate(credentials, endpoint, payload);

      if (ok && data.products && data.products.length > 0) {
        console.log('✅ DHL Rate found!', {
          productCount: data.products.length,
          firstProduct: data.products[0].productName
        });
        
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
        error: data,
        fullResponse: raw
      });

      // ❌ Return error ชัดเจน - ไม่ใช้ fallback
      return NextResponse.json({
        success: false,
        error: 'Unable to calculate shipping rate. Please verify your shipping address and try again. If the problem persists, please contact support.',
        debug: {
          status,
          message: data.detail || data.message || 'Unknown error',
          reasons: data.reasons || [],
          fullError: data
        }
      }, { status: 500 });

    } catch (err: any) {
      console.error('❌ DHL API Exception:', err);
      console.error('❌ Exception details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      
      return NextResponse.json({
        success: false,
        error: 'Shipping calculation failed. Please try again.',
        debug: {
          message: err.message,
          type: err.name
        }
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('🔥 DHL Rate API Error:', error);
    console.error('🔥 Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json({
      success: false,
      error: 'Shipping calculation failed. Please try again.',
      debug: {
        message: error.message,
        type: error.name
      }
    }, { status: 500 });
  }
}