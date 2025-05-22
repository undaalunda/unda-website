// lib/shipping/get-dhl-rate.ts

export async function getDHLRate({
  destinationCountry,
  destinationPostalCode,
  destinationCity,
  weight = 1,
}: {
  destinationCountry: string;
  destinationPostalCode: string;
  destinationCity: string;
  weight?: number;
}) {
  const username = process.env.DHL_USERNAME!;
  const password = process.env.DHL_PASSWORD!;
  const accountNumber = process.env.DHL_ACCOUNT_NUMBER!;
  const endpoint = `${process.env.DHL_API_URL}/rates`;
  const credentials = Buffer.from(`${username}:${password}`).toString('base64');

  const payload = {
    customerDetails: {
      shipperDetails: {
        postalCode: '73000',
        cityName: 'Nakhon Pathom',
        countryCode: 'TH',
      },
      receiverDetails: {
        postalCode: destinationPostalCode,
        cityName: destinationCity,
        countryCode: destinationCountry,
      },
    },
    accounts: [
      {
        typeCode: 'shipper',
        number: accountNumber, // 🛠 ใช้จาก env เพื่อให้ consistent
      },
    ],
    productCode: 'N',
    plannedShippingDateAndTime: new Date().toISOString(),
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
  };

  console.log('[📦 DHL Request Payload]', JSON.stringify(payload, null, 2));

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
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
    throw new Error('Invalid JSON received from DHL');
  }

  if (!res.ok) {
    console.error('[❌ DHL Rate Error]', data);
    throw new Error(data?.detail || 'DHL API error');
  }

  console.log('[💸 DHL API Response]', JSON.stringify(data, null, 2));
  return data.products?.[0];
}