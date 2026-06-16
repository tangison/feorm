import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verification | Feorm",
  description: "Complete your identity verification to become a trusted Feorm host or guest.",
};

export default function VerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
