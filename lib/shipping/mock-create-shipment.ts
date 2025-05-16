//mock-create-shipment.ts

export interface ShipmentInput {
  orderId: string;
  fullName: string;
  address: string;
  country: string;
  method: 'dhl';
}

export interface ShipmentResult {
  tracking_number: string;
  courier: string;
  tracking_url: string;
  estimated_delivery: string;
  label_url: string;
}

export function createMockShipment(input: ShipmentInput): ShipmentResult {
  const randomNum = Math.floor(100000000 + Math.random() * 900000000);
  const tracking_number = `DHL-${randomNum}`;
  const tracking_url = `https://track.dhl.com/${tracking_number}`;
  const label_url = `https://fake-labels.undaalunda.com/${tracking_number}.pdf`;
  const estimated_delivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toDateString();

  return {
    tracking_number,
    courier: 'dhl',
    tracking_url,
    estimated_delivery,
    label_url,
  };
}