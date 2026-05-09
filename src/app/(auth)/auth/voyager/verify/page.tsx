"use client";

import { useRouter } from "next/navigation";
import { useFeorm } from "@/context/feorm-context";
import { ArrowLeft, ArrowRight, CheckCircle, SkipForward, Download } from "lucide-react";

export default function VoyagerVerifyPage() {
  const { setHasCompletedOnboarding, user, selectedRole, interests, avatarUrl } = useFeorm();
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
      // Demo mode: skip
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-md w-full">
        <button
          onClick={() => router.push("/auth/voyager/interests")}
          className="mb-8 flex items-center gap-2 text-sm text-[#787774] hover:text-[#1E1A14] transition-colors min-h-[44px]"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="mb-10">
          <kbd className="font-mono-feorm text-[10px] border border-[#3C2F1A]/20 bg-[#FEFDFB] px-2 py-1 rounded text-[#787774] mb-6 inline-block">
            VERIFICATION LEVEL
          </kbd>
          <h2 className="font-serif-display text-3xl md:text-4xl mb-4 text-[#1E1A14] tracking-tight">
            Trust Credentials
          </h2>
          <p className="text-sm text-[#787774] leading-relaxed">
            Higher verification unlocks better listings and priority booking. You can always verify later.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {/* Verified Voyager Option */}
          <button
            onClick={() => handleComplete(true)}
            className="w-full p-6 text-left border-2 border-[#346538]/20 rounded-[8px] bg-[#FEFDFB] hover:border-[#346538] transition-all group active:scale-[0.98]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#EDF3EC] flex items-center justify-center group-hover:bg-[#346538] transition-colors">
                <CheckCircle size={18} className="text-[#346538] group-hover:text-[#FEFDFB] transition-colors" />
              </div>
              <div>
                <h3 className="font-serif-display text-lg text-[#1E1A14]">Verified Voyager</h3>
                <span className="tag-verified text-[9px] uppercase font-semibold px-2 py-0.5 tracking-wider">
                  Green Badge
                </span>
              </div>
            </div>
            <p className="text-xs text-[#787774] leading-relaxed">
              Upload a passport photo or link a social ID. Get the green verification badge and priority access to premium listings.
            </p>
          </button>

          {/* Skip Option */}
          <button
            onClick={() => handleComplete(false)}
            className="w-full p-5 text-left border border-[#3C2F1A]/10 rounded-[8px] bg-[#FEFDFB] hover:border-[#3C2F1A]/20 transition-all group"
          >
            <div className="flex items-center gap-3">
              <SkipForward size={18} className="text-[#787774]" />
              <div>
                <p className="text-sm text-[#787774] group-hover:text-[#1E1A14] transition-colors">Skip for now</p>
                <p className="text-[9px] text-[#787774] font-mono-feorm uppercase tracking-wider">You can verify later from your profile</p>
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
          className="w-full mt-3 border border-[#3C2F1A]/10 px-5 py-3 text-xs uppercase tracking-widest flex justify-center items-center gap-2 rounded-full text-[#787774] hover:text-[#1E1A14] hover:border-[#3C2F1A]/20 transition-all min-h-[44px]"
        >
          <Download size={14} /> Download Brand Identity
        </button>
      </div>
    </div>
  );
}
