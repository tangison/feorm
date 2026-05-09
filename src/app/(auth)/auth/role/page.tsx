"use client";

import { useFeormAuth, useFeormOnboarding } from "@/context/feorm-context";
import { useRouter } from "next/navigation";
import { Compass, Tractor, ArrowRight } from "lucide-react";

export default function RolePage() {
  const { setUser } = useFeormAuth();
  const { setSelectedRole } = useFeormOnboarding();
  const router = useRouter();

  const handleRoleSelect = (role: "voyager" | "provider") => {
    setSelectedRole(role);
    setUser((prev: any) => (prev ? { ...prev, role } : null));

    if (role === "voyager") {
      router.push("/auth/voyager/interests");
    } else {
      router.push("/auth/provider/assets");
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-3xl w-full">
        <div className="mb-12 text-center">
          <kbd className="font-mono-feorm text-[10px] border border-[#3C2F1A]/20 bg-[#FEFDFB] px-2 py-1 rounded text-[#787774] mb-6 inline-block">
            PERSONA SELECTION
          </kbd>
          <h2 className="font-serif-display text-3xl md:text-5xl mb-4 text-[#1E1A14] tracking-tight">
            How will you use the land?
          </h2>
          <p className="text-sm text-[#787774] max-w-md mx-auto leading-relaxed">
            Your role shapes your entire marketplace experience. Choose the path that matches your intent.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Voyager Card */}
          <button
            onClick={() => handleRoleSelect("voyager")}
            className="group p-8 md:p-10 text-left border-2 border-[#3C2F1A]/10 rounded-[12px] transition-all duration-300 hover:border-[#E8C96A] hover:shadow-[0_8px_32px_rgba(232,201,106,0.08)] bg-[#FEFDFB] active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-[12px] bg-[#FBF3DB] flex items-center justify-center mb-6 group-hover:bg-[#E8C96A] transition-colors duration-300">
              <Compass size={24} className="text-[#956400] group-hover:text-[#1E1A14] transition-colors" />
            </div>
            <h3 className="font-serif-display text-2xl md:text-3xl mb-3 text-[#1E1A14]">
              I am a Voyager
            </h3>
            <p className="text-[10px] uppercase tracking-widest text-[#E8C96A] font-mono-feorm font-medium mb-4">
              Guest / Traveler
            </p>
            <p className="text-sm text-[#787774] leading-relaxed mb-8">
              Discover farm stays, rent equipment, and experience authentic
              Namibian agrotourism. Curated discovery, trusted escrow, seamless booking.
            </p>
            <div className="flex items-center gap-2 text-[#787774] group-hover:text-[#1E1A14] transition-colors">
              <span className="font-mono-feorm text-[10px] uppercase tracking-widest font-medium">
                Explore the land
              </span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </button>

          {/* Provider Card */}
          <button
            onClick={() => handleRoleSelect("provider")}
            className="group p-8 md:p-10 text-left border-2 border-[#3C2F1A]/10 rounded-[12px] transition-all duration-300 hover:border-[#346538] hover:shadow-[0_8px_32px_rgba(52,101,56,0.08)] bg-[#FEFDFB] active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-[12px] bg-[#EDF3EC] flex items-center justify-center mb-6 group-hover:bg-[#346538] transition-colors duration-300">
              <Tractor size={24} className="text-[#346538] group-hover:text-[#FEFDFB] transition-colors" />
            </div>
            <h3 className="font-serif-display text-2xl md:text-3xl mb-3 text-[#1E1A14]">
              I am a Provider
            </h3>
            <p className="text-[10px] uppercase tracking-widest text-[#346538] font-mono-feorm font-medium mb-4">
              Host / Farmer
            </p>
            <p className="text-sm text-[#787774] leading-relaxed mb-8">
              List your farmland, accommodation, or machinery. Earn from your
              assets with escrow protection and verified bookings.
            </p>
            <div className="flex items-center gap-2 text-[#787774] group-hover:text-[#1E1A14] transition-colors">
              <span className="font-mono-feorm text-[10px] uppercase tracking-widest font-medium">
                Manage your assets
              </span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
