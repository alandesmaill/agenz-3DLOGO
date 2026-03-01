import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio & Works | AGENZ Creative Hub",
  description:
    "Explore AGENZ's portfolio of brand identities, advertising campaigns, video productions, and event branding for clients across Kurdistan and Iraq.",
  keywords: [
    "creative portfolio Kurdistan",
    "advertising portfolio Iraq",
    "brand identity Sulaymaniyah",
    "video production portfolio",
    "event branding Iraq",
  ],
  alternates: {
    canonical: "/works",
  },
  openGraph: {
    title: "Portfolio & Works | AGENZ Creative Hub",
    description:
      "Explore AGENZ's portfolio of brand identities, advertising campaigns, video productions, and event branding for clients across Kurdistan and Iraq.",
    url: "https://agenz-iq.com/works",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio & Works | AGENZ Creative Hub",
    description:
      "Explore AGENZ's portfolio of brand identities, advertising campaigns, and event branding across Kurdistan and Iraq.",
  },
};

export default function WorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
