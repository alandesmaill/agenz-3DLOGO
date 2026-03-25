import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Camera Rental — ARRI Alexa 35 Cinema Package - AGENZ',
  description:
    'Professional ARRI Alexa 35 cinema camera package with Signature Prime lenses and full accessories. Production-ready rental for film and commercial production.',
  keywords: [
    'camera rental',
    'ARRI Alexa 35',
    'Signature Prime lenses',
    'cinema camera rental',
    'film equipment rental',
    'camera package Iraq',
    'ARRI camera Kurdistan',
    'cinema production equipment Sulaymaniyah',
  ],
  openGraph: {
    title: 'Camera Rental — ARRI Alexa 35 Cinema Package - AGENZ',
    description:
      'Professional ARRI Alexa 35 cinema camera package with Signature Prime lenses. Production-ready rental.',
    type: 'website',
    url: 'https://agenz-iq.com/services/camera-rental',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Camera Rental — ARRI Alexa 35 Package - AGENZ',
    description: 'Professional ARRI Alexa 35 cinema camera package with Signature Prime lenses.',
  },
};

export default function CameraRentalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
