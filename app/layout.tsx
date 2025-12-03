import type { Metadata } from "next";
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

  // Favicon Configuration (Next.js 14 pattern)
  // TODO: Uncomment after generating favicon files (see favicon generation instructions)
  // icons: {
  //   icon: [
  //     { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
  //     { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
  //     { url: "/favicon.ico", sizes: "any" },
  //   ],
  //   apple: [
  //     { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  //   ],
  //   other: [
  //     {
  //       rel: "mask-icon",
  //       url: "/safari-pinned-tab.svg",
  //       color: "#00e92c", // Brand green color
  //     },
  //   ],
  // },

  // Web App Manifest
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
