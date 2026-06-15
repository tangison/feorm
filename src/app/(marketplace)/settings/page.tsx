"use client";

import { useRouter } from "next/navigation";
import { useFeormAuth, useFeormOnboarding } from "@/context/feorm-context";
import {
  Shield,
  Download,
  RotateCcw,
  Info,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useFeormAuth();
  const { interests } = useFeormOnboarding();

  return (
    <div className="flex-grow w-full max-w-2xl mx-auto px-6 py-12 md:py-24">
      <div className="mb-12">
        <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          Settings
        </p>
        <h1 className="section-headline font-serif-display text-earth mb-3">
          Preferences
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="space-y-3">
        {/* Account Info */}
        <div className="bento-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-earth text-white-feorm flex items-center justify-center text-sm font-medium font-serif-display">
              {user?.name?.[0] ?? "G"}
            </div>
            <div>
              <p className="text-sm font-medium text-earth">{user?.name} {user?.surname}</p>
              <p className="text-xs text-muted-foreground font-mono-feorm">{user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Role</p>
              <p className="text-sm text-earth capitalize">{user?.role || "guest"}</p>
            </div>
            <div>
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Region</p>
              <p className="text-sm text-earth">{user?.region || "Namibia"}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <button
          onClick={() => router.push("/profile")}
          className="w-full bento-card bento-card-lift p-5 flex items-center justify-between hover:border-earth/20 transition-colors text-left group"
        >
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-muted-foreground" />
            <p className="text-sm font-medium text-earth">Edit Profile</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={() => router.push("/verification")}
          className="w-full bento-card bento-card-lift p-5 flex items-center justify-between hover:border-earth/20 transition-colors text-left group"
        >
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-verified" />
            <div>
              <p className="text-sm font-medium text-earth">Verification</p>
              <p className="text-xs text-muted-foreground">Verify your identity for full access</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={() => router.push("/support")}
          className="w-full bento-card bento-card-lift p-5 flex items-center justify-between hover:border-earth/20 transition-colors text-left group"
        >
          <div className="flex items-center gap-3">
            <Info size={18} className="text-muted-foreground" />
            <p className="text-sm font-medium text-earth">Support</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Demo Notice */}
        <div className="bento-card p-6 border-l-4 border-l-harvest">
          <div className="flex items-start gap-3">
            <Sparkles size={18} className="text-harvest shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-earth mb-1">Demo Mode</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You are viewing a live demo of the Feorm platform. All data, listings, images, and bookings are simulated. Use the persona switcher to toggle between Guest and Farmer views.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            try {
              localStorage.removeItem("feorm_demo_persona");
              localStorage.removeItem("feorm_demo_banner_dismissed");
            } catch { /* ignore */ }
            window.location.reload();
          }}
          className="w-full bento-card bento-card-lift p-5 flex items-center justify-between hover:border-earth/20 transition-colors text-left group"
        >
          <div className="flex items-center gap-3">
            <RotateCcw size={18} className="text-muted-foreground" />
            <p className="text-sm font-medium text-earth">Reset Demo</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
