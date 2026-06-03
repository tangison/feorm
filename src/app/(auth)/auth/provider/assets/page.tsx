"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFeormOnboarding } from "@/context/feorm-context";
import { ArrowLeft, ArrowRight, Tent, Wrench } from "lucide-react";

export default function ProviderAssetsPage() {
  const { providerAssets, setProviderAssets } = useFeormOnboarding();
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
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-fog">
      <div className="max-w-md w-full">
        <button
          onClick={() => router.push("/auth/role")}
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-earth transition-colors min-h-[44px]"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="mb-10">
          <kbd className="font-mono-feorm text-[10px] border border-soil/20 bg-white-feorm px-2 py-1 rounded text-muted-foreground mb-6 inline-block">
            PROVIDER SETUP
          </kbd>
          <h1 className="font-serif-display text-3xl md:text-4xl mb-4 text-earth tracking-tight">
            Asset Inventory
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            What will you be providing to the Feorm network? Select all that apply.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {/* Farm Stay Toggle */}
          <button
            onClick={() => toggleAsset("stay")}
            className={`w-full p-6 text-left border-2 rounded-[8px] transition-all duration-300 active:scale-[0.98] ${
              assets.includes("stay")
                ? "border-harvest bg-accent/30"
                : "border-soil/10 bg-white-feorm hover:border-soil/20"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-[10px] flex items-center justify-center transition-colors ${
                  assets.includes("stay")
                    ? "bg-harvest"
                    : "bg-fog"
                }`}
              >
                <Tent
                  size={22}
                  className={
                    assets.includes("stay")
                      ? "text-earth"
                      : "text-muted-foreground"
                  }
                />
              </div>
              <div>
                <h3 className="font-serif-display text-lg text-earth">
                  Farm Stays
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Accommodation, guest houses, tent camps, eco lodges
                </p>
              </div>
              {assets.includes("stay") && (
                <div className="ml-auto w-6 h-6 rounded-full bg-harvest flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-earth" />
                </div>
              )}
            </div>
          </button>

          {/* Equipment Toggle */}
          <button
            onClick={() => toggleAsset("equipment")}
            className={`w-full p-6 text-left border-2 rounded-[8px] transition-all duration-300 active:scale-[0.98] ${
              assets.includes("equipment")
                ? "border-machinery bg-machinery-bg/30"
                : "border-soil/10 bg-white-feorm hover:border-soil/20"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-[10px] flex items-center justify-center transition-colors ${
                  assets.includes("equipment")
                    ? "bg-machinery-bg"
                    : "bg-fog"
                }`}
              >
                <Wrench
                  size={22}
                  className={
                    assets.includes("equipment")
                      ? "text-machinery"
                      : "text-muted-foreground"
                  }
                />
              </div>
              <div>
                <h3 className="font-serif-display text-lg text-earth">
                  Equipment
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Machinery, irrigation, attachments, energy systems
                </p>
              </div>
              {assets.includes("equipment") && (
                <div className="ml-auto w-6 h-6 rounded-full bg-machinery-bg flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-machinery" />
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
