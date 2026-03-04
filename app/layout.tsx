import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import StructuredData from "@/components/StructuredData";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://agenz-iq.com"),

  // Basic Information
  title: {
    template: "%s | AGENZ",
    default: "AGENZ - Creative Hub",
  },
  description:
    "Creative digital agency based in Sulaymaniyah, Kurdistan — specializing in advertising, video production, graphic design, and strategic media services.",

  // Application Information
  applicationName: "AGENZ",
  authors: [{ name: "Aland Esmail" }],
  creator: "Aland Esmail",
  publisher: "AGENZ",

  // SEO Keywords
  keywords: [
    "creative agency",
    "creative agency Sulaymaniyah",
    "creative agency Kurdistan",
    "digital marketing Iraq",
    "creative hub Iraq",
    "video production",
    "graphic design",
    "advertising",
    "brand strategy",
    "social media marketing",
    "creative services",
    "AGENZ creative",
  ],

  // Canonical
  alternates: {
    canonical: "/",
  },

  // Category
  category: "Business",

  // Robots Directive
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AGENZ - Creative Hub",
    title: "AGENZ - Creative Digital Agency",
    description:
      "Creative digital agency based in Sulaymaniyah, Kurdistan — specializing in advertising, video production, graphic design, and strategic media services.",
    url: "https://agenz-iq.com",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AGENZ - Creative Hub",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "AGENZ - Creative Digital Agency",
    description:
      "Creative digital agency based in Sulaymaniyah, Kurdistan — specializing in advertising, video production, graphic design, and strategic media services.",
    images: ["/opengraph-image"],
  },

  // Favicon Configuration
  icons: {
    shortcut: "/favicon.ico",
    icon: [
      { url: "/favicon/web/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/web/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/web/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/web/favicon-128x128.png", sizes: "128x128", type: "image/png" },
      { url: "/favicon/web/favicon-196x196.png", sizes: "196x196", type: "image/png" },
    ],
    apple: [
      { url: "/favicon/apple/apple-touch-icon-180x180.png", sizes: "180x180", type: "image/png" },
      { url: "/favicon/apple/apple-touch-icon-167x167.png", sizes: "167x167", type: "image/png" },
      { url: "/favicon/apple/apple-touch-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/favicon/apple/apple-touch-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/favicon/apple/apple-touch-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/favicon/apple/apple-touch-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/favicon/apple/apple-touch-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/favicon/apple/apple-touch-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/favicon/apple/apple-touch-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/favicon/apple/apple-touch-icon-57x57.png", sizes: "57x57", type: "image/png" },
    ],
  },

  // Web App Manifest
  manifest: "/manifest.json",

  // Windows tile config
  other: {
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: "AGENZ",
    description:
      "Creative digital agency specializing in advertising, video production, graphic design, and strategic media services.",
    url: "https://agenz-iq.com",
    logo: "https://agenz-iq.com/Agenz-logo-white.svg",
    email: "agenz@agenz-iq.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "City Center, Office 26, Floor 7",
      addressLocality: "Sulaymaniyah",
      addressCountry: "IQ",
    },
    areaServed: ["Kurdistan Region", "Iraq"],
    sameAs: [
      "https://www.instagram.com/agenz.iq/",
      "https://www.linkedin.com/company/agenz-iq/",
    ],
  };

  return (
    <html lang="en">
      <head>
        <StructuredData data={organizationSchema} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
