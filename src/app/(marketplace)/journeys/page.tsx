"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFeorm } from "@/context/feorm-context";
import { Clock, ArrowRight } from "lucide-react";
import { formatPrice } from "@/components/feorm/listing-card";
import Link from "next/link";

export default function JourneysPage() {
  const { user, bookings, setBookings } = useFeorm();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetch(`/api/bookings?userId=${user.id}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          setBookings(data);
        })
        .catch(() => {});
    }
  }, [user, setBookings]);

  return (
    <div className="flex-grow w-full max-w-4xl mx-auto px-6 py-12 md:py-24">
      <div className="mb-12">
        <h2 className="font-serif-display text-4xl md:text-5xl text-[#1E1A14] mb-3">
          My Journeys
        </h2>
        <p className="text-sm text-[#787774]">
          Active, upcoming, and past bookings on the Feorm network.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="border border-dashed border-[#D4C4A0]/50 bg-[#FEFDFB] rounded-[8px] p-12 text-center">
          <Clock size={32} className="text-[#D4C4A0] mx-auto mb-4" />
          <p className="text-sm text-[#787774] mb-6">
            No bookings yet. Explore the marketplace to begin.
          </p>
          <Link
            href="/marketplace"
            className="btn-primary-feorm px-6 py-3 text-xs uppercase tracking-widest inline-flex items-center gap-2"
          >
            Browse Marketplace <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bento-card p-6 flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-[10px] uppercase font-medium px-2.5 py-1 rounded-full ${
                      b.status === "confirmed"
                        ? "tag-verified"
                        : b.status === "pending"
                        ? "tag-pastel"
                        : "tag-alert"
                    }`}
                  >
                    {b.status}
                  </span>
                  <span className="font-mono-feorm text-[10px] text-[#787774]">
                    {b.referenceNumber}
                  </span>
                </div>
                <h3 className="font-serif-display text-xl text-[#1E1A14]">
                  {b.listing?.title || "Listing"}
                </h3>
                <p className="text-xs text-[#787774] mt-1">
                  {b.startDate} → {b.endDate}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono-feorm text-lg font-medium text-[#1E1A14]">
                  {formatPrice(b.totalPrice)}
                </p>
                <p className="text-[10px] text-[#787774] font-mono-feorm uppercase">
                  incl. escrow
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
