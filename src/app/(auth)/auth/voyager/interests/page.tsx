"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFeormOnboarding, useFeormAuth } from "@/context/feorm-context";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { NAMIBIAN_REGIONS } from "@/lib/regions";
import Image from "next/image";

const INTEREST_OPTIONS = [
  "Farm Stays",
] as const;

export default function VoyagerInterestsPage() {
  const { interests, setInterests, setHasCompletedOnboarding } = useFeormOnboarding();
  const { user } = useFeormAuth();
  const [selected, setSelected] = useState<string[]>(
    interests.length > 0 ? interests : []
  );
  const [regions, setRegions] = useState<string[]>([]);
  const router = useRouter();

  const toggleInterest = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleRegion = (region: string) => {
    setRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  };

  const handleContinue = () => {
    setInterests(selected);
    setHasCompletedOnboarding(true);
    router.push("/marketplace");
  };

  return (
    <div className="relative flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen">
      {/* Full bleed background */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/hero-gateway-mobile.png"
          alt=""
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)",
          }}
        />
      </div>

      <div className="max-w-lg w-full relative z-10">
        {/* Back button */}
        <button
          onClick={() => router.push("/auth/voyager/profile")}
          className="mb-6 flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors min-h-[44px]"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Logo */}
        <div className="text-center mb-6">
          <Image
            src="/feorm-logo.png"
            alt="Feorm"
            width={32}
            height={32}
            className="mx-auto mb-3 rounded-[3px]"
          />
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-white/30" />
          <div className="w-2 h-2 rounded-full bg-harvest" />
        </div>

        <h1 className="font-serif-display text-3xl md:text-4xl mb-3 text-white tracking-tight">
          What are you looking for?
        </h1>
        <p className="text-sm text-white/60 leading-relaxed mb-8">
          Tell us what interests you and which regions you want to explore. We will tailor your feed accordingly.
        </p>

        <div className="space-y-6">
          {/* Interest Selection */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest mb-3 text-white/60">
              What are you looking for?
            </p>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = selected.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className="px-5 py-3 rounded-full text-sm uppercase tracking-widest font-medium transition-all duration-200 min-h-[44px]"
                    style={{
                      background: isSelected
                        ? "rgba(196,147,58,0.9)"
                        : "rgba(255,255,255,0.12)",
                      border: isSelected
                        ? "1px solid rgba(196,147,58,0.9)"
                        : "1px solid rgba(255,255,255,0.2)",
                      color: isSelected ? "#1E1A14" : "rgba(255,255,255,0.7)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Region Multi-Select */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest mb-3 text-white/60">
              Which regions interest you?
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {NAMIBIAN_REGIONS.map((region) => {
                const isSelected = regions.includes(region);
                return (
                  <button
                    key={region}
                    onClick={() => toggleRegion(region)}
                    className="p-3 rounded-[8px] text-left transition-all duration-200 min-h-[44px]"
                    style={{
                      background: isSelected
                        ? "rgba(196,147,58,0.3)"
                        : "rgba(255,255,255,0.12)",
                      border: isSelected
                        ? "1px solid rgba(196,147,58,0.6)"
                        : "1px solid rgba(255,255,255,0.2)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <span
                      className={`text-xs font-medium ${
                        isSelected ? "text-harvest" : "text-white/70"
                      }`}
                    >
                      {region}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {selected.length > 0 && (
            <p className="font-mono-feorm text-[10px] text-white/50 uppercase tracking-widest">
              {selected.length} interest{selected.length !== 1 ? "s" : ""} · {regions.length} region{regions.length !== 1 ? "s" : ""} selected
            </p>
          )}

          <button
            onClick={handleContinue}
            disabled={selected.length === 0}
            className="w-full px-5 py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] rounded-full font-semibold"
            style={{ backgroundColor: "#C4933A", color: "#1E1A14" }}
          >
            Start Exploring
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
