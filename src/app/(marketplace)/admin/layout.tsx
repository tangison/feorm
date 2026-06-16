import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Feorm",
  description: "Feorm platform administration panel.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
