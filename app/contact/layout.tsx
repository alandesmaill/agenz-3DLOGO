import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact AGENZ | Creative Agency in Sulaymaniyah, Iraq",
  description:
    "Get in touch with AGENZ — your creative hub in Sulaymaniyah. Ready to elevate your brand with advertising, video, design, and strategy services.",
  keywords: [
    "contact creative agency Iraq",
    "hire marketing agency Kurdistan",
    "creative agency Sulaymaniyah contact",
    "advertising agency contact Kurdistan",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact AGENZ | Creative Agency in Sulaymaniyah, Iraq",
    description:
      "Get in touch with AGENZ — your creative hub in Sulaymaniyah. Ready to elevate your brand with advertising, video, design, and strategy services.",
    url: "https://agenz-iq.com/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact AGENZ | Creative Agency in Sulaymaniyah, Iraq",
    description:
      "Get in touch with AGENZ — your creative hub in Sulaymaniyah.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
