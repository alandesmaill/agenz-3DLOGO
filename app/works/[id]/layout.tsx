import { Metadata } from "next";
import { getPortfolioById } from "@/lib/works-data";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const portfolio = getPortfolioById(id);

  if (!portfolio) {
    return {
      title: "Project Not Found | AGENZ Works",
    };
  }

  return {
    title: `${portfolio.projectTitle} | AGENZ Works`,
    description: portfolio.hero.description,
    alternates: {
      canonical: `/works/${portfolio.id}`,
    },
    openGraph: {
      title: portfolio.projectTitle,
      description: portfolio.hero.description,
      url: `https://agenz-iq.com/works/${portfolio.id}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: portfolio.projectTitle,
      description: portfolio.hero.description,
    },
  };
}

export default function WorkDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
