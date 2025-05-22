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
  console.log('[🧪 ENV CHECK]', {
    username,
    password: password?.slice(0, 4) + '***',
    accountNumber,
    endpoint,
  });

  const productCode = destinationCountry === 'TH' ? 'N' : undefined;
  const plannedDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toISOString()
    .replace('Z', '+07:00');

  const payload: any = {
    customerDetails: {
      shipperDetails: {
        postalCode: '10200',
        cityName: 'Bangkok',
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
        number: accountNumber,
      },
    ],
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
  };

  if (productCode) payload.productCode = productCode;

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

  const selectedProduct = data.products?.find(
    (p: any) => p.totalPrice?.some((t: any) => t.price > 0)
  );

  if (!selectedProduct) {
    throw new Error('No suitable DHL rate found.');
  }

  const billcPrice = selectedProduct.totalPrice?.find(
    (entry: any) => entry.currencyType === 'BILLC'
  );

  const thbPrice = billcPrice?.price ?? 0;
  const exchangeRate = data.exchangeRates?.find(
    (rate: any) => rate.currency === 'THB' && rate.baseCurrency === 'USD'
  );

  const usdRate = exchangeRate?.currentExchangeRate ?? 0.027;
  const convertedPrice = +(thbPrice * usdRate).toFixed(2);

  return {
    productName: selectedProduct.productName,
    productCode: selectedProduct.productCode,
    priceTHB: thbPrice,
    priceUSD: convertedPrice,
    currency: 'USD',
    estimatedDeliveryDate: selectedProduct.deliveryCapabilities?.estimatedDeliveryDateAndTime,
    pricingDate: selectedProduct.pricingDate,
  };
}