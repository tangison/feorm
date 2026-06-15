"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useListing } from "@/hooks/use-listings";
import { useFeormAuth } from "@/context/feorm-context";
import { formatPrice } from "@/lib/format";
import Image from "next/image";
import { ChevronLeft, MessageCircle, ArrowRight, Sparkles, Star } from "lucide-react";

export default function ListingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: listing, isLoading, notFound } = useListing(params.id);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [rewrittenDesc, setRewrittenDesc] = useState<string | { title?: string; description?: string } | null>(null);
  const [rewriting, setRewriting] = useState(false);

  const [suggestions, setSuggestions] = useState<Array<{ title: string; description: string; category: string }> | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // All images for this listing
  const allImages = listing?.images && listing.images.length > 1
    ? listing.images
    : [listing?.image || "/images/listing-stay-hero.png"];

  const triggerWhatsApp = (title: string, hostPhone: string) => {
    const msg = encodeURIComponent(
      `Hi, I am interested in [${title}] on Feorm. Can you tell me more?`
    );
    const phone = hostPhone.replace(/[^\d]/g, "");
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  const handleRewriteDescription = async () => {
    if (!listing) return;
    setRewriting(true);
    try {
      const res = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: listing.title,
          description: listing.description,
          type: listing.type,
          region: listing.region,
          category: listing.category,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setRewrittenDesc(data.rewritten);
      }
    } catch {
      setRewrittenDesc(listing.description as string);
    }
    setRewriting(false);
  };

  const handleGetSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "voyager",
          interests: ["Farm Stays", "Cultural Exchange"],
          region: listing?.region || "Namibia",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.suggestions);
      }
    } catch {
      // Silent fail
    }
    setLoadingSuggestions(false);
  };

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-harvest animate-pulse" />
          <p className="text-sm text-muted-foreground font-mono-feorm">
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
          <p className="text-sm text-muted-foreground mb-4">Listing not found.</p>
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
      {/* Back button */}
      <button
        onClick={() => router.push("/marketplace")}
        className="mb-6 flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-earth transition-colors min-h-[44px] rounded-full hover:bg-earth/5 font-medium"
      >
        <ChevronLeft size={18} /> Back to Stays
      </button>

      <div className="bento-card overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left: Image Gallery */}
          <div className="w-full lg:w-[55%] bg-fog relative">
            {/* Main Image */}
            <div className="relative h-[40vh] md:h-[50vh] lg:h-[600px] film-grain-overlay">
              <Image
                src={allImages[selectedImageIndex] || "/images/listing-stay-hero.png"}
                alt={`${listing.title} - image ${selectedImageIndex + 1}`}
                width={800}
                height={600}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="w-full h-full object-cover listing-image-filter"
                priority
              />
              {/* Demo Preview Badge */}
              <span className="demo-preview-badge">Demo Preview</span>
              {/* Rating overlay */}
              {listing.rating && (
                <span className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-earth/80 backdrop-blur-sm text-white-feorm text-sm font-semibold px-3 py-1.5 rounded-full z-[4]">
                  <Star size={14} className="text-harvest fill-harvest" />
                  {listing.rating}
                  {listing.reviewCount && (
                    <span className="text-[10px] font-normal text-sand">
                      ({listing.reviewCount} reviews)
                    </span>
                  )}
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="gallery-scroll flex gap-2 p-3 bg-white-feorm border-t border-earth/5">
                {allImages.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImageIndex === i
                        ? "border-harvest shadow-md"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${listing.title} thumbnail ${i + 1}`}
                      width={80}
                      height={56}
                      sizes="80px"
                      className="w-full h-full object-cover listing-image-filter"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="w-full lg:w-[45%] bg-white-feorm p-6 md:p-8 lg:p-10 flex flex-col overflow-y-auto">
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[10px] uppercase font-medium px-3 py-1 rounded-full tag-pastel">
                  {listing.category}
                </span>
                <span className="font-mono-feorm text-[10px] text-muted-foreground uppercase tracking-widest">
                  {listing.region}
                </span>
              </div>

              <h1 className="section-headline font-serif-display text-earth mb-5 leading-[1.1] tracking-tight">
                {listing.title}
              </h1>

              <div className="text-earth mb-8 pb-8 border-b border-earth/5">
                <span className="text-2xl font-medium font-mono-feorm">
                  {formatPrice(listing.price)}
                </span>
                <span className="text-sm text-muted-foreground ml-1 uppercase tracking-wide">
                  / day
                </span>
              </div>

              {/* Description */}
              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                Description
              </h4>
              {rewrittenDesc !== null ? (
                <div className="mb-8">
                  <p className="text-soil text-sm leading-relaxed">
                    {typeof rewrittenDesc === "string"
                      ? rewrittenDesc
                      : rewrittenDesc.description || listing.description}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground">
                      Enhanced
                    </span>
                    <button
                      onClick={() => setRewrittenDesc(null)}
                      className="font-mono-feorm text-[9px] uppercase tracking-widest text-harvest hover:text-earth transition-colors underline underline-offset-2 px-3 py-1.5 rounded-full min-h-[44px]"
                    >
                      Show Original
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-8">
                  <p className="text-soil text-sm leading-relaxed">
                    {listing.description}
                  </p>
                  <button
                    onClick={handleRewriteDescription}
                    disabled={rewriting}
                    className="btn-secondary-feorm flex items-center gap-1.5 mt-3 text-[10px] uppercase tracking-widest px-4 py-2 disabled:opacity-50"
                    aria-label="AI Enhance description"
                  >
                    {rewriting ? (
                      <>
                        <span className="inline-block w-3 h-3 border border-muted-foreground/40 border-t-muted-foreground rounded-full animate-spin" />
                        Enhancing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} />
                        Enhance Description
                      </>
                    )}
                  </button>
                </div>
              )}

              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                Amenities
              </h4>
              <div className="flex flex-wrap gap-2 mb-8">
                {features.map((f: string) => (
                  <span
                    key={f}
                    className="border border-earth/8 rounded-full bg-fog px-3.5 py-1.5 text-xs text-earth font-medium"
                  >
                    {f.trim()}
                  </span>
                ))}
              </div>

              {/* Host */}
              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                Host
              </h4>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-earth text-white-feorm flex items-center justify-center text-sm font-medium font-serif-display">
                  {listing.hostName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-earth">
                    {listing.hostName}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono-feorm">
                    {listing.hostPhone}
                  </p>
                </div>
                <span className="tag-verified text-[10px] uppercase font-semibold px-2.5 py-1">
                  Verified
                </span>
              </div>

              {/* AI Suggestions */}
              <div className="mt-8 pt-8 border-t border-earth/5">
                <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                  Smart Suggestions
                </h4>
                {suggestions === null && !loadingSuggestions && (
                  <button
                    onClick={handleGetSuggestions}
                    className="btn-secondary-feorm flex items-center gap-1.5 text-[10px] uppercase tracking-widest px-4 py-2"
                    aria-label="Get smart suggestions"
                  >
                    <Sparkles size={12} />
                    Get Smart Suggestions
                  </button>
                )}
                {loadingSuggestions && (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="skeleton-shimmer rounded-xl h-16 w-full" />
                    ))}
                  </div>
                )}
                {suggestions !== null && suggestions.length > 0 && (
                  <div className="space-y-3">
                    {suggestions.slice(0, 3).map((s, i) => (
                      <div key={i} className="bento-card p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-earth">
                            {s.title}
                          </span>
                          <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono-feorm border border-earth/8 rounded-full px-2 py-0.5">
                            {s.category}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {s.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-auto pt-6">
              <div className="flex justify-between text-sm mb-4">
                <span className="text-muted-foreground">Security Escrow</span>
                <span className="font-medium font-mono-feorm text-earth">
                  10% (min N$ 500)
                </span>
              </div>
              <button
                onClick={() => router.push(`/listing/${params.id}/book`)}
                className="w-full btn-harvest px-5 py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 min-h-[52px]"
              >
                Request Stay
                <ArrowRight size={14} aria-hidden="true" />
              </button>
              <button
                onClick={() => triggerWhatsApp(listing.title, listing.hostPhone)}
                className="w-full mt-3 border border-whatsapp text-whatsapp px-5 py-3 text-xs uppercase tracking-widest flex justify-center items-center gap-2 rounded-full hover:bg-whatsapp/5 transition-colors min-h-[44px]"
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
