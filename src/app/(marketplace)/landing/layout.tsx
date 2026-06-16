import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How it Works | Feorm",
  description:
    "Feorm connects Namibian landowners with travellers seeking authentic farm stays. List your farm for free or explore unique agricultural experiences across Namibia.",
  openGraph: {
    title: "How it Works | Feorm",
    description:
      "Feorm connects Namibian landowners with travellers seeking authentic farm stays.",
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
