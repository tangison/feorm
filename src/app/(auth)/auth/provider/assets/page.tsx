"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFeorm } from "@/context/feorm-context";
import { ArrowLeft, ArrowRight, Tent, Wrench } from "lucide-react";

export default function ProviderAssetsPage() {
  const { providerAssets, setProviderAssets } = useFeorm();
  const [assets, setAssets] = useState<("stay" | "equipment")[]>(providerAssets);
  const router = useRouter();

  const toggleAsset = (type: "stay" | "equipment") => {
    setAssets((prev) =>
      prev.includes(type) ? prev.filter((a) => a !== type) : [...prev, type]
    );
  };

  const handleContinue = () => {
    setProviderAssets(assets);
    router.push("/auth/provider/region");
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-md w-full">
        <button
          onClick={() => router.push("/auth/role")}
          className="mb-8 flex items-center gap-2 text-sm text-[#787774] hover:text-[#1E1A14] transition-colors min-h-[44px]"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="mb-10">
          <kbd className="font-mono-feorm text-[10px] border border-[#3C2F1A]/20 bg-[#FEFDFB] px-2 py-1 rounded text-[#787774] mb-6 inline-block">
            PROVIDER SETUP
          </kbd>
          <h2 className="font-serif-display text-3xl md:text-4xl mb-4 text-[#1E1A14] tracking-tight">
            Asset Inventory
          </h2>
          <p className="text-sm text-[#787774] leading-relaxed">
            What will you be providing to the Feorm network? Select all that apply.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {/* Farm Stay Toggle */}
          <button
            onClick={() => toggleAsset("stay")}
            className={`w-full p-6 text-left border-2 rounded-[8px] transition-all duration-300 active:scale-[0.98] ${
              assets.includes("stay")
                ? "border-[#E8C96A] bg-[#FBF3DB]/30"
                : "border-[#3C2F1A]/10 bg-[#FEFDFB] hover:border-[#3C2F1A]/20"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-[10px] flex items-center justify-center transition-colors ${
                  assets.includes("stay")
                    ? "bg-[#E8C96A]"
                    : "bg-[#FAF7F2]"
                }`}
              >
                <Tent
                  size={22}
                  className={
                    assets.includes("stay")
                      ? "text-[#1E1A14]"
                      : "text-[#787774]"
                  }
                />
              </div>
              <div>
                <h3 className="font-serif-display text-lg text-[#1E1A14]">
                  Farm Stays
                </h3>
                <p className="text-xs text-[#787774] mt-1">
                  Accommodation, guest houses, tent camps, eco lodges
                </p>
              </div>
              {assets.includes("stay") && (
                <div className="ml-auto w-6 h-6 rounded-full bg-[#E8C96A] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#1E1A14]" />
                </div>
              )}
            </div>
          </button>

          {/* Equipment Toggle */}
          <button
            onClick={() => toggleAsset("equipment")}
            className={`w-full p-6 text-left border-2 rounded-[8px] transition-all duration-300 active:scale-[0.98] ${
              assets.includes("equipment")
                ? "border-[#1F6C9F] bg-[#E1F3FE]/30"
                : "border-[#3C2F1A]/10 bg-[#FEFDFB] hover:border-[#3C2F1A]/20"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-[10px] flex items-center justify-center transition-colors ${
                  assets.includes("equipment")
                    ? "bg-[#E1F3FE]"
                    : "bg-[#FAF7F2]"
                }`}
              >
                <Wrench
                  size={22}
                  className={
                    assets.includes("equipment")
                      ? "text-[#1F6C9F]"
                      : "text-[#787774]"
                  }
                />
              </div>
              <div>
                <h3 className="font-serif-display text-lg text-[#1E1A14]">
                  Equipment
                </h3>
                <p className="text-xs text-[#787774] mt-1">
                  Machinery, irrigation, attachments, energy systems
                </p>
              </div>
              {assets.includes("equipment") && (
                <div className="ml-auto w-6 h-6 rounded-full bg-[#E1F3FE] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#1F6C9F]" />
                </div>
              )}
            </div>
          </button>
        </div>

        <button
          onClick={handleContinue}
          disabled={assets.length === 0}
          className="w-full btn-primary-feorm px-5 py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        >
          Continue
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
