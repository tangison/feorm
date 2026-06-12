"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFeormAuth, useFeormOnboarding } from "@/context/feorm-context";
import { useAuthMutations } from "@/hooks/use-auth";
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
  const { user, email, phone, avatarUrl } = useFeormAuth();
  const { selectedRole, interests, hasCompletedOnboarding, providerAssets, setHasCompletedOnboarding } = useFeormOnboarding();
  const { signOut } = useAuthMutations();

  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Array<{ title: string; description: string; category: string }> | null>(null);
  const [brandLoading, setBrandLoading] = useState(false);

  // ─── Session Management ─────────────────────────────────────
  const handleClearSession = async () => {
    try {
      await signOut();
      router.push("/");
    } catch {
      router.push("/");
    }
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

      toast({ title: "Your brand page is ready" });
    } catch {
      toast({ title: "Could not create your brand page", description: "Something went wrong. Please try again." });
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

    toast({ title: "Your data has been exported" });
  };

  // ─── Reset Onboarding ──────────────────────────────────────
  const handleResetOnboarding = () => {
    setHasCompletedOnboarding(false);
    router.push("/");
  };

  // ─── Full System Reset ─────────────────────────────────────
  const handleFullReset = async () => {
    try {
      await signOut();
      router.push("/");
    } catch {
      router.push("/");
    }
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
        { title: "Name Your Farm Stay After Its Best Feature", description: "Instead of 'Farm Stay near Grootfontein', try 'Otjozondjupa Cattle Ranch with Sunset Views'. Specific names help travelers find you in search.", category: "listing" },
        { title: "Take Photos During Golden Hour", description: "Photos taken at sunrise or sunset make your farm look warm and inviting. Listings with 5+ photos get 3x more views on Feorm.", category: "listing" },
        { title: "Respond to Requests Within 2 Hours", description: "Hosts who reply within 2 hours appear higher in search results. Travelers often book the first host who responds.", category: "response" },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex-grow w-full max-w-2xl mx-auto px-6 py-12 md:py-24">
      {/* Header */}
      <div className="mb-12">
        <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          Account
        </p>
        <h1 className="font-serif-display text-4xl md:text-5xl text-earth mb-3 tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Control your account, download your data, and manage your preferences.
        </p>
      </div>

      {/* ─── Session Management ──────────────────────────────── */}
      <section className="mb-10" aria-labelledby="session-heading">
        <h2
          id="session-heading"
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-4"
        >
          Your Session
        </h2>
        <div className="bento-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-2.5 h-2.5 rounded-full bg-verified animate-pulse" />
            <span className="text-sm font-medium text-earth">
              Signed In
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label
                htmlFor="session-email"
                className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground block mb-1"
              >
                Email
              </label>
              <p
                id="session-email"
                className="text-sm text-earth font-medium"
              >
                {email || "Not set"}
              </p>
            </div>
            <div>
              <label
                htmlFor="session-name"
                className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground block mb-1"
              >
                Name
              </label>
              <p
                id="session-name"
                className="text-sm text-earth font-medium"
              >
                {user?.name || "Not set"} {user?.surname || ""}
              </p>
            </div>
            <div>
              <label
                htmlFor="session-role"
                className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground block mb-1"
              >
                Role
              </label>
              <p id="session-role" className="text-sm text-earth font-medium capitalize">
                {selectedRole || user?.role || "Not set"}
              </p>
            </div>
            <div>
              <label
                htmlFor="session-region"
                className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground block mb-1"
              >
                Region
              </label>
              <p
                id="session-region"
                className="text-sm text-earth font-medium"
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
            Sign Out
          </button>
        </div>
      </section>

      {/* ─── Download Section ────────────────────────────────── */}
      <section className="mb-10" aria-labelledby="download-heading">
        <h2
          id="download-heading"
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-4"
        >
          Download Your Data
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
              {brandLoading ? "Generating..." : "Download Your Brand Page"}
            </button>
            <button
              onClick={handleExportData}
              className="btn-secondary-feorm flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest min-h-[44px]"
              type="button"
            >
              <FileJson size={14} />
              Export Your Account Data
            </button>
          </div>
        </div>
      </section>

      {/* ─── System Reset ────────────────────────────────────── */}
      <section className="mb-10" aria-labelledby="reset-heading">
        <h2
          id="reset-heading"
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-4"
        >
          Reset Your Account
        </h2>
        <div className="bento-card p-6 border-destructive/20">
          <div className="flex items-start gap-3 mb-5 p-4 rounded-[8px] bg-destructive-bg/50">
            <AlertTriangle size={16} className="text-destructive shrink-0 mt-0.5" />
            <p className="text-xs text-destructive leading-relaxed">
              These actions cannot be undone. Resetting clears your
              preferences and you will need to complete onboarding again.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleResetOnboarding}
              className="flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest min-h-[44px] rounded-full border border-destructive/30 text-destructive hover:bg-destructive-bg transition-colors active:scale-[0.98]"
              type="button"
            >
              <RotateCcw size={14} />
              Start Onboarding Over
            </button>
            <button
              onClick={handleFullReset}
              className="flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-widest min-h-[44px] rounded-full bg-destructive text-white hover:bg-destructive-dark transition-colors active:scale-[0.98]"
              type="button"
            >
              <AlertTriangle size={14} />
              Sign Out and Reset Everything
            </button>
          </div>
        </div>
      </section>

      {/* ─── AI-Powered Section ──────────────────────────────── */}
      <section className="mb-10" aria-labelledby="ai-heading">
        <h2
          id="ai-heading"
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-4"
        >
          Farm Stay Tips
        </h2>
        <div className="bento-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
              <Sparkles size={16} className="text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-earth">
                Get More Bookings
              </p>
              <p className="text-xs text-muted-foreground">
                Practical ways to make your farm stay listing more appealing to travelers
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
            {aiLoading ? "Analyzing..." : "Get Booking Tips"}
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
            <div className="mt-5 bento-card p-6 bg-accent/30">
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-accent-foreground mb-4">
                Suggestions
              </p>
              <div className="space-y-3">
                {aiSuggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-[6px] bg-white-feorm"
                  >
                    <ChevronRight
                      size={14}
                      className="text-harvest shrink-0 mt-0.5"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-earth leading-relaxed">
                          {suggestion.title}
                        </p>
                        <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-mono-feorm border border-soil/10 rounded-full px-2 py-0.5 shrink-0">
                          {suggestion.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {suggestion.description}
                      </p>
                    </div>
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
          className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-4"
        >
          About Feorm
        </h2>
        <div className="bento-card p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={14} className="text-bark" />
                <span className="text-sm text-earth">Project</span>
              </div>
              <span className="font-mono-feorm text-xs text-muted-foreground">
                FE-N-0.1
              </span>
            </div>
            <div className="border-b border-soil/5" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={14} className="text-bark" />
                <span className="text-sm text-earth">Protocol</span>
              </div>
              <span className="font-mono-feorm text-xs text-muted-foreground">
                Escrow + Verification
              </span>
            </div>
            <div className="border-b border-soil/5" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Info size={14} className="text-bark" />
                <span className="text-sm text-earth">Region</span>
              </div>
              <span className="font-mono-feorm text-xs text-muted-foreground">
                Sub-Saharan Africa
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
