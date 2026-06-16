import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | Feorm",
  description: "Get help with your Feorm account, bookings, or farm stay listings. Contact our support team via WhatsApp.",
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
