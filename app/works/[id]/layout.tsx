import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const portfolio = await prisma.portfolioProject.findUnique({
    where: { slug: id, published: true },
    select: {
      slug: true,
      projectTitle: true,
      heroDescription: true,
    },
  });

  if (!portfolio) {
    return {
      title: "Project Not Found | AGENZ Works",
    };
  }

  return {
    title: `${portfolio.projectTitle} | AGENZ Works`,
    description: portfolio.heroDescription,
    alternates: {
      canonical: `/works/${portfolio.slug}`,
    },
    openGraph: {
      title: portfolio.projectTitle,
      description: portfolio.heroDescription,
      url: `https://agenz-iq.com/works/${portfolio.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: portfolio.projectTitle,
      description: portfolio.heroDescription,
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
