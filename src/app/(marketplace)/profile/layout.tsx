import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Feorm",
  description: "View and manage your Feorm profile, verification status, and account details.",
  openGraph: {
    title: "Profile | Feorm",
    description: "Manage your Feorm profile and account settings.",
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
