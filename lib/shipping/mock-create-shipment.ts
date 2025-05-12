//mock-create-shipment.ts

export interface ShipmentInput {
  orderId: string;
  fullName: string;
  address: string;
  country: string;
  method: 'evri' | 'dhl';
}

export interface ShipmentResult {
  trackingNumber: string;
  trackingUrl: string;
  estimatedDelivery: string;
  labelUrl: string;
}

export function createMockShipment(input: ShipmentInput): ShipmentResult {
  const randomNum = Math.floor(100000000 + Math.random() * 900000000);
  const trackingNumber =
    input.method === 'dhl'
      ? `DHL-${randomNum}`
      : `EVRI-${randomNum}`;

  const trackingUrl =
    input.method === 'dhl'
      ? `https://track.dhl.com/${trackingNumber}`
      : `https://www.evri.com/track/${trackingNumber}`;

  const labelUrl = `https://fake-labels.undaalunda.com/${trackingNumber}.pdf`;
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toDateString();

  return {
    trackingNumber,
    trackingUrl,
    estimatedDelivery,
    labelUrl,
  };
}