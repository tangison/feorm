"use client";

import { useState } from "react";
import { useFeorm } from "@/context/feorm-context";
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
  const { user } = useFeorm();

  const [idUploaded, setIdUploaded] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTips, setAiTips] = useState<string[] | null>(null);

  const isVerified = user?.verified ?? false;
  const trustScore = 4.8;

  // ─── ID Upload Simulation ──────────────────────────────────
  const handleIdUpload = () => {
    toast({
      title: "ID upload simulated in demo mode",
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
        "Ensure your ID document is clear and all four corners are visible in the scan",
        "Use natural lighting when photographing your ID to avoid glare and shadows",
        "Complete your profile with your full legal name matching your ID for faster verification",
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
        <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
          Trust Layer
        </p>
        <h1 className="font-serif-display text-4xl md:text-5xl text-[#1E1A14] mb-3 tracking-tight">
          Verification Center
        </h1>
        <p className="text-sm text-[#787774]">
          Build trust, unlock benefits, and stand out on the Feorm marketplace.
        </p>
      </div>

      {/* ─── Verification Status Card ────────────────────────── */}
      <section className="mb-10" aria-labelledby="status-heading">
        <h2
          id="status-heading"
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-4"
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
              <span className="font-mono-feorm text-xs text-[#787774]">
                {isVerified ? "Identity confirmed" : "Pending verification"}
              </span>
            </div>
            <ShieldCheck
              size={20}
              className={isVerified ? "text-[#346538]" : "text-[#956400]"}
            />
          </div>

          <div className="flex items-center gap-4 p-4 rounded-[8px] bg-[#F2EDE2]/50">
            <div className="flex items-center gap-2">
              <Star size={14} className="text-[#E8C96A]" />
              <span className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#787774]">
                Trust Score
              </span>
            </div>
            <span className="font-serif-display text-2xl text-[#1E1A14]">
              {trustScore}
            </span>
            <span className="text-xs text-[#787774]">/ 5.0</span>
          </div>
        </div>
      </section>

      {/* ─── ID Upload Section ───────────────────────────────── */}
      <section className="mb-10" aria-labelledby="upload-heading">
        <h2
          id="upload-heading"
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-4"
        >
          Identity Document
        </h2>
        <div className="bento-card p-6">
          {!idUploaded ? (
            <button
              onClick={handleIdUpload}
              className="w-full border-2 border-dashed border-[#3C2F1A]/20 rounded-[8px] p-8 flex flex-col items-center gap-4 hover:border-[#E8C96A] hover:bg-[#FBF3DB]/20 transition-all cursor-pointer min-h-[44px]"
              type="button"
              aria-label="Upload National ID or Passport"
            >
              <div className="w-12 h-12 rounded-full bg-[#F2EDE2] flex items-center justify-center">
                <Upload size={20} className="text-[#5C4A2A]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[#1E1A14] mb-1">
                  Upload National ID / Passport
                </p>
                <p className="text-xs text-[#787774]">
                  Click to upload your identification document
                </p>
              </div>
            </button>
          ) : (
            /* Verification Timeline */
            <div className="space-y-0">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 size={16} className="text-[#346538]" />
                <span className="text-sm font-medium text-[#1E1A14]">
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
                              ? "bg-[#EDF3EC] text-[#346538]"
                              : step.status === "in_progress"
                              ? "bg-[#FBF3DB] text-[#956400] animate-pulse"
                              : "bg-[#F2EDE2] text-[#787774]"
                          }`}
                        >
                          <Icon size={14} />
                        </div>
                        {!isLast && (
                          <div
                            className={`w-px h-8 ${
                              step.status === "completed"
                                ? "bg-[#346538]/30"
                                : "bg-[#3C2F1A]/10"
                            }`}
                          />
                        )}
                      </div>

                      {/* Step content */}
                      <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                        <p
                          className={`text-sm font-medium ${
                            step.status === "completed"
                              ? "text-[#346538]"
                              : step.status === "in_progress"
                              ? "text-[#956400]"
                              : "text-[#787774]"
                          }`}
                        >
                          Step {step.step}: {step.label}
                        </p>
                        <p className="text-xs text-[#787774] mt-0.5">
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
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-4"
        >
          Verification Benefits
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bento-card p-5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#EDF3EC] flex items-center justify-center shrink-0">
              <Award size={14} className="text-[#346538]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1E1A14] mb-1">
                Verified Voyager Badge
              </p>
              <p className="text-xs text-[#787774] leading-relaxed">
                Green trust badge displayed on your profile and listings
              </p>
            </div>
          </div>

          <div className="bento-card p-5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FBF3DB] flex items-center justify-center shrink-0">
              <Zap size={14} className="text-[#956400]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1E1A14] mb-1">
                Priority Booking Access
              </p>
              <p className="text-xs text-[#787774] leading-relaxed">
                Get early access to new listings and high-demand equipment
              </p>
            </div>
          </div>

          <div className="bento-card p-5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F2EDE2] flex items-center justify-center shrink-0">
              <Lock size={14} className="text-[#5C4A2A]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1E1A14] mb-1">
                Higher Escrow Limits
              </p>
              <p className="text-xs text-[#787774] leading-relaxed">
                Unlock increased transaction limits for larger bookings
              </p>
            </div>
          </div>

          <div className="bento-card p-5 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F2EDE2] flex items-center justify-center shrink-0">
              <Eye size={14} className="text-[#5C4A2A]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1E1A14] mb-1">
                Featured in Discovery Feed
              </p>
              <p className="text-xs text-[#787774] leading-relaxed">
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
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-4"
        >
          AI-Powered Verification
        </h2>
        <div className="bento-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-[#FBF3DB] flex items-center justify-center">
              <Sparkles size={16} className="text-[#956400]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1E1A14]">
                Verify Identity with AI
              </p>
              <p className="text-xs text-[#787774]">
                Get personalized tips to speed up your verification
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
            {aiLoading ? "Analyzing..." : "Verify Identity with AI"}
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
            <div className="mt-5 bento-card p-5 bg-[#EDF3EC]/30">
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#346538] mb-4">
                AI Verification Tips
              </p>
              <div className="space-y-3">
                {aiTips.map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-[6px] bg-[#FEFDFB]"
                  >
                    <ChevronRight
                      size={14}
                      className="text-[#346538] shrink-0 mt-0.5"
                    />
                    <p className="text-sm text-[#1E1A14] leading-relaxed">
                      {tip}
                    </p>
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
