"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useFeorm } from "@/context/feorm-context";
import { CheckCircle, MessageCircle } from "lucide-react";
import { useBookingByReference } from "@/hooks/use-bookings";
import { Suspense } from "react";

function SuccessContent() {
  const { selectedListing } = useFeorm();
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get("ref") || "";

  // Try to look up booking from Convex by reference (with REST fallback)
  const { data: booking } = useBookingByReference(ref);

  const listingTitle = booking?.listing?.title || selectedListing?.title || "Feorm Booking";

  const triggerWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi, I've just booked [${listingTitle}] on Feorm. Looking forward to it! My Ref is: ${ref}`
    );
    window.open(`https://wa.me/264810000000?text=${msg}`, "_blank");
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-[60vh] bg-[#FAF7F2]">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-[#EDF3EC] flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={32} className="text-[#346538]" />
        </div>

        <h2 className="font-serif-display text-3xl md:text-4xl mb-4 text-[#1E1A14]">
          Contract Initialized
        </h2>
        <p className="text-sm text-[#787774] mb-8">
          Your booking reference has been generated. Connect with the owner to
          finalize details.
        </p>

        {ref && (
          <div className="border border-[#3C2F1A]/10 bg-[#FEFDFB] rounded-[8px] p-6 mb-8">
            <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
              Booking Reference
            </p>
            <p className="font-mono-feorm text-2xl font-medium text-[#1E1A14]">
              {ref}
            </p>
            {booking && (
              <p className="font-mono-feorm text-[10px] text-[#787774] mt-2 uppercase">
                Status: {booking.status} — {formatPrice(booking.totalPrice)}
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={triggerWhatsApp}
            className="w-full border border-[#25D366] text-[#25D366] py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 rounded-full hover:bg-[#25D366]/5 transition-colors"
          >
            <MessageCircle size={14} /> Connect via WhatsApp
          </button>
          <button
            onClick={() => router.push("/marketplace")}
            className="w-full btn-secondary-feorm py-3 text-xs uppercase tracking-widest"
          >
            Return to Marketplace
          </button>
        </div>
      </div>
    </div>
  );
}

function formatPrice(cents: number): string {
  return `N$ ${(cents / 100).toLocaleString()}`;
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-grow flex items-center justify-center min-h-[60vh]">
          <p className="text-sm text-[#787774] font-mono-feorm">Loading...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
