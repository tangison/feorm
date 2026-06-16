import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Feorm",
  description: "Manage your Feorm account settings, notifications, and preferences.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
