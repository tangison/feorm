"use client";

import { useFeormAuth } from "@/context/feorm-context";
import { useRouter } from "next/navigation";
import { useBookings } from "@/hooks/use-bookings";
import { Clock, ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format";

export default function JourneysPage() {
  const { user, phone } = useFeormAuth();
  const router = useRouter();

  const { data: bookings, isLoading: bookingsLoading } = useBookings(
    user?.phone || `+264${phone.replace(/\s/g, "")}` || "unknown"
  );

  return (
    <div className="flex-grow w-full max-w-4xl mx-auto px-6 py-12 md:py-24">
      <div className="mb-12">
        <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          My Journeys
        </p>
        <h1 className="font-serif-display text-4xl md:text-5xl text-earth mb-3 tracking-tight">
          Your Bookings
        </h1>
        <p className="text-sm text-muted-foreground">
          Active, upcoming, and past bookings.{" "}
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-verified animate-pulse" />
            <span className="font-mono-feorm text-[9px] uppercase tracking-widest">Live</span>
          </span>
        </p>
      </div>

      {bookingsLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bento-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-5 w-16 skeleton-shimmer rounded-full" />
                <div className="h-4 w-28 skeleton-shimmer" />
              </div>
              <div className="h-6 w-3/4 skeleton-shimmer mb-2" />
              <div className="h-4 w-1/3 skeleton-shimmer" />
            </div>
          ))}
        </div>
      )}

      {!bookingsLoading && bookings?.length === 0 && (
        <div className="border border-dashed border-sand/50 bg-white-feorm rounded-[8px] p-12 text-center">
          <Image
            src="/images/empty-journeys.png"
            alt=""
            width={200}
            height={200}
            className="mx-auto mb-4 rounded-lg opacity-80"
          />
          <p className="text-sm text-muted-foreground mb-6">
            No bookings yet. Browse the marketplace to make your first one.
          </p>
          <Link
            href="/marketplace"
            className="btn-primary-feorm px-6 py-3 text-xs uppercase tracking-widest inline-flex items-center gap-2"
          >
            Browse Marketplace <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {!bookingsLoading && bookings && bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Link
              key={b._id}
              href={`/listing/${b.listingId}`}
              className="bento-card bento-card-lift p-6 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer hover:border-soil/20 transition-colors"
              aria-label={`View ${b.listing?.title || "listing"}`}
            >
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-[9px] uppercase font-semibold px-2 py-0.5 rounded-full tracking-wider ${
                      b.status === "confirmed"
                        ? "tag-verified"
                        : b.status === "pending"
                        ? "tag-pastel"
                        : "tag-alert"
                    }`}
                  >
                    {b.status}
                  </span>
                  <span className="font-mono-feorm text-[9px] text-muted-foreground uppercase tracking-widest">
                    {b.reference}
                  </span>
                  {b.status === "confirmed" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-verified animate-pulse" />
                  )}
                </div>
                <h3 className="font-serif-display text-lg text-earth">
                  {b.listing?.title || "Listing"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono-feorm flex items-center gap-1">
                  <MapPin size={10} aria-hidden="true" />
                  {b.listing?.region || "Namibia"} — {b.startDate} to {b.endDate}
                  {b.withOperator && (
                    <span className="tag-machinery text-[8px] px-1.5 py-0.5 ml-2">w/ Operator</span>
                  )}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono-feorm text-lg font-medium text-earth">
                  {formatPrice(b.totalPrice)}
                </p>
                <p className="text-[9px] text-muted-foreground font-mono-feorm uppercase tracking-wider">
                  incl. N$ {(b.escrowAmount / 100).toLocaleString()} escrow
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
