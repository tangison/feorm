"use client";

import { useParams, useRouter } from "next/navigation";
import { useListing } from "@/hooks/use-listings";
import { formatPrice } from "@/components/feorm/listing-card";
import Image from "next/image";
import { ChevronLeft, MessageCircle, ArrowRight } from "lucide-react";

export default function ListingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data: listing, isLoading, notFound } = useListing(params.id);

  const triggerWhatsApp = (title: string) => {
    const msg = encodeURIComponent(
      `System Alert: Initiating inquiry for [${title}] via Feorm network.`
    );
    window.open(`https://wa.me/264853411522?text=${msg}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#E8C96A] animate-pulse" />
          <p className="text-sm text-[#787774] font-mono-feorm">
            Loading listing...
          </p>
        </div>
      </div>
    );
  }

  if (notFound || listing === null) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-sm text-[#787774] mb-4">Listing not found.</p>
          <button
            onClick={() => router.push("/marketplace")}
            className="btn-primary-feorm px-6 py-3 text-xs uppercase tracking-widest"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const features = listing.features;

  return (
    <div className="flex-grow w-full max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-12">
      <div className="bg-[#FEFDFB] border border-[#3C2F1A]/10 rounded-[8px] overflow-hidden md:min-h-[600px]">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left: Image */}
          <div className="w-full md:w-1/2 bg-[#FAF7F2] relative h-[35vh] md:h-auto border-b md:border-b-0 md:border-r border-[#3C2F1A]/10">
            <Image
              src={listing.image}
              alt={listing.title}
              width={600}
              height={450}
              className="w-full h-full object-cover opacity-90 p-2 md:p-4"
              loading="lazy"
            />
            <button
              onClick={() => router.push("/marketplace")}
              className="absolute top-4 left-4 md:top-8 md:left-8 bg-[#FEFDFB]/90 backdrop-blur-sm border border-[#3C2F1A]/10 p-2 rounded-full text-[#1E1A14] hover:bg-[#FEFDFB] transition-colors shadow-sm"
              aria-label="Back to marketplace"
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          {/* Right: Details */}
          <div className="w-full md:w-1/2 bg-[#FEFDFB] p-6 md:p-12 flex flex-col overflow-y-auto">
            <div className="flex-grow max-w-md">
              <div className="flex items-center gap-3 mb-5">
                <span
                  className={`text-[10px] uppercase font-medium px-2.5 py-1 rounded-full ${
                    listing.type === "stay" ? "tag-pastel" : "tag-machinery"
                  }`}
                >
                  {listing.category}
                </span>
                <span className="font-mono-feorm text-[10px] text-[#787774] uppercase tracking-widest">
                  {listing.region}
                </span>
              </div>

              <h2 className="font-serif-display text-3xl md:text-4xl mb-5 text-[#1E1A14] leading-[1.1] tracking-tight">
                {listing.title}
              </h2>

              <div className="text-[#1E1A14] mb-8 pb-8 border-b border-[#3C2F1A]/10">
                <span className="text-2xl font-medium">
                  {formatPrice(listing.price)}
                </span>
                <span className="text-sm text-[#787774] ml-1 uppercase tracking-wide">
                  / day
                </span>
              </div>

              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-3">
                Description
              </h4>
              <p className="text-[#3C2F1A] text-sm leading-relaxed mb-8">
                {listing.description}
              </p>

              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-3">
                Specifications
              </h4>
              <div className="flex flex-wrap gap-2 mb-8">
                {features.map((f: string) => (
                  <span
                    key={f}
                    className="border border-[#3C2F1A]/10 rounded-full bg-[#FAF7F2] px-3 py-1 text-xs text-[#787774]"
                  >
                    {f.trim()}
                  </span>
                ))}
              </div>

              {/* Host Bio */}
              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-3">
                Host
              </h4>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1E1A14] text-[#FEFDFB] flex items-center justify-center text-xs font-medium font-serif-display">
                  {listing.hostName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1E1A14]">
                    {listing.hostName}
                  </p>
                  <p className="text-xs text-[#787774] font-mono-feorm">
                    {listing.hostPhone}
                  </p>
                </div>
                <span className="tag-verified text-[10px] uppercase font-medium px-2.5 py-1">
                  Verified
                </span>
              </div>
            </div>

            <div className="mt-auto pt-6 bg-[#FEFDFB]">
              <div className="flex justify-between text-sm mb-4">
                <span className="text-[#787774]">Security Escrow</span>
                <span className="font-medium font-mono-feorm text-[#1E1A14]">
                  N$ 1,500
                </span>
              </div>
              <button
                onClick={() => router.push(`/listing/${params.id}/book`)}
                className="w-full btn-harvest py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 min-h-[44px]"
              >
                {listing.type === "stay" ? "Request Stay" : "Rent Machinery"}
                <ArrowRight size={14} aria-hidden="true" />
              </button>
              <button
                onClick={() => triggerWhatsApp(listing.title)}
                className="w-full mt-3 border border-[#25D366] text-[#25D366] py-3 text-xs uppercase tracking-widest flex justify-center items-center gap-2 rounded-full hover:bg-[#25D366]/5 transition-colors"
              >
                <MessageCircle size={14} /> WhatsApp Inquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
