"use client";

import { useState } from "react";
import { useFeormAuth } from "@/context/feorm-context";
import {
  ShieldCheck,
  Upload,
  CheckCircle2,
  Clock,
  Lock,
  Star,
  Eye,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function VerificationPage() {
  const { user } = useFeormAuth();

  const [idUploaded, setIdUploaded] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTips, setAiTips] = useState<Array<{ title: string; description: string; category: string }> | null>(null);

  const isVerified = user?.verified ?? false;
  const trustScore = 4.8;

  // ─── ID Upload Simulation ──────────────────────────────────
  const handleIdUpload = () => {
    toast({
      title: "ID upload simulated",
      description: "In production, this would upload your National ID or Passport for verification.",
    });
    setIdUploaded(true);
  };

  // ─── AI Verification Tips ──────────────────────────────────
  const handleAiVerify = async () => {
    setAiLoading(true);
    setAiTips(null);
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: "verification" }),
      });

      if (!res.ok) throw new Error("AI request failed");

      const data = await res.json();
      setAiTips(data.suggestions || []);
    } catch {
      setAiTips([
        { title: "Clear Document Scan", description: "Ensure your ID document is clear and all four corners are visible in the scan.", category: "optimization" },
        { title: "Natural Lighting", description: "Use natural lighting when photographing your ID to avoid glare and shadows.", category: "optimization" },
        { title: "Match Legal Name", description: "Complete your profile with your full legal name matching your ID for faster verification.", category: "optimization" },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  // ─── Verification Timeline Steps ───────────────────────────
  const timelineSteps = [
    {
      step: 1,
      label: "Document Submitted",
      status: "completed" as const,
      icon: CheckCircle2,
    },
    {
      step: 2,
      label: "AI Verification",
      status: "in_progress" as const,
      icon: Clock,
    },
    {
      step: 3,
      label: "Trust Badge Awarded",
      status: "pending" as const,
      icon: Award,
    },
  ];

  return (
    <div className="flex-grow w-full max-w-2xl mx-auto px-6 py-12 md:py-24">
      {/* Header */}
      <div className="mb-12">
        <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          Trust Layer
        </p>
        <h1 className="font-serif-display text-4xl md:text-5xl text-earth mb-3 tracking-tight">
          Verification Center
        </h1>
        <p className="text-sm text-muted-foreground">
          Build trust, unlock benefits, and stand out on the Feorm marketplace.
        </p>
      </div>

      {/* ─── Verification Status Card ────────────────────────── */}
      <section className="mb-10" aria-labelledby="status-heading">
        <h2
          id="status-heading"
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-4"
        >
          Verification Status
        </h2>
        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              {isVerified ? (
                <span className="tag-verified text-[9px] uppercase font-semibold px-3 py-1 tracking-wider">
                  Verified
                </span>
              ) : (
                <span className="tag-pastel text-[9px] uppercase font-semibold px-3 py-1 tracking-wider">
                  Unverified
                </span>
              )}
              <span className="font-mono-feorm text-xs text-muted-foreground">
                {isVerified ? "Identity confirmed" : "Pending verification"}
              </span>
            </div>
            <ShieldCheck
              size={20}
              className={isVerified ? "text-verified" : "text-accent-foreground"}
            />
          </div>

          <div className="flex items-center gap-4 p-4 rounded-[8px] bg-cream/50">
            <div className="flex items-center gap-2">
              <Star size={14} className="text-harvest" />
              <span className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground">
                Trust Score
              </span>
            </div>
            <span className="font-mono-feorm text-2xl text-earth">
              {trustScore}
            </span>
            <span className="text-xs text-muted-foreground">/ 5.0</span>
          </div>
        </div>
      </section>

      {/* ─── ID Upload Section ───────────────────────────────── */}
      <section className="mb-10" aria-labelledby="upload-heading">
        <h2
          id="upload-heading"
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-4"
        >
          Identity Document
        </h2>
        <div className="bento-card p-6">
          {!idUploaded ? (
            <button
              onClick={handleIdUpload}
              className="w-full border-2 border-dashed border-soil/20 rounded-[8px] p-8 flex flex-col items-center gap-4 hover:border-harvest hover:bg-accent/20 transition-all cursor-pointer min-h-[44px]"
              type="button"
              aria-label="Upload National ID or Passport"
            >
              <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center">
                <Upload size={20} className="text-bark" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-earth mb-1">
                  Upload National ID / Passport
                </p>
                <p className="text-xs text-muted-foreground">
                  Click to upload your identification document
                </p>
              </div>
            </button>
          ) : (
            /* Verification Timeline */
            <div className="space-y-0">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 size={16} className="text-verified" />
                <span className="text-sm font-medium text-earth">
                  Document uploaded successfully
                </span>
              </div>

              <div className="space-y-0">
                {timelineSteps.map((step, i) => {
                  const Icon = step.icon;
                  const isLast = i === timelineSteps.length - 1;
                  return (
                    <div key={step.step} className="flex gap-4">
                      {/* Timeline rail */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            step.status === "completed"
                              ? "bg-verified-bg text-verified"
                              : step.status === "in_progress"
                              ? "bg-accent text-accent-foreground animate-pulse"
                              : "bg-cream text-muted-foreground"
                          }`}
                        >
                          <Icon size={14} />
                        </div>
                        {!isLast && (
                          <div
                            className={`w-px h-8 ${
                              step.status === "completed"
                                ? "bg-verified/30"
                                : "bg-soil/10"
                            }`}
                          />
                        )}
                      </div>

                      {/* Step content */}
                      <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                        <p
                          className={`text-sm font-medium ${
                            step.status === "completed"
                              ? "text-verified"
                              : step.status === "in_progress"
                              ? "text-accent-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          Step {step.step}: {step.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {step.status === "completed"
                            ? "Complete"
                            : step.status === "in_progress"
                            ? "In progress..."
                            : "Pending"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Verification Benefits ───────────────────────────── */}
      <section className="mb-10" aria-labelledby="benefits-heading">
        <h2
          id="benefits-heading"
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-4"
        >
          Verification Benefits
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bento-card p-6 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-verified-bg flex items-center justify-center shrink-0">
              <Award size={14} className="text-verified" />
            </div>
            <div>
              <p className="text-sm font-medium text-earth mb-1">
                Verified Voyager Badge
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Green trust badge displayed on your profile and listings
              </p>
            </div>
          </div>

          <div className="bento-card p-6 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0">
              <Zap size={14} className="text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-earth mb-1">
                Priority Booking Access
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Get early access to new listings and high-demand equipment
              </p>
            </div>
          </div>

          <div className="bento-card p-6 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center shrink-0">
              <Lock size={14} className="text-bark" />
            </div>
            <div>
              <p className="text-sm font-medium text-earth mb-1">
                Higher Escrow Limits
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Unlock increased transaction limits for larger bookings
              </p>
            </div>
          </div>

          <div className="bento-card p-6 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center shrink-0">
              <Eye size={14} className="text-bark" />
            </div>
            <div>
              <p className="text-sm font-medium text-earth mb-1">
                Featured in Discovery Feed
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your listings appear prominently in search and recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── AI-Powered Section ──────────────────────────────── */}
      <section aria-labelledby="ai-verify-heading">
        <h2
          id="ai-verify-heading"
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-4"
        >
          Smart Verification
        </h2>
        <div className="bento-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
              <Sparkles size={16} className="text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-earth">
                Speed Up Your Verification
              </p>
              <p className="text-xs text-muted-foreground">
                Get personalized tips to verify faster
              </p>
            </div>
          </div>

          <button
            onClick={handleAiVerify}
            disabled={aiLoading}
            className="btn-harvest flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest min-h-[44px] disabled:opacity-50"
            type="button"
          >
            <Sparkles size={14} />
            {aiLoading ? "Analyzing..." : "Get Verification Tips"}
          </button>

          {/* AI Tips */}
          {aiLoading && (
            <div className="mt-5 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="skeleton-shimmer h-12 rounded-[8px]"
                />
              ))}
            </div>
          )}

          {aiTips && !aiLoading && (
            <div className="mt-5 bento-card p-6 bg-verified-bg/30">
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-verified mb-4">
                Verification Tips
              </p>
              <div className="space-y-3">
                {aiTips.map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-[6px] bg-white-feorm"
                  >
                    <ChevronRight
                      size={14}
                      className="text-verified shrink-0 mt-0.5"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-earth leading-relaxed">
                          {tip.title}
                        </p>
                        <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono-feorm border border-soil/10 rounded-full px-2 py-0.5 shrink-0">
                          {tip.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
