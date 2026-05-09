"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useListing } from "@/hooks/use-listings";
import { useCreateBooking } from "@/hooks/use-bookings";
import { formatPrice } from "@/components/feorm/listing-card";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function BookPage() {
  const params = useParams<{ id: string }>();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [withOperator, setWithOperator] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // REST API query for listing details
  const { data: listing, isLoading: listingLoading } = useListing(params.id);

  // REST API booking creation
  const { createBooking } = useCreateBooking();

  const days =
    startDate && endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const rentalPrice = listing ? listing.price * days : 0;
  const serviceFee = Math.round(rentalPrice * 0.1);
  const operatorFee = withOperator ? 50000 * days : 0;
  const totalPrice = rentalPrice + serviceFee + 150000 + operatorFee;

  // Date validation
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDateObj = startDate ? new Date(startDate) : null;
  const endDateObj = endDate ? new Date(endDate) : null;
  const startDateInvalid = startDateObj ? startDateObj < today : false;
  const endDateInvalid = endDateObj && startDateObj ? endDateObj <= startDateObj : false;

  const handleCreateBooking = async () => {
    if (!listing || !startDate || !endDate) return;
    setLoading(true);
    try {
      const result = await createBooking({
        listingId: listing._id,
        userId: "demo-user",
        startDate,
        endDate,
        totalPrice,
        escrowAmount: 150000,
        serviceFee,
        withOperator,
      });

      // Navigate to success page with reference
      router.push(`/booking/success?ref=${result.reference}`);
    } catch {
      // Fallback for demo
      const ref = `FE-${Date.now().toString(36).toUpperCase()}`;
      router.push(`/booking/success?ref=${ref}`);
    }
    setLoading(false);
  };

  if (listingLoading || !listing) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#E8C96A] animate-pulse" />
          <p className="text-sm text-[#787774] font-mono-feorm">
            Loading listing details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-[60vh] bg-[#FAF7F2]">
      <div className="max-w-lg w-full">
        <button
          onClick={() => router.push(`/listing/${params.id}`)}
          className="mb-8 flex items-center gap-2 text-sm text-[#787774] hover:text-[#1E1A14] transition-colors"
        >
          <ArrowLeft size={16} /> Back to Listing
        </button>

        <div className="mb-10">
          <kbd className="font-mono-feorm text-[10px] border border-[#3C2F1A]/20 bg-[#FEFDFB] px-2 py-1 rounded text-[#787774] mb-6 inline-block">
            ORDER CONFIGURATION
          </kbd>
          <h2 className="font-serif-display text-3xl md:text-4xl mb-4 text-[#1E1A14]">
            {listing.title}
          </h2>
          <p className="text-sm text-[#787774]">
            Configure your{" "}
            {listing.type === "stay" ? "stay" : "rental"} dates and options.
          </p>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-[#3C2F1A]/20 bg-[#FEFDFB] p-4 rounded-[4px] focus-within:border-[#1E1A14] transition-colors">
              <label htmlFor="start-date" className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-[#787774]">
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-transparent outline-none text-base text-[#1E1A14] min-h-[44px]"
              />
            </div>
            <div className="border border-[#3C2F1A]/20 bg-[#FEFDFB] p-4 rounded-[4px] focus-within:border-[#1E1A14] transition-colors">
              <label htmlFor="end-date" className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-[#787774]">
                End Date
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-transparent outline-none text-base text-[#1E1A14] min-h-[44px]"
              />
            </div>
          </div>

          {listing.type === "equipment" && (
            <label className="flex items-start gap-3 p-4 border border-[#3C2F1A]/10 bg-[#FEFDFB] rounded-[4px] cursor-pointer">
              <input
                type="checkbox"
                checked={withOperator}
                onChange={(e) => setWithOperator(e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#1E1A14]"
              />
              <div>
                <p className="text-sm font-medium text-[#1E1A14]">
                  Operator Required
                </p>
                <p className="text-xs text-[#787774]">
                  Include a trained operator for this equipment (+N$ 500/day)
                </p>
              </div>
            </label>
          )}
        </div>

        {startDate && endDate && (startDateInvalid || endDateInvalid) && (
          <div className="mt-4 p-4 rounded-[4px] bg-[#FDEBEC] text-[#9F2F2D] text-sm">
            {startDateInvalid && <p>Start date must be today or later.</p>}
            {endDateInvalid && <p>End date must be after start date.</p>}
          </div>
        )}

        {startDate && endDate && !startDateInvalid && !endDateInvalid && (
          <div className="mt-8 border border-[#3C2F1A]/10 bg-[#FEFDFB] rounded-[8px] p-6">
            <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-4">
              Price Breakdown
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#787774]">
                  Rental ({formatPrice(listing.price)} x {days} days)
                </span>
                <span className="font-mono-feorm text-[#1E1A14]">
                  {formatPrice(rentalPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#787774]">Service Fee (10%)</span>
                <span className="font-mono-feorm text-[#1E1A14]">
                  {formatPrice(serviceFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#787774]">Security Escrow</span>
                <span className="font-mono-feorm text-[#1E1A14]">N$ 1,500</span>
              </div>
              {withOperator && (
                <div className="flex justify-between">
                  <span className="text-[#787774]">Operator Fee (N$ 500 x {days} days)</span>
                  <span className="font-mono-feorm text-[#1E1A14]">
                    {formatPrice(operatorFee)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-[#3C2F1A]/10 font-medium">
                <span className="text-[#1E1A14]">Total to Pay</span>
                <span className="font-mono-feorm text-[#1E1A14] text-lg">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleCreateBooking}
          disabled={!startDate || !endDate || loading || startDateInvalid || endDateInvalid}
          className="w-full mt-8 btn-harvest py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        >
          {loading ? "Processing..." : "Initialize Contract"}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
