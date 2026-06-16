import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How it Works | Feorm",
  description:
    "Feorm connects Namibian landowners with travellers seeking authentic farm stays. List your farm for free or explore unique agricultural experiences across Namibia.",
  openGraph: {
    title: "How it Works | Feorm",
    description:
      "Feorm connects Namibian landowners with travellers seeking authentic farm stays.",
    url: "https://feorm.na/landing",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "How it Works — Feorm",
  description:
    "Feorm connects Namibian landowners with travellers seeking authentic farm stays.",
  url: "https://feorm.na/landing",
  isPartOf: {
    "@type": "WebSite",
    name: "Feorm",
    url: "https://feorm.na",
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
