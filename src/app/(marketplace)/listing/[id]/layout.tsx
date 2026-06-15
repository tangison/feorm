import type { Metadata } from "next";
import { getDemoListingById } from "@/lib/demo-data";

interface ListingLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = getDemoListingById(id);

  if (!listing) {
    return {
      title: "Listing Not Found | Feorm",
    };
  }

  return {
    title: `${listing.title} | Feorm`,
    description: listing.description.slice(0, 160),
    openGraph: {
      title: `${listing.title} | Feorm`,
      description: listing.description.slice(0, 160),
      images: listing.images[0] ? [{ url: listing.images[0] }] : undefined,
    },
  };
}

export default function ListingLayout({ children }: ListingLayoutProps) {
  return children;
}
