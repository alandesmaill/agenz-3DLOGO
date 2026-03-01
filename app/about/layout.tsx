import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About AGENZ | Creative Digital Agency in Kurdistan",
  description:
    "Meet the team behind AGENZ — a creative digital agency based in Sulaymaniyah, Kurdistan. We combine strategy, design, video, and advertising to build brands that last.",
  keywords: [
    "about AGENZ",
    "creative agency Kurdistan",
    "digital agency Sulaymaniyah",
    "creative team Iraq",
    "brand agency Kurdistan Iraq",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About AGENZ | Creative Digital Agency in Kurdistan",
    description:
      "Meet the team behind AGENZ — a creative digital agency based in Sulaymaniyah, Kurdistan. We combine strategy, design, video, and advertising to build brands that last.",
    url: "https://agenz-iq.com/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About AGENZ | Creative Digital Agency in Kurdistan",
    description:
      "Meet the team behind AGENZ — a creative digital agency based in Sulaymaniyah, Kurdistan.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
