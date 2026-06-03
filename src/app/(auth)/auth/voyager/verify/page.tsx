"use client";

import { useRouter } from "next/navigation";
import { useFeormAuth, useFeormOnboarding } from "@/context/feorm-context";
import { ArrowLeft, ArrowRight, CheckCircle, SkipForward, Download } from "lucide-react";

export default function VoyagerVerifyPage() {
  const { user, avatarUrl } = useFeormAuth();
  const { setHasCompletedOnboarding, selectedRole, interests } = useFeormOnboarding();
  const router = useRouter();

  const handleComplete = (verified: boolean) => {
    setHasCompletedOnboarding(true);
    router.push("/marketplace");
  };

  const handleDownloadBrandIdentity = async () => {
    try {
      const res = await fetch("/api/brand-identity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user?.name,
          surname: user?.surname,
          role: selectedRole,
          region: user?.region,
          interests,
          avatarUrl,
        }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "feorm-brand-identity.html";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // Verification handled by Supabase
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-fog">
      <div className="max-w-md w-full">
        <button
          onClick={() => router.push("/auth/voyager/interests")}
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-earth transition-colors min-h-[44px]"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="mb-10">
          <kbd className="font-mono-feorm text-[10px] border border-soil/20 bg-white-feorm px-2 py-1 rounded text-muted-foreground mb-6 inline-block">
            VERIFICATION LEVEL
          </kbd>
          <h1 className="font-serif-display text-3xl md:text-4xl mb-4 text-earth tracking-tight">
            Trust Credentials
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Higher verification unlocks better listings and priority booking. You can always verify later.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {/* Verified Voyager Option */}
          <button
            onClick={() => handleComplete(true)}
            className="w-full p-6 text-left border-2 border-verified/20 rounded-[8px] bg-white-feorm hover:border-verified transition-all group active:scale-[0.98]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-verified-bg flex items-center justify-center group-hover:bg-verified transition-colors">
                <CheckCircle size={18} className="text-verified group-hover:text-white-feorm transition-colors" />
              </div>
              <div>
                <h3 className="font-serif-display text-lg text-earth">Verified Voyager</h3>
                <span className="tag-verified text-[9px] uppercase font-semibold px-2 py-0.5 tracking-wider">
                  Green Badge
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Upload a passport photo or link a social ID. Get the green verification badge and priority access to premium listings.
            </p>
          </button>

          {/* Skip Option */}
          <button
            onClick={() => handleComplete(false)}
            className="w-full p-5 text-left border border-soil/10 rounded-[8px] bg-white-feorm hover:border-soil/20 transition-all group"
          >
            <div className="flex items-center gap-3">
              <SkipForward size={18} className="text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground group-hover:text-earth transition-colors">Skip for now</p>
                <p className="text-[9px] text-muted-foreground font-mono-feorm uppercase tracking-wider">You can verify later from your profile</p>
              </div>
            </div>
          </button>
        </div>

        <button
          onClick={() => handleComplete(false)}
          className="w-full btn-primary-feorm px-5 py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 min-h-[44px]"
        >
          Enter the Marketplace
          <ArrowRight size={14} />
        </button>

        <button
          onClick={handleDownloadBrandIdentity}
          className="w-full mt-3 border border-soil/10 px-5 py-3 text-xs uppercase tracking-widest flex justify-center items-center gap-2 rounded-full text-muted-foreground hover:text-earth hover:border-soil/20 transition-all min-h-[44px]"
        >
          <Download size={14} /> Download Brand Identity
        </button>
      </div>
    </div>
  );
}
