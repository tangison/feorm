import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Journeys | Feorm",
  description: "Track your upcoming and past farm stay bookings on Feorm.",
  openGraph: {
    title: "My Journeys | Feorm",
    description: "Track your farm stay bookings on Feorm.",
  },
};

export default function JourneysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
