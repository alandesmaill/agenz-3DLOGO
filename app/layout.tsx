import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Three.js + Next.js",
  description: "A Three.js project with Next.js, React, and GSAP",
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
