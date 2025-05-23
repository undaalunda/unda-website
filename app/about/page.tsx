// app/about/page.tsx
import type { Metadata } from 'next';
import AboutClientComponent from './AboutClientComponent'; // ⛔️ อย่าใช้ dynamic
export const metadata: Metadata = {
  title: 'About - UNDA ALUNDA',
  description:
    'Discover the journey of Unda Alunda – from childhood obsessions with sound to international recognition through raw emotion, musical mastery, and artistic spirit.',
};

export default function AboutPage() {
  return <AboutClientComponent />;
}