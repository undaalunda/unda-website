// lib/shipping/create-real-shipment.ts

import { ShipmentInput, ShipmentResult } from './mock-create-shipment';

export async function createRealShipment(input: ShipmentInput): Promise<ShipmentResult> {
  const {
    DHL_USERNAME,
    DHL_PASSWORD,
    DHL_ACCOUNT_NUMBER,
    DHL_API_URL,
  } = process.env;

  if (!DHL_USERNAME || !DHL_PASSWORD || !DHL_ACCOUNT_NUMBER || !DHL_API_URL) {
    throw new Error('Missing DHL credentials in environment variables');
  }

  const credentials = Buffer.from(`${DHL_USERNAME}:${DHL_PASSWORD}`).toString('base64');

  const payload = {
    plannedShippingDateAndTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    pickup: {
      isRequested: false,
    },
    productCode: input.country === 'TH' ? 'N' : 'P', // ดัดแปลงให้ดูจริงใจขึ้น
    accounts: [
      {
        number: DHL_ACCOUNT_NUMBER,
        typeCode: 'shipper',
      },
    ],
    customerDetails: {
      shipperDetails: {
        postalAddress: {
          postalCode: '10200',
          cityName: 'Bangkok',
          countryCode: 'TH',
          addressLine1: '123 Mock Road',
        },
        contactInformation: {
          fullName: 'My Company',
          email: 'contact@example.com',
          phone: '021234567', // ใส่อะไรซักอย่างเถอะ
        },
      },
      receiverDetails: {
        postalAddress: {
          postalCode: '100-0001',
          cityName: 'Tokyo',
          countryCode: input.country,
          addressLine1: input.address,
        },
        contactInformation: {
          fullName: input.fullName,
          email: 'customer@example.com',
          phone: '0901234567', // มโนไปก่อน
        },
      },
    },
    content: {
      isCustomsDeclarable: false,
      packages: [
        {
          weight: 1,
          dimensions: {
            length: 10,
            width: 10,
            height: 5,
          },
        },
      ],
    },
  };

  console.log('[📦 DHL Shipment Payload]', JSON.stringify(payload, null, 2));

  const res = await fetch(`${DHL_API_URL}/shipments`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const raw = await res.text();
  console.log('[📬 RAW DHL Shipment Response]', raw);

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error('[🧨 JSON Parse Fail]', err);
    throw new Error('Invalid JSON received from DHL');
  }

  if (!res.ok) {
    throw new Error(data?.detail || 'DHL shipment creation failed');
  }

  return {
    tracking_number: data.shipmentTrackingNumber,
    courier: 'dhl',
    tracking_url: `https://track.dhl.com/${data.shipmentTrackingNumber}`,
    estimated_delivery: '', // ไม่รู้จะมาจริงเมื่อไร
    label_url: '', // ขอผ่าน ยังไม่มี endpoint รับ label
  };
}