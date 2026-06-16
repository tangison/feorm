import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "List Your Farm | Feorm",
  description: "Create a new farm stay listing on Feorm. Share your land with travellers seeking authentic Namibian experiences.",
};

export default function ListingNewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
