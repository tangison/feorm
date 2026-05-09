"use client";

import { useState } from "react";
import Link from "next/link";
import { useFeormOnboarding } from "@/context/feorm-context";
import {
  MessageCircle,
  Phone,
  ChevronRight,
  Sparkles,
  Settings,
  Shield,
  Loader2,
} from "lucide-react";

interface Suggestion {
  title: string;
  description: string;
  category: string;
}

export default function SupportPage() {
  const { selectedRole } = useFeormOnboarding();
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Suggestion[] | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleAiHelp = async () => {
    setAiLoading(true);
    setAiError(null);
    setAiSuggestions(null);

    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole || "voyager",
          interests: ["support"],
          region: "Namibia",
        }),
      });

      if (!res.ok) throw new Error("Failed to get suggestions");

      const data = await res.json();
      setAiSuggestions(data.suggestions || []);
    } catch {
      setAiError("Unable to reach AI support. Please try WhatsApp instead.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex-grow w-full max-w-2xl mx-auto px-6 py-12 md:py-24">
      <div className="mb-12">
        <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
          Help
        </p>
        <h2 className="font-serif-display text-4xl md:text-5xl text-[#1E1A14] mb-3 tracking-tight">
          Support Center
        </h2>
        <p className="text-sm text-[#787774]">
          Get help with your Feorm experience.
        </p>
      </div>

      <div className="space-y-4">
        {/* ── WhatsApp Support (prominent) ──────────────────────── */}
        <a
          href="https://wa.me/264853411522?text=Hello%2C%20I%20need%20help%20with%20Feorm."
          target="_blank"
          rel="noopener noreferrer"
          className="bento-card bento-card-lift p-5 flex items-center gap-4 hover:border-[#25D366]/30 transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
            <MessageCircle size={20} className="text-[#25D366]" />
          </div>
          <div className="flex-grow">
            <h3 className="text-sm font-medium text-[#1E1A14]">
              WhatsApp Support
            </h3>
            <p className="text-xs text-[#787774] mb-1">
              Direct line to the Feorm team. Mon–Fri, 08:00–17:00 CAT.
            </p>
            <p className="font-mono-feorm text-[11px] text-[#25D366] font-medium tracking-wide">
              +264 85 341 1522
            </p>
          </div>
          <ChevronRight
            size={16}
            className="text-[#787774] group-hover:translate-x-0.5 transition-transform"
          />
        </a>

        {/* ── Direct Call ───────────────────────────────────────── */}
        <a
          href="tel:+264853411522"
          className="bento-card bento-card-lift p-5 flex items-center gap-4 hover:border-[#1E1A14]/20 transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-[#1E1A14]/5 flex items-center justify-center shrink-0">
            <Phone size={20} className="text-[#1E1A14]" />
          </div>
          <div className="flex-grow">
            <h3 className="text-sm font-medium text-[#1E1A14]">
              Direct Call
            </h3>
            <p className="text-xs text-[#787774]">
              Speak with a Feorm support agent directly.
            </p>
          </div>
          <ChevronRight
            size={16}
            className="text-[#787774] group-hover:translate-x-0.5 transition-transform"
          />
        </a>

        {/* ── FAQ Section ───────────────────────────────────────── */}
        <div className="bento-card p-6">
          <h3 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-5">
            Frequently Asked
          </h3>
          <div className="space-y-0 divide-y divide-[#3C2F1A]/5">
            <div className="py-4 first:pt-0 last:pb-0">
              <h4 className="font-serif-display text-base text-[#1E1A14] mb-1.5">
                How does escrow work?
              </h4>
              <p className="text-xs text-[#787774] leading-relaxed">
                A N$1,500 refundable deposit is held for each equipment rental.
                It&apos;s released once the owner confirms the asset&apos;s
                return condition.
              </p>
            </div>
            <div className="py-4">
              <h4 className="font-serif-display text-base text-[#1E1A14] mb-1.5">
                What if equipment is damaged?
              </h4>
              <p className="text-xs text-[#787774] leading-relaxed">
                The communal insurance fund covers up to N$10,000 in damage. Both
                parties must submit before/after photos within 48 hours.
              </p>
            </div>
            <div className="py-4">
              <h4 className="font-serif-display text-base text-[#1E1A14] mb-1.5">
                How do I get paid as a host?
              </h4>
              <p className="text-xs text-[#787774] leading-relaxed">
                Payouts are processed weekly via bank transfer or MTC Money.
                Minimum payout threshold is N$500.
              </p>
            </div>
            <div className="py-4 first:pt-0 last:pb-0">
              <h4 className="font-serif-display text-base text-[#1E1A14] mb-1.5">
                Can I cancel a booking?
              </h4>
              <p className="text-xs text-[#787774] leading-relaxed">
                Cancellations made 48+ hours before start date receive a full
                refund minus the service fee. Within 48 hours, the escrow
                deposit is forfeited to the host.
              </p>
            </div>
          </div>
        </div>

        {/* ── AI-Powered Support ────────────────────────────────── */}
        <div className="bento-card p-6">
          <h3
            className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-5"
            id="ai-support-heading"
          >
            AI-Powered Help
          </h3>
          <p className="text-xs text-[#787774] mb-4 leading-relaxed">
            Get instant, context-aware assistance powered by Feorm&apos;s
            intelligence engine.
          </p>
          <button
            onClick={handleAiHelp}
            disabled={aiLoading}
            className="btn-primary-feorm flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest min-h-[44px]"
            aria-labelledby="ai-support-heading"
          >
            {aiLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            {aiLoading ? "Thinking..." : "Get AI-Powered Help"}
          </button>

          {/* Loading skeleton */}
          {aiLoading && (
            <div className="mt-4 space-y-3" aria-live="polite" aria-busy="true">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-shimmer rounded-lg h-16" />
              ))}
            </div>
          )}

          {/* Error state */}
          {aiError && (
            <div
              className="mt-4 p-4 rounded-[8px] border border-[#9F2F2D]/20 bg-[#FDEBEC]"
              role="alert"
            >
              <p className="text-xs text-[#9F2F2D]">{aiError}</p>
            </div>
          )}

          {/* AI Suggestions results */}
          {aiSuggestions && aiSuggestions.length > 0 && (
            <div className="mt-4 space-y-3" aria-live="polite">
              <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
                Suggestions
              </p>
              {aiSuggestions.map((s, i) => (
                <div
                  key={i}
                  className="p-4 rounded-[8px] border border-[#E8C96A]/30 bg-[#E8C96A]/5"
                >
                  <h4 className="text-sm font-medium text-[#1E1A14] mb-1">
                    {s.title}
                  </h4>
                  <p className="text-xs text-[#787774] leading-relaxed">
                    {s.description}
                  </p>
                  {s.category && (
                    <span className="inline-block mt-2 font-mono-feorm text-[9px] uppercase tracking-widest text-[#E8C96A] bg-[#1E1A14]/5 px-2 py-0.5 rounded-full">
                      {s.category}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── System Links ──────────────────────────────────────── */}
        <div className="bento-card p-6">
          <h3 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-5">
            System
          </h3>
          <div className="space-y-0 divide-y divide-[#3C2F1A]/5">
            <Link
              href="/settings"
              className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 group"
            >
              <div className="w-9 h-9 rounded-full bg-[#1E1A14]/5 flex items-center justify-center shrink-0">
                <Settings size={16} className="text-[#787774]" />
              </div>
              <div className="flex-grow">
                <h4 className="text-sm font-medium text-[#1E1A14] group-hover:text-[#E8C96A] transition-colors">
                  Account Settings
                </h4>
                <p className="text-xs text-[#787774]">
                  Manage session, downloads, and system reset.
                </p>
              </div>
              <ChevronRight
                size={16}
                className="text-[#787774] group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
            <Link
              href="/verification"
              className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 group"
            >
              <div className="w-9 h-9 rounded-full bg-[#1E1A14]/5 flex items-center justify-center shrink-0">
                <Shield size={16} className="text-[#787774]" />
              </div>
              <div className="flex-grow">
                <h4 className="text-sm font-medium text-[#1E1A14] group-hover:text-[#E8C96A] transition-colors">
                  Verification Center
                </h4>
                <p className="text-xs text-[#787774]">
                  Verify your identity and build trust.
                </p>
              </div>
              <ChevronRight
                size={16}
                className="text-[#787774] group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
