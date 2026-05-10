"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFeormAuth, useFeormOnboarding } from "@/context/feorm-context";
import { ArrowLeft, ArrowRight, MapPin, Download } from "lucide-react";

const NAMIBIA_REGIONS = [
  { name: "Khomas", code: "KH" },
  { name: "Otjozondjupa", code: "OT" },
  { name: "Erongo", code: "ER" },
  { name: "Hardap", code: "HA" },
  { name: "Omaheke", code: "OM" },
  { name: "Karas", code: "KR" },
  { name: "Kunene", code: "KU" },
  { name: "Ohangwena", code: "OH" },
  { name: "Oshana", code: "OS" },
  { name: "Omusati", code: "OMU" },
  { name: "Oshikoto", code: "OK" },
  { name: "Zambezi", code: "ZA" },
  { name: "Kavango East", code: "KE" },
  { name: "Kavango West", code: "KW" },
];

export default function ProviderRegionPage() {
  const { setUser, avatarUrl } = useFeormAuth();
  const { setHasCompletedOnboarding, user, selectedRole, providerAssets } = useFeormOnboarding();
  const [selectedRegion, setSelectedRegion] = useState("");
  const router = useRouter();

  const handleComplete = () => {
    if (selectedRegion) {
      setUser((prev: any) =>
        prev ? { ...prev, region: selectedRegion } : null
      );
    }
    setHasCompletedOnboarding(true);
    router.push("/dashboard");
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-lg w-full">
        <button
          onClick={() => router.push("/auth/provider/assets")}
          className="mb-8 flex items-center gap-2 text-sm text-[#787774] hover:text-[#1E1A14] transition-colors min-h-[44px]"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="mb-10">
          <kbd className="font-mono-feorm text-[10px] border border-[#3C2F1A]/20 bg-[#FEFDFB] px-2 py-1 rounded text-[#787774] mb-6 inline-block">
            REGIONAL SPEC
          </kbd>
          <h1 className="font-serif-display text-3xl md:text-4xl mb-4 text-[#1E1A14] tracking-tight">
            Pin Your Location
          </h1>
          <p className="text-sm text-[#787774] leading-relaxed">
            Select the region where your assets are located. This helps voyagers find you.
          </p>
        </div>

        {/* Region Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
          {NAMIBIA_REGIONS.map((region) => {
            const isSelected = selectedRegion === region.name;
            return (
              <button
                key={region.code}
                onClick={() => setSelectedRegion(region.name)}
                className={`p-3 rounded-[8px] text-left transition-all duration-200 min-h-[44px] ${
                  isSelected
                    ? "bg-[#1E1A14] text-[#FEFDFB] border-2 border-[#1E1A14]"
                    : "bg-[#FEFDFB] border border-[#3C2F1A]/10 text-[#3C2F1A] hover:border-[#3C2F1A]/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin size={12} className={isSelected ? "text-[#E8C96A]" : "text-[#787774]"} />
                  <span className="text-xs font-medium truncate">{region.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        {selectedRegion && (
          <div className="mb-6 p-3 bg-[#FAF7F2] rounded-[4px] border border-[#3C2F1A]/5">
            <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#787774]">
              Selected: <span className="text-[#1E1A14] font-medium">{selectedRegion}</span>
            </p>
          </div>
        )}

        <button
          onClick={handleComplete}
          disabled={!selectedRegion}
          className="w-full btn-harvest px-5 py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        >
          Launch Host Dashboard
          <ArrowRight size={14} />
        </button>

        <button
          onClick={async () => {
            try {
              const res = await fetch("/api/brand-identity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: user?.name,
                  surname: user?.surname,
                  role: selectedRole,
                  region: selectedRegion,
                  interests: providerAssets,
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
            } catch {}
          }}
          className="w-full mt-3 border border-[#3C2F1A]/10 px-5 py-3 text-xs uppercase tracking-widest flex justify-center items-center gap-2 rounded-full text-[#787774] hover:text-[#1E1A14] hover:border-[#3C2F1A]/20 transition-all min-h-[44px]"
        >
          <Download size={14} /> Download Brand Identity
        </button>
      </div>
    </div>
  );
}
