import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Feorm",
  description: "Manage your farm stay listings, view bookings, and track earnings on Feorm.",
  openGraph: {
    title: "Dashboard | Feorm",
    description: "Manage your farm stay listings and bookings on Feorm.",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
