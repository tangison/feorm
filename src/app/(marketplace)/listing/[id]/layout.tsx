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
      type: "website",
      url: `https://feorm.na/listing/${id}`,
    },
  };
}

export default async function ListingLayout({
  children,
  params,
}: ListingLayoutProps) {
  const { id } = await params;
  const listing = getDemoListingById(id);

  const jsonLd = listing
    ? {
        "@context": "https://schema.org",
        "@type": "LodgingBusiness",
        name: listing.title,
        description: listing.description.slice(0, 300),
        image: listing.images[0] || undefined,
        address: {
          "@type": "PostalAddress",
          addressRegion: listing.region,
          addressCountry: "NA",
        },
        geo:
          listing.lat && listing.lng
            ? {
                "@type": "GeoCoordinates",
                latitude: listing.lat,
                longitude: listing.lng,
              }
            : undefined,
        priceRange: `N$${(listing.price / 100).toFixed(0)}/day`,
        aggregateRating:
          listing.rating > 0
            ? {
                "@type": "AggregateRating",
                ratingValue: listing.rating,
                reviewCount: listing.reviewCount,
              }
            : undefined,
        url: `https://feorm.na/listing/${id}`,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
