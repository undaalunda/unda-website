// lib/shipping/zone-checker.ts

export type Zone = 'UK' | 'EU' | 'ROW';

export function getShippingZone(countryCode: string): Zone {
  const uk = ['GB', 'UK'];
  const eu = [
    'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'
  ];

  if (uk.includes(countryCode.toUpperCase())) return 'UK';
  if (eu.includes(countryCode.toUpperCase())) return 'EU';
  return 'ROW';
}
