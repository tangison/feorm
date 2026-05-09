"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFeorm } from "@/context/feorm-context";
import {
  Shield,
  Download,
  FileJson,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  Info,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const router = useRouter();
  const {
    user,
    phone,
    selectedRole,
    interests,
    avatarUrl,
    hasCompletedOnboarding,
    providerAssets,
    setHasCompletedOnboarding,
  } = useFeorm();

  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[] | null>(null);
  const [brandLoading, setBrandLoading] = useState(false);

  // ─── Session Management ─────────────────────────────────────
  const handleClearSession = () => {
    localStorage.removeItem("feorm-session");
    router.push("/");
  };

  // ─── Download Brand Identity ────────────────────────────────
  const handleDownloadBrand = async () => {
    setBrandLoading(true);
    try {
      const res = await fetch("/api/brand-identity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user?.name || "",
          surname: user?.surname || "",
          role: selectedRole || "voyager",
          region: user?.region || "",
          interests: interests || [],
          avatarUrl: avatarUrl || "",
        }),
      });

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "feorm-brand-identity.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({ title: "Brand identity downloaded" });
    } catch {
      toast({ title: "Download failed", description: "Please try again" });
    } finally {
      setBrandLoading(false);
    }
  };

  // ─── Export Data ────────────────────────────────────────────
  const handleExportData = () => {
    const sessionData = {
      user,
      phone,
      selectedRole,
      interests,
      avatarUrl,
      hasCompletedOnboarding,
      providerAssets,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(sessionData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feorm-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ title: "Data exported successfully" });
  };

  // ─── Reset Onboarding ──────────────────────────────────────
  const handleResetOnboarding = () => {
    setHasCompletedOnboarding(false);
    router.push("/");
  };

  // ─── Full System Reset ─────────────────────────────────────
  const handleFullReset = () => {
    localStorage.clear();
    router.push("/");
  };

  // ─── AI Smart Profile Enhancement ──────────────────────────
  const handleAiSuggest = async () => {
    setAiLoading(true);
    setAiSuggestions(null);
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole || "voyager",
          region: user?.region || "Namibia",
          interests: interests || [],
          context: "profile",
        }),
      });

      if (!res.ok) throw new Error("AI suggestion failed");

      const data = await res.json();
      setAiSuggestions(data.suggestions || []);
    } catch {
      setAiSuggestions([
        "Optimize your listing titles with specific location names for better search visibility",
        "Add high-quality photos during golden hour to showcase your property authentically",
        "Respond to booking requests within 2 hours to improve your response rate ranking",
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex-grow w-full max-w-2xl mx-auto px-6 py-12 md:py-24">
      {/* Header */}
      <div className="mb-12">
        <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
          Account
        </p>
        <h1 className="font-serif-display text-4xl md:text-5xl text-[#1E1A14] mb-3 tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-[#787774]">
          Manage your session, exports, and system preferences.
        </p>
      </div>

      {/* ─── Session Management ──────────────────────────────── */}
      <section className="mb-10" aria-labelledby="session-heading">
        <h2
          id="session-heading"
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-4"
        >
          Session Management
        </h2>
        <div className="bento-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#346538] animate-pulse" />
            <span className="text-sm font-medium text-[#1E1A14]">
              Session Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                htmlFor="session-phone"
                className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#787774] block mb-1"
              >
                Phone
              </label>
              <p
                id="session-phone"
                className="text-sm text-[#1E1A14] font-medium"
              >
                {phone || "Not set"}
              </p>
            </div>
            <div>
              <label
                htmlFor="session-name"
                className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#787774] block mb-1"
              >
                Name
              </label>
              <p
                id="session-name"
                className="text-sm text-[#1E1A14] font-medium"
              >
                {user?.name || "Not set"} {user?.surname || ""}
              </p>
            </div>
            <div>
              <label
                htmlFor="session-role"
                className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#787774] block mb-1"
              >
                Role
              </label>
              <p id="session-role" className="text-sm text-[#1E1A14] font-medium capitalize">
                {selectedRole || user?.role || "Not set"}
              </p>
            </div>
            <div>
              <label
                htmlFor="session-region"
                className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#787774] block mb-1"
              >
                Region
              </label>
              <p
                id="session-region"
                className="text-sm text-[#1E1A14] font-medium"
              >
                {user?.region || "Not set"}
              </p>
            </div>
          </div>

          <button
            onClick={handleClearSession}
            className="btn-secondary-feorm flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest min-h-[44px]"
            type="button"
          >
            <LogOut size={14} />
            Clear Session
          </button>
        </div>
      </section>

      {/* ─── Download Section ────────────────────────────────── */}
      <section className="mb-10" aria-labelledby="download-heading">
        <h2
          id="download-heading"
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-4"
        >
          Downloads
        </h2>
        <div className="bento-card p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownloadBrand}
              disabled={brandLoading}
              className="btn-primary-feorm flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest min-h-[44px] disabled:opacity-50"
              type="button"
            >
              <Download size={14} />
              {brandLoading ? "Generating..." : "Download Brand Identity"}
            </button>
            <button
              onClick={handleExportData}
              className="btn-secondary-feorm flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest min-h-[44px]"
              type="button"
            >
              <FileJson size={14} />
              Export Data
            </button>
          </div>
        </div>
      </section>

      {/* ─── System Reset ────────────────────────────────────── */}
      <section className="mb-10" aria-labelledby="reset-heading">
        <h2
          id="reset-heading"
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-4"
        >
          System Reset
        </h2>
        <div className="bento-card p-6 border-[#9F2F2D]/20">
          <div className="flex items-start gap-3 mb-5 p-4 rounded-[8px] bg-[#FDEBEC]/50">
            <AlertTriangle size={16} className="text-[#9F2F2D] shrink-0 mt-0.5" />
            <p className="text-xs text-[#9F2F2D] leading-relaxed">
              These actions are irreversible. Resetting will clear your
              preferences and may require you to complete onboarding again.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleResetOnboarding}
              className="flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest min-h-[44px] rounded-full border border-[#9F2F2D]/30 text-[#9F2F2D] hover:bg-[#FDEBEC] transition-colors active:scale-[0.98]"
              type="button"
            >
              <RotateCcw size={14} />
              Reset Onboarding
            </button>
            <button
              onClick={handleFullReset}
              className="flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest min-h-[44px] rounded-full bg-[#9F2F2D] text-white hover:bg-[#8a2826] transition-colors active:scale-[0.98]"
              type="button"
            >
              <AlertTriangle size={14} />
              Full System Reset
            </button>
          </div>
        </div>
      </section>

      {/* ─── AI-Powered Section ──────────────────────────────── */}
      <section className="mb-10" aria-labelledby="ai-heading">
        <h2
          id="ai-heading"
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-4"
        >
          AI-Powered
        </h2>
        <div className="bento-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-[#FBF3DB] flex items-center justify-center">
              <Sparkles size={16} className="text-[#956400]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#1E1A14]">
                Smart Profile Enhancement
              </p>
              <p className="text-xs text-[#787774]">
                Get AI-powered suggestions to optimize your profile
              </p>
            </div>
          </div>

          <button
            onClick={handleAiSuggest}
            disabled={aiLoading}
            className="btn-harvest flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest min-h-[44px] disabled:opacity-50"
            type="button"
          >
            <Sparkles size={14} />
            {aiLoading ? "Analyzing..." : "Enhance My Profile"}
          </button>

          {/* AI Suggestions */}
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

          {aiSuggestions && !aiLoading && (
            <div className="mt-5 bento-card p-5 bg-[#FBF3DB]/30">
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#956400] mb-4">
                AI Suggestions
              </p>
              <div className="space-y-3">
                {aiSuggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-[6px] bg-[#FEFDFB]"
                  >
                    <ChevronRight
                      size={14}
                      className="text-[#E8C96A] shrink-0 mt-0.5"
                    />
                    <p className="text-sm text-[#1E1A14] leading-relaxed">
                      {suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── App Info ────────────────────────────────────────── */}
      <section aria-labelledby="appinfo-heading">
        <h2
          id="appinfo-heading"
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-4"
        >
          Application Info
        </h2>
        <div className="bento-card p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={14} className="text-[#5C4A2A]" />
                <span className="text-sm text-[#1E1A14]">Project</span>
              </div>
              <span className="font-mono-feorm text-xs text-[#787774]">
                FE-N-0.1
              </span>
            </div>
            <div className="border-b border-[#3C2F1A]/5" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={14} className="text-[#5C4A2A]" />
                <span className="text-sm text-[#1E1A14]">Protocol</span>
              </div>
              <span className="font-mono-feorm text-xs text-[#787774]">
                Escrow + Verification
              </span>
            </div>
            <div className="border-b border-[#3C2F1A]/5" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Info size={14} className="text-[#5C4A2A]" />
                <span className="text-sm text-[#1E1A14]">Region</span>
              </div>
              <span className="font-mono-feorm text-xs text-[#787774]">
                Sub-Saharan Africa
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
