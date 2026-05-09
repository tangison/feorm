"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useFeorm } from "@/context/feorm-context";
import { formatPrice } from "@/components/feorm/listing-card";
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

// ─── Demo Data ────────────────────────────────────────────────
const equipmentUtilization = [
  { name: "Tractor", utilization: 85 },
  { name: "Pump", utilization: 62 },
  { name: "Harrow", utilization: 45 },
  { name: "Drill Rig", utilization: 91 },
  { name: "Solar", utilization: 78 },
  { name: "Harvester", utilization: 55 },
];

const stats = [
  { label: "Active Listings", value: "6", accent: false },
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
    title: "Otjozondjupa Cattle Farm — Stay Request",
    requester: "Pieter Gaseb",
    duration: "5 days",
    amount: 425000,
    type: "stay",
  },
  {
    id: 3,
    title: "Kunene River Camp — Stay Request",
    requester: "Hannes van Wyk",
    duration: "4 days",
    amount: 380000,
    type: "stay",
  },
];

const recentActivity = [
  { action: "Payment received", detail: "Erongo Granite Lodge — N$ 2,400", time: "2h ago" },
  { action: "Booking confirmed", detail: "Kalahari Goat Station — 3 nights", time: "5h ago" },
  { action: "Equipment returned", detail: "Disc Harrow Implement — Condition: Good", time: "1d ago" },
];

export default function DashboardPage() {
  const { user, providerAssets } = useFeorm();

  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[] | null>(null);
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [rewriteResults, setRewriteResults] = useState<
    Array<{ original: string; rewritten: string }> | null
  >(null);

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
        "Your tractor listing could attract 40% more bookings by adding operator-included pricing options",
        "Consider offering weekly rates for the Solar Panel Array — extended rentals are trending in your region",
        "Adding river access photos to your Kunene listing would differentiate it from similar camps",
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
      const demoListings = [
        { title: "Erongo Granite Lodge", description: "A farm stay in the Erongo region", type: "stay", region: "Erongo" },
        { title: "John Deere 5075E Tractor", description: "Reliable tractor for rent in Otjozondjupa", type: "equipment", region: "Otjozondjupa" },
        { title: "5kW Solar Panel Array", description: "Solar power equipment available in Khomas", type: "equipment", region: "Khomas" },
      ];

      const results: Array<{ original: string; rewritten: string }> = [];

      for (const listing of demoListings) {
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
        <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
          Host Dashboard
        </p>
        <h2 className="font-serif-display text-4xl md:text-5xl text-[#1E1A14] mb-3 tracking-tight">
          Welcome back, {user?.name || "Host"}
        </h2>
        <p className="text-sm text-[#787774]">
          Manage your listings, earnings, and pending requests.
        </p>
      </div>

      {/* ─── AI Insights Card ───────────────────────────────── */}
      <section className="mb-10" aria-labelledby="ai-insights-heading">
        <div className="bento-card p-6 border-l-4 border-l-[#E8C96A]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FBF3DB] flex items-center justify-center">
                <Sparkles size={16} className="text-[#956400]" />
              </div>
              <div>
                <h3
                  id="ai-insights-heading"
                  className="text-sm font-medium text-[#1E1A14]"
                >
                  AI Insights
                </h3>
                <p className="text-xs text-[#787774]">
                  Optimization suggestions for your listings
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
                  className="flex items-start gap-3 p-4 rounded-[8px] bg-[#FBF3DB]/30"
                >
                  <ChevronRight
                    size={14}
                    className="text-[#E8C96A] shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-[#1E1A14] leading-relaxed">
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Stats ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bento-card p-5">
            <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#787774] mb-2">
              {s.label}
            </p>
            <p
              className={`font-serif-display text-2xl md:text-3xl ${
                s.accent ? "text-[#346538]" : "text-[#1E1A14]"
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
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-4"
        >
          Revenue — Last 6 Months
        </h3>
        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-serif-display text-2xl text-[#1E1A14]">
                N$ 35,920
              </p>
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#346538] flex items-center gap-1 mt-1">
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
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-4"
        >
          Equipment Utilization
        </h3>
        <div className="bento-card p-6">
          <div className="space-y-4">
            {equipmentUtilization.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#1E1A14] font-medium">
                    {item.name}
                  </span>
                  <span
                    className={`font-mono-feorm text-xs ${
                      item.utilization >= 80
                        ? "text-[#346538]"
                        : item.utilization >= 60
                        ? "text-[#956400]"
                        : "text-[#9F2F2D]"
                    }`}
                  >
                    {item.utilization}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F2EDE2]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.utilization}%`,
                      backgroundColor:
                        item.utilization >= 80
                          ? "#346538"
                          : item.utilization >= 60
                          ? "#E8C96A"
                          : "#9F2F2D",
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
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-6"
        >
          Pending Requests
        </h3>
        <div className="space-y-3">
          {pendingRequests.map((req) => (
            <div
              key={req.id}
              className="bento-card p-5 flex flex-col md:flex-row md:items-center gap-4"
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
                  <span className="font-mono-feorm text-[9px] text-[#787774] uppercase tracking-widest">
                    {req.type === "stay" ? "Stay" : "Equipment"}
                  </span>
                </div>
                <h4 className="font-serif-display text-lg text-[#1E1A14]">
                  {req.title}
                </h4>
                <p className="text-xs text-[#787774] mt-1 font-mono-feorm">
                  Requested by {req.requester} — {req.duration} —{" "}
                  {formatPrice(req.amount)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 text-xs uppercase tracking-widest bg-[#EDF3EC] text-[#346538] rounded-full hover:bg-[#dde9dd] transition-colors active:scale-[0.98] min-h-[44px]"
                  type="button"
                >
                  Accept
                </button>
                <button
                  className="px-4 py-2 text-xs uppercase tracking-widest bg-[#FDEBEC] text-[#9F2F2D] rounded-full hover:bg-[#f5d5d6] transition-colors active:scale-[0.98] min-h-[44px]"
                  type="button"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Recent Activity ────────────────────────────────── */}
      <section className="mb-10" aria-labelledby="activity-heading">
        <h3
          id="activity-heading"
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-6"
        >
          Recent Activity
        </h3>
        <div className="bento-card">
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-5 ${
                i < recentActivity.length - 1
                  ? "border-b border-[#3C2F1A]/5"
                  : ""
              }`}
            >
              <div>
                <p className="text-sm font-medium text-[#1E1A14]">
                  {item.action}
                </p>
                <p className="text-xs text-[#787774] font-mono-feorm">
                  {item.detail}
                </p>
              </div>
              <span className="font-mono-feorm text-[9px] text-[#787774] uppercase tracking-widest">
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
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-4"
        >
          Quick Actions
        </h3>
        <div className="bento-card p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="btn-harvest flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest min-h-[44px]"
              type="button"
              onClick={() => toast({ title: "Add listing flow coming soon" })}
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
              {rewriteLoading ? "Optimizing..." : "AI Optimize Descriptions"}
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
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#787774] mb-3">
                Optimized Titles
              </p>
              {rewriteResults.map((result, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-[6px] bg-[#F2EDE2]/50"
                >
                  <ChevronRight
                    size={12}
                    className="text-[#5C4A2A] shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-[#787774] line-through">
                      {result.original}
                    </p>
                    <p className="text-sm text-[#1E1A14] font-medium">
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
