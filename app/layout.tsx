import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AGENZ - CREATIVE HUB",
  description: "Creative digital agency specializing in advertising, video production, graphic design, and strategic media services.",
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
