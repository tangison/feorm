"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFeorm } from "@/context/feorm-context";
import { ArrowLeft, ArrowRight } from "lucide-react";

const INTEREST_OPTIONS = [
  "Cattle Harvest",
  "Bush Walks",
  "Photography",
  "Bird Watching",
  "Stargazing",
  "Cultural Exchange",
  "River Excursions",
  "Hiking Trails",
  "Wildlife Tracking",
  "Off-grid Retreats",
  "Farm-to-Table",
  "Desert Camping",
];

export default function VoyagerInterestsPage() {
  const { interests, setInterests } = useFeorm();
  const [selected, setSelected] = useState<string[]>(interests);
  const router = useRouter();

  const toggleInterest = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleContinue = () => {
    setInterests(selected);
    router.push("/auth/voyager/verify");
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-lg w-full">
        <button
          onClick={() => router.push("/auth/role")}
          className="mb-8 flex items-center gap-2 text-sm text-[#787774] hover:text-[#1E1A14] transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="mb-10">
          <kbd className="font-mono-feorm text-[10px] border border-[#3C2F1A]/20 bg-[#FEFDFB] px-2 py-1 rounded text-[#787774] mb-6 inline-block">
            VOYAGER SETUP
          </kbd>
          <h2 className="font-serif-display text-3xl md:text-4xl mb-4 text-[#1E1A14] tracking-tight">
            Map Your Interests
          </h2>
          <p className="text-sm text-[#787774] leading-relaxed">
            Select the experiences that draw you to the land. We will curate your discovery feed accordingly.
          </p>
        </div>

        {/* Pill Selection Grid */}
        <div className="flex flex-wrap gap-2 mb-8">
          {INTEREST_OPTIONS.map((interest) => {
            const isSelected = selected.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium transition-all duration-200 min-h-[44px] ${
                  isSelected
                    ? "bg-[#1E1A14] text-[#FEFDFB]"
                    : "bg-transparent border border-[#3C2F1A]/10 text-[#787774] hover:bg-[#FAF7F2] hover:text-[#1E1A14]"
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>

        {selected.length > 0 && (
          <p className="font-mono-feorm text-[10px] text-[#787774] uppercase tracking-widest mb-6">
            {selected.length} interest{selected.length !== 1 ? "s" : ""} selected
          </p>
        )}

        <button
          onClick={handleContinue}
          disabled={selected.length === 0}
          className="w-full btn-primary-feorm py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        >
          Continue
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
