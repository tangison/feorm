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
import { SUPPORT_WHATSAPP_URL, SUPPORT_PHONE, SUPPORT_WHATSAPP_NUMBER } from "@/lib/config";

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
        <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          Help
        </p>
        <h1 className="font-serif-display text-4xl md:text-5xl text-earth mb-3 tracking-tight">
          Support Center
        </h1>
        <p className="text-sm text-muted-foreground">
          Get help with your Feorm experience.
        </p>
      </div>

      <div className="space-y-4">
        {/* ── WhatsApp Support (prominent) ──────────────────────── */}
        <a
          href={`${SUPPORT_WHATSAPP_URL}?text=Hello%2C%20I%20need%20help%20with%20Feorm.`}
          target="_blank"
          rel="noopener noreferrer"
          className="bento-card bento-card-lift p-5 flex items-center gap-4 hover:border-whatsapp/30 transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-whatsapp/10 flex items-center justify-center shrink-0">
            <MessageCircle size={20} className="text-whatsapp" />
          </div>
          <div className="flex-grow">
            <h3 className="text-sm font-medium text-earth">
              WhatsApp Support
            </h3>
            <p className="text-xs text-muted-foreground mb-1">
              Direct line to the Feorm team. Mon–Fri, 08:00–17:00 CAT.
            </p>
            <p className="font-mono-feorm text-[11px] text-whatsapp font-medium tracking-wide">
              +{SUPPORT_WHATSAPP_NUMBER.replace(/(\d{3})(\d{2})(\d{3})(\d{4})/, "$1 $2 $3 $4")}
            </p>
          </div>
          <ChevronRight
            size={16}
            className="text-muted-foreground group-hover:translate-x-0.5 transition-transform"
          />
        </a>

        {/* ── Direct Call ───────────────────────────────────────── */}
        <a
          href={`tel:${SUPPORT_PHONE}`}
          className="bento-card bento-card-lift p-5 flex items-center gap-4 hover:border-earth/20 transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-earth/5 flex items-center justify-center shrink-0">
            <Phone size={20} className="text-earth" />
          </div>
          <div className="flex-grow">
            <h3 className="text-sm font-medium text-earth">
              Direct Call
            </h3>
            <p className="text-xs text-muted-foreground">
              Speak with a Feorm support agent directly.
            </p>
          </div>
          <ChevronRight
            size={16}
            className="text-muted-foreground group-hover:translate-x-0.5 transition-transform"
          />
        </a>

        {/* ── FAQ Section ───────────────────────────────────────── */}
        <div className="bento-card p-6">
          <h3 className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-5">
            Frequently Asked
          </h3>
          <div className="space-y-0 divide-y divide-soil/5">
            <div className="py-4 first:pt-0 last:pb-0">
              <h4 className="font-serif-display text-base text-earth mb-1.5">
                How does escrow work?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A N$1,500 refundable deposit is held for each farm stay booking.
                It&apos;s released after your stay is completed successfully.
              </p>
            </div>
            <div className="py-4">
              <h4 className="font-serif-display text-base text-earth mb-1.5">
                What if I need to change my booking?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Contact the host directly via WhatsApp to discuss changes. Modifications
                made 48+ hours before check-in are usually accommodated at no extra cost.
              </p>
            </div>
            <div className="py-4">
              <h4 className="font-serif-display text-base text-earth mb-1.5">
                How do I get paid as a host?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Payouts are processed weekly via bank transfer or MTC Money.
                Minimum payout threshold is N$500.
              </p>
            </div>
            <div className="py-4 first:pt-0 last:pb-0">
              <h4 className="font-serif-display text-base text-earth mb-1.5">
                Can I cancel a booking?
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
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
            className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-5"
            id="ai-support-heading"
          >
            Smart Help
          </h3>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            Get instant answers to common questions about Feorm.
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
            {aiLoading ? "Thinking..." : "Get Smart Help"}
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
              className="mt-4 p-4 rounded-[8px] border border-destructive/20 bg-destructive-bg"
              role="alert"
            >
              <p className="text-xs text-destructive">{aiError}</p>
            </div>
          )}

          {/* AI Suggestions results */}
          {aiSuggestions && aiSuggestions.length > 0 && (
            <div className="mt-4 space-y-3" aria-live="polite">
              <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                Suggestions
              </p>
              {aiSuggestions.map((s, i) => (
                <div
                  key={i}
                  className="p-4 rounded-[8px] border border-harvest/30 bg-harvest/5"
                >
                  <h4 className="text-sm font-medium text-earth mb-1">
                    {s.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {s.description}
                  </p>
                  {s.category && (
                    <span className="inline-block mt-2 font-mono-feorm text-[9px] uppercase tracking-widest text-harvest bg-earth/5 px-2 py-0.5 rounded-full">
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
          <h3 className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-5">
            System
          </h3>
          <div className="space-y-0 divide-y divide-soil/5">
            <Link
              href="/settings"
              className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 group"
            >
              <div className="w-9 h-9 rounded-full bg-earth/5 flex items-center justify-center shrink-0">
                <Settings size={16} className="text-muted-foreground" />
              </div>
              <div className="flex-grow">
                <h4 className="text-sm font-medium text-earth group-hover:text-harvest transition-colors">
                  Account Settings
                </h4>
                <p className="text-xs text-muted-foreground">
                  Manage session, downloads, and system reset.
                </p>
              </div>
              <ChevronRight
                size={16}
                className="text-muted-foreground group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
            <Link
              href="/verification"
              className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 group"
            >
              <div className="w-9 h-9 rounded-full bg-earth/5 flex items-center justify-center shrink-0">
                <Shield size={16} className="text-muted-foreground" />
              </div>
              <div className="flex-grow">
                <h4 className="text-sm font-medium text-earth group-hover:text-harvest transition-colors">
                  Verification Center
                </h4>
                <p className="text-xs text-muted-foreground">
                  Verify your identity and build trust.
                </p>
              </div>
              <ChevronRight
                size={16}
                className="text-muted-foreground group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
