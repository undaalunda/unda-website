//TourPage.tsx

import type { Metadata } from 'next';
import TourClientComponent from './TourClientComponent';

export const metadata: Metadata = {
  title: 'Tour - UNDA ALUNDA',
  description: 'Find upcoming Unda Alunda tour dates, locations, and ticket links. Experience the music live.',
};

export default function TourPage() {
  return <TourClientComponent />;
}