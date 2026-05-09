"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFeorm, type Listing } from "@/context/feorm-context";
import { formatPrice } from "@/components/feorm/listing-card";
import Image from "next/image";
import { ChevronLeft, MessageCircle, ArrowRight } from "lucide-react";

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { setSelectedListing } = useFeorm();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    fetch(`/api/listings`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Listing[]) => {
        const found = data.find((l) => l.id === id);
        if (found) {
          setListing(found);
          setSelectedListing(found);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, setSelectedListing]);

  const triggerWhatsApp = (title: string) => {
    const msg = encodeURIComponent(
      `System Alert: Initiating inquiry for [${title}] via Feorm network.`
    );
    window.open(`https://wa.me/264810000000?text=${msg}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-[#787774] font-mono-feorm">Loading...</p>
      </div>
    );
  }

  if (!listing) {
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

  const features = listing.features.split(",");

  return (
    <div className="flex-grow w-full max-w-6xl mx-auto bg-[#FEFDFB] md:my-12 md:border md:border-[#3C2F1A]/10 md:rounded-[8px] md:min-h-[700px] overflow-hidden">
      <div className="flex flex-col md:flex-row h-full">
        {/* Left: Image */}
        <div className="w-full md:w-1/2 bg-[#FAF7F2] relative h-[40vh] md:h-auto border-b md:border-b-0 md:border-r border-[#3C2F1A]/10">
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            width={600}
            height={450}
            className="w-full h-full object-cover opacity-90 p-2 md:p-6"
            loading="lazy"
          />
          <button
            onClick={() => router.push("/marketplace")}
            className="absolute top-6 left-6 md:top-10 md:left-10 bg-[#FEFDFB] border border-[#3C2F1A]/10 p-2 rounded-full text-[#1E1A14] hover:bg-[#FAF7F2] transition-colors shadow-sm"
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 bg-[#FEFDFB] p-8 md:p-16 flex flex-col overflow-y-auto">
          <div className="flex-grow max-w-md">
            <div className="flex items-center gap-3 mb-6">
              <span
                className={`text-[10px] uppercase font-medium px-2.5 py-1 rounded-full ${
                  listing.type === "stay" ? "tag-pastel" : "tag-machinery"
                }`}
              >
                {listing.category}
              </span>
              <span className="font-mono-feorm text-xs text-[#787774]">
                {listing.region}
              </span>
            </div>

            <h2 className="font-serif-display text-4xl md:text-5xl mb-6 text-[#1E1A14] leading-[1.1]">
              {listing.title}
            </h2>

            <div className="text-[#1E1A14] mb-10 pb-10 border-b border-[#3C2F1A]/10">
              <span className="text-3xl font-medium">
                {formatPrice(listing.price)}
              </span>
              <span className="text-sm text-[#787774] ml-1 uppercase tracking-wide">
                / day
              </span>
            </div>

            <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-4">
              Description
            </h4>
            <p className="text-[#3C2F1A] text-sm leading-relaxed mb-10">
              {listing.description}
            </p>

            <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-4">
              Specifications
            </h4>
            <div className="flex flex-wrap gap-2 mb-10">
              {features.map((f) => (
                <span
                  key={f}
                  className="border border-[#3C2F1A]/10 rounded bg-[#FAF7F2] px-3 py-1 text-xs text-[#787774]"
                >
                  {f.trim()}
                </span>
              ))}
            </div>

            {/* Host Bio */}
            <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-4">
              Host
            </h4>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-[#1E1A14] text-[#FEFDFB] flex items-center justify-center text-xs font-medium">
                {listing.hostName
                  .split(" ")
                  .map((n) => n[0])
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
              onClick={() => router.push(`/listing/${listing.id}/book`)}
              className="w-full btn-primary-feorm py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2"
            >
              {listing.type === "stay" ? "Request Stay" : "Rent Machinery"}
              <ArrowRight size={14} />
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
  );
}
