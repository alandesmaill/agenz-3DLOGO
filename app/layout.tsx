import type { Metadata } from "next";
import StructuredData from "@/components/StructuredData";
import "./globals.css";

export const metadata: Metadata = {
  // Basic Information
  title: "AGENZ - CREATIVE HUB",
  description: "Creative digital agency specializing in advertising, video production, graphic design, and strategic media services.",

  // Application Information
  applicationName: "AGENZ",
  authors: [
    { name: "Aland Esmail" }
  ],
  creator: "Aland Esmail",
  publisher: "AGENZ",

  // SEO Keywords
  keywords: [
    "creative agency",
    "digital marketing",
    "video production",
    "graphic design",
    "advertising",
    "brand strategy",
    "social media marketing",
    "creative services"
  ],

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
    siteName: "AGENZ - CREATIVE HUB",
    title: "AGENZ - Creative Digital Agency",
    description: "Award-winning creative digital agency specializing in advertising, video production, graphic design, and strategic media services.",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "AGENZ - Creative Digital Agency",
    description: "Award-winning creative digital agency specializing in advertising, video production, graphic design, and strategic media services.",
  },

  // Favicon Configuration
  icons: {
    icon: [
      { url: "/favicon/web/favicon-16x16.svg", sizes: "16x16", type: "image/svg+xml" },
      { url: "/favicon/web/favicon-32x32.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/favicon/web/favicon-96x96.svg", sizes: "96x96", type: "image/svg+xml" },
      { url: "/favicon/web/favicon-196x196.svg", sizes: "196x196", type: "image/svg+xml" },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AGENZ",
    "description": "Creative digital agency specializing in advertising, video production, graphic design, and strategic media services.",
    "url": "https://agenz.com",
    "logo": "https://agenz.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "hello@agenz.com",
      "telephone": "+1-234-567-890"
    },
    "sameAs": [
      // Add social media links here when available
    ]
  };

  return (
    <html lang="en" className="light">
      <head>
        <meta name="color-scheme" content="light" />
        <StructuredData data={organizationSchema} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
