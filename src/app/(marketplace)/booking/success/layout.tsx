import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Confirmed | Feorm",
  description: "Your farm stay booking has been confirmed on Feorm.",
};

export default function BookingSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
