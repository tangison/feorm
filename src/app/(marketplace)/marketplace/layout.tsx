import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Farm Stays | Feorm",
  description:
    "Browse farm stays across Namibia. Find authentic agricultural experiences, from desert camps to riverside lodges. Real land, real hosts, real rest.",
  openGraph: {
    title: "Farm Stays | Feorm",
    description:
      "Browse farm stays across Namibia. Real land, real hosts, real rest.",
  },
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
