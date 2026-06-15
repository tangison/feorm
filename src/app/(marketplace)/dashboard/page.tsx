"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useFeormAuth, useFeormOnboarding } from "@/context/feorm-context";
import { getDemoListings, getDemoBookings } from "@/lib/demo-data";
import { formatPrice } from "@/lib/format";
import {
  Sparkles,
  RefreshCw,
  Plus,
  Eye,
  ChevronRight,
  TrendingUp,
  Tent,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const RevenueChart = dynamic(
  () => import("@/components/feorm/revenue-chart"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[200px] sm:h-[240px] flex items-center justify-center">
        <div className="skeleton-shimmer w-full h-full rounded-xl" />
      </div>
    ),
  }
);

const stats = [
  { label: "Active Listings", value: "12", accent: false },
  { label: "Earnings Available", value: "N$ 8,420", accent: true },
  { label: "Pending Requests", value: "2", accent: false },
  { label: "Occupancy Rate", value: "67%", accent: false },
];

export default function DashboardPage() {
  const { user } = useFeormAuth();
  const router = useRouter();

  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<Array<{ title: string; description: string; category: string }> | null>(null);
  const [processedRequests, setProcessedRequests] = useState<Set<string>>(new Set());

  const demoListings = getDemoListings();
  const demoBookings = getDemoBookings();

  const fetchAiInsights = useCallback(async () => {
    setAiLoading(true);
    setAiInsights(null);
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "provider",
          region: user?.region || "Namibia",
          interests: ["stay"],
        }),
      });

      if (!res.ok) throw new Error("AI insights failed");

      const data = await res.json();
      setAiInsights(data.suggestions || []);
    } catch {
      setAiInsights([
        { title: "Seasonal Demand Pricing", description: "Adjust your rates for peak and off-peak seasons. Demand in your region typically peaks from March to May.", category: "optimization" },
        { title: "Weekly Rate Opportunity", description: "Consider offering weekly rates — extended stays are trending in your region and attract longer bookings.", category: "optimization" },
        { title: "Photo Differentiation", description: "Adding river access photos to your Kunene listing would differentiate it from similar camps.", category: "optimization" },
      ]);
    } finally {
      setAiLoading(false);
    }
  }, [user?.region]);

  useEffect(() => {
    fetchAiInsights();
  }, [fetchAiInsights]);

  return (
    <div className="flex-grow w-full max-w-4xl mx-auto px-6 py-12 md:py-24">
      {/* Header */}
      <div className="mb-12">
        <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          Host Dashboard
        </p>
        <h1 className="section-headline font-serif-display text-earth mb-3">
          Welcome back, {user?.name || "Host"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your listings, earnings, and pending requests.
        </p>
      </div>

      {/* AI Insights Card */}
      <section className="mb-10" aria-labelledby="ai-insights-heading">
        <div className="bento-card p-6 border-l-4 border-l-harvest">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Sparkles size={18} className="text-accent-foreground" />
              </div>
              <div>
                <h3 id="ai-insights-heading" className="font-serif-display text-lg text-earth">
                  Listing tips
                </h3>
                <p className="text-xs text-muted-foreground">
                  Suggestions to help you get more bookings
                </p>
              </div>
            </div>
            <button
              onClick={fetchAiInsights}
              disabled={aiLoading}
              className="btn-secondary-feorm flex items-center gap-2 px-4 py-2 text-[9px] uppercase tracking-widest min-h-[44px] disabled:opacity-50"
              type="button"
              aria-label="Refresh AI insights"
            >
              <RefreshCw size={12} className={aiLoading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {aiLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-shimmer h-14 rounded-xl" />
              ))}
            </div>
          )}

          {aiInsights && !aiLoading && (
            <div className="space-y-3">
              {aiInsights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-accent/30">
                  <ChevronRight size={14} className="text-harvest shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-earth leading-relaxed">
                        {insight.title}
                      </p>
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono-feorm border border-earth/8 rounded-full px-2 py-0.5 shrink-0">
                        {insight.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bento-card p-6">
            <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground mb-2">
              {s.label}
            </p>
            <p className={`font-mono-feorm text-2xl md:text-3xl ${s.accent ? "text-verified" : "text-earth"}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <section className="mb-10" aria-labelledby="revenue-heading">
        <h3 id="revenue-heading" className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
          Revenue — Last 6 Months
        </h3>
        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-mono-feorm text-2xl text-earth">N$ 35,920</p>
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-verified flex items-center gap-1 mt-1">
                <TrendingUp size={10} />
                +18.4% vs prior period
              </p>
            </div>
          </div>
          <div className="w-full h-[200px] sm:h-[240px]">
            <RevenueChart />
          </div>
        </div>
      </section>

      {/* My Listings */}
      <section className="mb-10" aria-labelledby="my-listings-heading">
        <div className="flex items-center justify-between mb-4">
          <h3 id="my-listings-heading" className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground">
            My Listings
          </h3>
          <button
            onClick={() => router.push("/listing/new")}
            className="btn-harvest flex items-center gap-2 px-4 py-2 text-[9px] uppercase tracking-widest min-h-[44px]"
          >
            <Plus size={12} />
            Add Listing
          </button>
        </div>
        <div className="space-y-3">
          {demoListings.slice(0, 4).map((listing) => (
            <div key={listing.id} className="bento-card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-fog shrink-0">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover listing-image-filter"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-earth truncate">{listing.title}</p>
                <p className="text-xs text-muted-foreground font-mono-feorm">{listing.region}</p>
              </div>
              <span className="tag-verified text-[9px] uppercase font-semibold px-2.5 py-1">Active</span>
              <span className="text-sm font-mono-feorm text-earth font-medium">{formatPrice(listing.price)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pending Requests */}
      <section className="mb-10" aria-labelledby="pending-heading">
        <h3 id="pending-heading" className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
          Pending Requests
        </h3>
        <div className="space-y-3">
          {demoBookings.filter((b) => b.status === "pending").map((req) => (
            <div key={req.id} className="bento-card p-6 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[9px] uppercase font-semibold px-2 py-0.5 rounded-full tracking-wider tag-pastel">
                    Pending
                  </span>
                  <span className="font-mono-feorm text-[9px] text-muted-foreground uppercase tracking-widest">Stay</span>
                </div>
                <h4 className="font-serif-display text-lg text-earth">{req.listingTitle}</h4>
                <p className="text-xs text-muted-foreground mt-1 font-mono-feorm">
                  Requested by {req.guestName} — {req.startDate} to {req.endDate}
                </p>
              </div>
              <div className="flex gap-2">
                {processedRequests.has(req.id) ? (
                  <span className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground px-4 py-2">Processed</span>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setProcessedRequests((prev) => new Set(prev).add(req.id));
                        toast({ title: `Accepted: ${req.listingTitle}` });
                      }}
                      className="px-4 py-2 text-xs uppercase tracking-widest bg-verified-bg text-verified rounded-full hover:bg-verified-hover transition-colors active:scale-[0.98] min-h-[44px] flex items-center gap-1.5"
                      type="button"
                    >
                      <CheckCircle2 size={14} />
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        setProcessedRequests((prev) => new Set(prev).add(req.id));
                        toast({ title: `Declined: ${req.listingTitle}` });
                      }}
                      className="px-4 py-2 text-xs uppercase tracking-widest bg-destructive-bg text-destructive rounded-full hover:bg-destructive-hover transition-colors active:scale-[0.98] min-h-[44px] flex items-center gap-1.5"
                      type="button"
                    >
                      <XCircle size={14} />
                      Decline
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section aria-labelledby="actions-heading">
        <h3 id="actions-heading" className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
          Quick Actions
        </h3>
        <div className="bento-card p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="btn-harvest flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest min-h-[44px]"
              type="button"
              onClick={() => router.push("/listing/new")}
            >
              <Plus size={14} />
              Add New Listing
            </button>
            <button
              className="btn-secondary-feorm flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest min-h-[44px]"
              type="button"
              onClick={() => toast({ title: "Earnings breakdown coming soon" })}
            >
              <Eye size={14} />
              View Earnings
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
