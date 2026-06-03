"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useFeormAuth, useFeormOnboarding } from "@/context/feorm-context";
import { formatPrice } from "@/lib/format";
import {
  Sparkles,
  RefreshCw,
  Plus,
  Eye,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Dynamic import recharts component to avoid SSR issues with React 19
const RevenueChart = dynamic(
  () => import("@/components/feorm/revenue-chart"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[200px] sm:h-[240px] flex items-center justify-center">
        <div className="skeleton-shimmer w-full h-full rounded-[8px]" />
      </div>
    ),
  }
);

// ─── Placeholder Data ──────────────────────────────────────────
// REVIEW: Replace with Supabase queries when dashboard is wired up
// Table: listings (for utilization), bookings (for stats/requests/activity)
const equipmentUtilization = [
  { name: "Tractor", utilization: 85 },
  { name: "Pump", utilization: 62 },
  { name: "Harrow", utilization: 45 },
  { name: "Drill Rig", utilization: 91 },
  { name: "Solar", utilization: 78 },
  { name: "Harvester", utilization: 55 },
];

const stats = [
  { label: "Active Listings", value: "14", accent: false },
  { label: "Earnings Available", value: "N$ 8,420", accent: true },
  { label: "Pending Requests", value: "3", accent: false },
  { label: "Occupancy Rate", value: "67%", accent: false },
];

const pendingRequests = [
  {
    id: 1,
    title: "John Deere 5075E — Rental Request",
    requester: "Anna //Khaoes",
    duration: "3 days",
    amount: 475000,
    type: "equipment",
  },
  {
    id: 2,
    title: "Otjozondjupa Bushveld Station — Stay Request",
    requester: "Pieter Gaseb",
    duration: "5 days",
    amount: 425000,
    type: "stay",
  },
  {
    id: 3,
    title: "Kunene Desert Pasture Camp — Stay Request",
    requester: "Hannes van Wyk",
    duration: "4 days",
    amount: 380000,
    type: "stay",
  },
];

const recentActivity = [
  { action: "Payment received", detail: "Erongo Granite Lodge — N$ 2,400", time: "2h ago" },
  { action: "Booking confirmed", detail: "Hardap Kalahari Goat Station — 3 nights", time: "5h ago" },
  { action: "Equipment returned", detail: "Disc Harrow Implement — Condition: Good", time: "1d ago" },
];

export default function DashboardPage() {
  const { user } = useFeormAuth();
  const { providerAssets } = useFeormOnboarding();
  const router = useRouter();

  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<Array<{ title: string; description: string; category: string }> | null>(null);
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [rewriteResults, setRewriteResults] = useState<
    Array<{ original: string; rewritten: string }> | null
  >(null);
  const [processedRequests, setProcessedRequests] = useState<Set<number>>(new Set());

  // ─── AI Insights ──────────────────────────────────────────
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
          interests: providerAssets || ["stay", "equipment"],
        }),
      });

      if (!res.ok) throw new Error("AI insights failed");

      const data = await res.json();
      setAiInsights(data.suggestions || []);
    } catch {
      setAiInsights([
        { title: "Add Operator Pricing", description: "Your tractor listing could attract 40% more bookings by adding operator-included pricing options.", category: "optimization" },
        { title: "Weekly Rate Opportunity", description: "Consider offering weekly rates for the Solar Panel Array — extended rentals are trending in your region.", category: "optimization" },
        { title: "Photo Differentiation", description: "Adding river access photos to your Kunene listing would differentiate it from similar camps.", category: "optimization" },
      ]);
    } finally {
      setAiLoading(false);
    }
  }, [user?.region, providerAssets]);

  useEffect(() => {
    fetchAiInsights();
  }, [fetchAiInsights]);

  // ─── AI Optimize Descriptions ─────────────────────────────
  const handleAiRewrite = async () => {
    setRewriteLoading(true);
    setRewriteResults(null);
    try {
      // REVIEW: Replace with user's actual listings from Supabase
      const sampleListings = [
        { title: "Erongo Granite Lodge", description: "A farm stay in the Erongo region", type: "stay", region: "Erongo" },
        { title: "John Deere 5075E Tractor", description: "Reliable tractor for rent in Otjozondjupa", type: "equipment", region: "Otjozondjupa" },
        { title: "5kW Solar Panel Array", description: "Solar power equipment available in Khomas", type: "equipment", region: "Khomas" },
      ];

      const results: Array<{ original: string; rewritten: string }> = [];

      for (const listing of sampleListings) {
        try {
          const res = await fetch("/api/ai/rewrite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(listing),
          });

          if (res.ok) {
            const data = await res.json();
            results.push({
              original: listing.title,
              rewritten: data.rewritten?.title || listing.title,
            });
          } else {
            results.push({
              original: listing.title,
              rewritten: `${listing.title} — Premium Experience`,
            });
          }
        } catch {
          results.push({
            original: listing.title,
            rewritten: `${listing.title} — Premium Experience`,
          });
        }
      }

      setRewriteResults(results);
      toast({ title: "Descriptions optimized" });
    } catch {
      toast({ title: "Optimization failed", description: "Please try again" });
    } finally {
      setRewriteLoading(false);
    }
  };

  return (
    <div className="flex-grow w-full max-w-4xl mx-auto px-6 py-12 md:py-24">
      {/* Header */}
      <div className="mb-12">
        <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          Host Dashboard
        </p>
        <h1 className="font-serif-display text-4xl md:text-5xl text-earth mb-3 tracking-tight">
          Welcome back, {user?.name || "Host"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your listings, earnings, and pending requests.
        </p>
      </div>

      {/* ─── AI Insights Card ───────────────────────────────── */}
      <section className="mb-10" aria-labelledby="ai-insights-heading">
        <div className="bento-card p-6 border-l-4 border-l-harvest">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
                <Sparkles size={16} className="text-accent-foreground" />
              </div>
              <div>
                <h3
                  id="ai-insights-heading"
                  className="font-serif-display text-lg text-earth"
                >
                  Listing Tips
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
                <div key={i} className="skeleton-shimmer h-14 rounded-[8px]" />
              ))}
            </div>
          )}

          {aiInsights && !aiLoading && (
            <div className="space-y-3">
              {aiInsights.map((insight, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-[8px] bg-accent/30"
                >
                  <ChevronRight
                    size={14}
                    className="text-harvest shrink-0 mt-0.5"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-earth leading-relaxed">
                        {insight.title}
                      </p>
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono-feorm border border-soil/10 rounded-full px-2 py-0.5 shrink-0">
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

      {/* ─── Stats ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bento-card p-6">
            <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground mb-2">
              {s.label}
            </p>
            <p
              className={`font-mono-feorm text-2xl md:text-3xl ${
                s.accent ? "text-verified" : "text-earth"
              }`}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* ─── Revenue Chart ──────────────────────────────────── */}
      <section className="mb-10" aria-labelledby="revenue-heading">
        <h3
          id="revenue-heading"
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-4"
        >
          Revenue — Last 6 Months
        </h3>
        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-mono-feorm text-2xl text-earth">
                N$ 35,920
              </p>
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

      {/* ─── Equipment Utilization ──────────────────────────── */}
      <section className="mb-10" aria-labelledby="utilization-heading">
        <h3
          id="utilization-heading"
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-4"
        >
          Equipment Utilization
        </h3>
        <div className="bento-card p-6">
          <div className="space-y-4">
            {equipmentUtilization.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-earth font-medium">
                    {item.name}
                  </span>
                  <span
                    className={`font-mono-feorm text-xs ${
                      item.utilization >= 80
                        ? "text-verified"
                        : item.utilization >= 60
                        ? "text-accent-foreground"
                        : "text-destructive"
                    }`}
                  >
                    {item.utilization}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-cream">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.utilization}%`,
                      backgroundColor:
                        item.utilization >= 80
                          ? "var(--color-verified)"
                          : item.utilization >= 60
                          ? "var(--color-harvest)"
                          : "var(--destructive)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pending Requests ───────────────────────────────── */}
      <section className="mb-10" aria-labelledby="pending-heading">
        <h3
          id="pending-heading"
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-4"
        >
          Pending Requests
        </h3>
        <div className="space-y-3">
          {pendingRequests.map((req) => (
            <div
              key={req.id}
              className="bento-card bento-card-lift p-6 flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-[9px] uppercase font-semibold px-2 py-0.5 rounded-full tracking-wider ${
                      req.type === "stay" ? "tag-pastel" : "tag-machinery"
                    }`}
                  >
                    Pending
                  </span>
                  <span className="font-mono-feorm text-[9px] text-muted-foreground uppercase tracking-widest">
                    {req.type === "stay" ? "Stay" : "Equipment"}
                  </span>
                </div>
                <h4 className="font-serif-display text-lg text-earth">
                  {req.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 font-mono-feorm">
                  Requested by {req.requester} — {req.duration} —{" "}
                  {formatPrice(req.amount)}
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
                        toast({ title: `Accepted: ${req.title}` });
                      }}
                      className="px-4 py-2 text-xs uppercase tracking-widest bg-verified-bg text-verified rounded-full hover:bg-verified-hover transition-colors active:scale-[0.98] min-h-[44px]"
                      type="button"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        setProcessedRequests((prev) => new Set(prev).add(req.id));
                        toast({ title: `Declined: ${req.title}` });
                      }}
                      className="px-4 py-2 text-xs uppercase tracking-widest bg-destructive-bg text-destructive rounded-full hover:bg-destructive-hover transition-colors active:scale-[0.98] min-h-[44px]"
                      type="button"
                    >
                      Decline
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Recent Activity ────────────────────────────────── */}
      <section className="mb-10" aria-labelledby="activity-heading">
        <h3
          id="activity-heading"
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-4"
        >
          Recent Activity
        </h3>
        <div className="bento-card">
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-6 ${
                i < recentActivity.length - 1
                  ? "border-b border-soil/5"
                  : ""
              }`}
            >
              <div>
                <p className="text-sm font-medium text-earth">
                  {item.action}
                </p>
                <p className="text-xs text-muted-foreground font-mono-feorm">
                  {item.detail}
                </p>
              </div>
              <span className="font-mono-feorm text-[9px] text-muted-foreground uppercase tracking-widest">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Quick Actions ──────────────────────────────────── */}
      <section aria-labelledby="actions-heading">
        <h3
          id="actions-heading"
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-4"
        >
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
            <button
              onClick={handleAiRewrite}
              disabled={rewriteLoading}
              className="btn-primary-feorm flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest min-h-[44px] disabled:opacity-50"
              type="button"
            >
              <Sparkles size={14} />
              {rewriteLoading ? "Optimizing..." : "Improve My Descriptions"}
            </button>
          </div>

          {/* Rewrite Results */}
          {rewriteLoading && (
            <div className="mt-5 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="skeleton-shimmer h-12 rounded-[8px]"
                />
              ))}
            </div>
          )}

          {rewriteResults && !rewriteLoading && (
            <div className="mt-5 space-y-3">
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground mb-3">
                Optimized Titles
              </p>
              {rewriteResults.map((result, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-[6px] bg-cream/50"
                >
                  <ChevronRight
                    size={12}
                    className="text-bark shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground line-through">
                      {result.original}
                    </p>
                    <p className="text-sm text-earth font-medium">
                      {result.rewritten}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
