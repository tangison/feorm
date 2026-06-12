"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useFeormMarket } from "@/context/feorm-context";
import { CheckCircle, MessageCircle } from "lucide-react";
import { useBookingByReference } from "@/hooks/use-bookings";
import { Suspense } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { SUPPORT_WHATSAPP_URL } from "@/lib/config";

function SuccessContent() {
  const { selectedListing } = useFeormMarket();
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get("ref") || "";

  // Look up booking by reference via REST API
  const { data: booking } = useBookingByReference(ref);

  const listingTitle = booking?.listing?.title || selectedListing?.title || "Feorm Booking";

  const triggerWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi, I just booked ${listingTitle} through Feorm. My reference is ${ref}. When is a good time to talk about my stay?`
    );
    window.open(`${SUPPORT_WHATSAPP_URL}?text=${msg}`, "_blank");
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-[60vh] bg-fog">
      <div className="max-w-md w-full text-center">
        {/* Booking success hero image */}
        <div className="relative w-full h-40 rounded-xl overflow-hidden mb-8">
          <Image
            src="/images/booking-success.png"
            alt="Booking confirmed"
            fill
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-earth/40 to-transparent" />
        </div>
        <div className="w-16 h-16 rounded-full bg-verified-bg flex items-center justify-center mx-auto -mt-12 relative z-10">
          <CheckCircle size={32} className="text-verified" />
        </div>

        <h1 className="font-serif-display text-3xl md:text-4xl mb-4 text-earth">
          You're Booked In
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Your farm stay is reserved. Message your host on WhatsApp to confirm arrival details and any special requests.
        </p>

        {ref && (
          <div className="border border-soil/10 bg-white-feorm rounded-[8px] p-6 mb-8">
            <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
              Your Booking Reference
            </p>
            <p className="font-mono-feorm text-2xl font-medium text-earth">
              {ref}
            </p>
            {booking && (
              <p className="font-mono-feorm text-[10px] text-muted-foreground mt-2 uppercase">
                Status: {booking.status} — {formatPrice(booking.totalPrice)}
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={triggerWhatsApp}
            className="w-full border border-whatsapp text-whatsapp px-5 py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 rounded-full hover:bg-whatsapp/5 transition-colors min-h-[44px]"
          >
            <MessageCircle size={14} /> Message Your Host on WhatsApp
          </button>
          <button
            onClick={() => router.push("/marketplace")}
            className="w-full btn-secondary-feorm px-5 py-3 text-xs uppercase tracking-widest min-h-[44px]"
          >
            Browse More Farm Stays
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-grow flex items-center justify-center min-h-[60vh]">
          <p className="text-sm text-muted-foreground font-mono-feorm">Loading...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
