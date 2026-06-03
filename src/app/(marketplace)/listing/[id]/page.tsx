"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useListing } from "@/hooks/use-listings";
import { formatPrice } from "@/lib/format";
import Image from "next/image";
import { ChevronLeft, MessageCircle, ArrowRight, Sparkles } from "lucide-react";

export default function ListingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { data: listing, isLoading, notFound } = useListing(params.id);

  // AI Description Rewrite state
  const [rewrittenDesc, setRewrittenDesc] = useState<string | { title?: string; description?: string } | null>(null);
  const [rewriting, setRewriting] = useState(false);

  // AI Smart Suggest state
  const [suggestions, setSuggestions] = useState<Array<{ title: string; description: string; category: string }> | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const triggerWhatsApp = (title: string, hostPhone: string) => {
    const msg = encodeURIComponent(
      `Hi, I'm interested in [${title}] on Feorm. Can you tell me more?`
    );
    // Use host's actual phone number, stripped of non-digits and leading +
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
      // Fallback: just show the original
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
          interests: listing?.type === "stay" ? ["Farm Stays", "Cultural Exchange"] : ["Equipment", "Machinery"],
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
    <div className="flex-grow w-full max-w-6xl mx-auto px-6 py-6 md:py-12">
      <div className="bg-white-feorm border border-soil/10 rounded-[8px] overflow-hidden md:min-h-[600px]">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left: Image */}
          <div className="w-full md:w-1/2 bg-fog relative h-[35vh] md:h-auto border-b md:border-b-0 md:border-r border-soil/10">
            <Image
              src={listing.image || (listing.type === "stay" ? "/images/listing-stay-hero.png" : "/images/listing-equip-hero.png")}
              alt={listing.title}
              width={600}
              height={450}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-full object-cover opacity-90 p-2 md:p-4"
              loading="lazy"
            />
            <button
              onClick={() => router.push("/marketplace")}
              className="absolute top-4 left-4 md:top-8 md:left-8 bg-white-feorm/90 backdrop-blur-sm border border-soil/10 p-2 rounded-full text-earth hover:bg-white-feorm transition-colors shadow-sm"
              aria-label="Back to marketplace"
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          {/* Right: Details */}
          <div className="w-full md:w-1/2 bg-white-feorm p-6 md:p-12 flex flex-col overflow-y-auto">
            <div className="flex-grow max-w-md">
              <div className="flex items-center gap-3 mb-5">
                <span
                  className={`text-[10px] uppercase font-medium px-2.5 py-1 rounded-full ${
                    listing.type === "stay" ? "tag-pastel" : "tag-machinery"
                  }`}
                >
                  {listing.category}
                </span>
                <span className="font-mono-feorm text-[10px] text-muted-foreground uppercase tracking-widest">
                  {listing.region}
                </span>
              </div>

              <h1 className="font-serif-display text-3xl md:text-4xl mb-5 text-earth leading-[1.1] tracking-tight">
                {listing.title}
              </h1>

              <div className="text-earth mb-8 pb-8 border-b border-soil/10">
                <span className="text-2xl font-medium font-mono-feorm">
                  {formatPrice(listing.price)}
                </span>
                <span className="text-sm text-muted-foreground ml-1 uppercase tracking-wide">
                  / day
                </span>
              </div>

              {/* Description with AI Enhance */}
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
                  {typeof rewrittenDesc === "object" && rewrittenDesc.title && (
                    <p className="text-bark text-sm font-medium mt-2">
                      {rewrittenDesc.title}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground">
                      Enhanced
                    </span>
                    <button
                      onClick={() => setRewrittenDesc(null)}
                      className="font-mono-feorm text-[9px] uppercase tracking-widest text-harvest hover:text-earth transition-colors underline underline-offset-2 px-2 py-1 rounded-full min-h-[36px]"
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
                    className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-earth font-mono-feorm flex items-center gap-1 mt-2 transition-colors disabled:opacity-50 rounded-full px-3 py-1.5 border border-soil/10 bg-fog hover:border-soil/30 min-h-[36px]"
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
                Specifications
              </h4>
              <div className="flex flex-wrap gap-2 mb-8">
                {features.map((f: string) => (
                  <span
                    key={f}
                    className="border border-soil/10 rounded-full bg-fog px-3 py-1 text-xs text-muted-foreground"
                  >
                    {f.trim()}
                  </span>
                ))}
              </div>

              {/* Host Bio */}
              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                Host
              </h4>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-earth text-white-feorm flex items-center justify-center text-xs font-medium font-serif-display">
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
                <span className="tag-verified text-[10px] uppercase font-medium px-2.5 py-1">
                  Verified
                </span>
              </div>

              {/* AI Recommendations */}
              <div className="mt-8 pt-8 border-t border-soil/10">
                <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                  Smart Suggestions
                </h4>
                {suggestions === null && !loadingSuggestions && (
                  <button
                    onClick={handleGetSuggestions}
                    className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-earth font-mono-feorm flex items-center gap-1 transition-colors border border-soil/10 rounded-full px-3 py-1.5 hover:border-soil/30"
                    aria-label="Get smart suggestions"
                  >
                    <Sparkles size={12} />
                    Get Smart Suggestions
                  </button>
                )}
                {loadingSuggestions && (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="skeleton-shimmer rounded-lg h-16 w-full"
                      />
                    ))}
                  </div>
                )}
                {suggestions !== null && suggestions.length > 0 && (
                  <div className="space-y-3">
                    {suggestions.slice(0, 3).map((s, i) => (
                      <div
                        key={i}
                        className="border border-soil/10 rounded-[8px] p-3 bg-fog"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-earth">
                            {s.title}
                          </span>
                          <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono-feorm border border-soil/10 rounded-full px-2 py-0.5">
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

            <div className="mt-auto pt-6 bg-white-feorm">
              <div className="flex justify-between text-sm mb-4">
                <span className="text-muted-foreground">Security Escrow</span>
                <span className="font-medium font-mono-feorm text-earth">
                  10% (min N$ 500)
                </span>
              </div>
              <button
                onClick={() => router.push(`/listing/${params.id}/book`)}
                className="w-full btn-harvest px-5 py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 min-h-[44px]"
              >
                {listing.type === "stay" ? "Request Stay" : "Rent Machinery"}
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
