// lib/shipping/zone-checker.ts

export type Zone = 'TH' | 'ASIA' | 'ROW';

export function getShippingZone(countryCode: string): Zone {
  const th = ['TH']; // ประเทศไทยจ้าาา
  const asia = [
    'MY', 'SG', 'ID', 'PH', 'VN', 'JP', 'KR', 'CN', 'IN', 'PK', 'BD',
    'LK', 'NP', 'MM', 'KH', 'LA', 'MN', 'KZ', 'UZ', 'QA', 'KW', 'OM',
    'BH', 'AE', 'SA', 'IR', 'IQ', 'IL', 'JO', 'LB', 'GE', 'AM', 'AZ'
  ];

  const code = countryCode.toUpperCase();

  if (th.includes(code)) return 'TH';
  if (asia.includes(code)) return 'ASIA';
  return 'ROW';
}