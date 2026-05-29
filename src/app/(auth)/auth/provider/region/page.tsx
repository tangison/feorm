"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFeormAuth, useFeormOnboarding } from "@/context/feorm-context";
import { ArrowLeft, ArrowRight, MapPin, Download } from "lucide-react";
import { NAMIBIAN_REGIONS_WITH_CODES } from "@/lib/regions";

export default function ProviderRegionPage() {
  const { setUser, avatarUrl, user } = useFeormAuth();
  const { setHasCompletedOnboarding, selectedRole, providerAssets } = useFeormOnboarding();
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
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-fog">
      <div className="max-w-lg w-full">
        <button
          onClick={() => router.push("/auth/provider/assets")}
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-earth transition-colors min-h-[44px]"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="mb-10">
          <kbd className="font-mono-feorm text-[10px] border border-soil/20 bg-white-feorm px-2 py-1 rounded text-muted-foreground mb-6 inline-block">
            REGIONAL SPEC
          </kbd>
          <h1 className="font-serif-display text-3xl md:text-4xl mb-4 text-earth tracking-tight">
            Pin Your Location
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Select the region where your assets are located. This helps voyagers find you.
          </p>
        </div>

        {/* Region Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
          {NAMIBIAN_REGIONS_WITH_CODES.map((region) => {
            const isSelected = selectedRegion === region.name;
            return (
              <button
                key={region.code}
                onClick={() => setSelectedRegion(region.name)}
                className={`p-3 rounded-[8px] text-left transition-all duration-200 min-h-[44px] ${
                  isSelected
                    ? "bg-earth text-white-feorm border-2 border-earth"
                    : "bg-white-feorm border border-soil/10 text-soil hover:border-soil/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin size={12} className={isSelected ? "text-harvest" : "text-muted-foreground"} />
                  <span className="text-xs font-medium truncate">{region.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        {selectedRegion && (
          <div className="mb-6 p-3 bg-fog rounded-[4px] border border-soil/5">
            <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground">
              Selected: <span className="text-earth font-medium">{selectedRegion}</span>
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
          className="w-full mt-3 border border-soil/10 px-5 py-3 text-xs uppercase tracking-widest flex justify-center items-center gap-2 rounded-full text-muted-foreground hover:text-earth hover:border-soil/20 transition-all min-h-[44px]"
        >
          <Download size={14} /> Download Brand Identity
        </button>
      </div>
    </div>
  );
}
