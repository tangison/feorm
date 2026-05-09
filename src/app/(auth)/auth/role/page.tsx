"use client";

import { useFeorm } from "@/context/feorm-context";
import { useRouter } from "next/navigation";
import { MapPin, Shield } from "lucide-react";

export default function RolePage() {
  const { setUser } = useFeorm();
  const router = useRouter();

  const handleRoleSelect = (role: "explorer" | "lister") => {
    setUser((prev) => (prev ? { ...prev, role } : null));
    router.push("/auth/onboarding");
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-2xl w-full">
        <div className="mb-12 text-center">
          <kbd className="font-mono-feorm text-[10px] border border-[#3C2F1A]/20 bg-[#FEFDFB] px-2 py-1 rounded text-[#787774] mb-6 inline-block">
            THE FEORM CHOICE
          </kbd>
          <h2 className="font-serif-display text-3xl md:text-4xl mb-4 text-[#1E1A14]">
            How will you use the network?
          </h2>
          <p className="text-sm text-[#787774]">
            Your role shapes your marketplace experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => handleRoleSelect("explorer")}
            className="p-8 md:p-12 text-left border-2 border-[#3C2F1A]/10 rounded-[8px] transition-all hover:border-[#1E1A14] bg-[#FEFDFB]"
          >
            <div className="w-12 h-12 rounded-full bg-[#FBF3DB] flex items-center justify-center mb-6">
              <MapPin size={20} className="text-[#956400]" />
            </div>
            <h3 className="font-serif-display text-2xl mb-3 text-[#1E1A14]">
              I want to Explore
            </h3>
            <p className="text-sm text-[#787774] leading-relaxed">
              Discover farm stays and rent equipment across the Namibian landscape.
              Tourist, researcher, or seasonal renter.
            </p>
          </button>

          <button
            onClick={() => handleRoleSelect("lister")}
            className="p-8 md:p-12 text-left border-2 border-[#3C2F1A]/10 rounded-[8px] transition-all hover:border-[#1E1A14] bg-[#FEFDFB]"
          >
            <div className="w-12 h-12 rounded-full bg-[#EDF3EC] flex items-center justify-center mb-6">
              <Shield size={20} className="text-[#346538]" />
            </div>
            <h3 className="font-serif-display text-2xl mb-3 text-[#1E1A14]">
              I want to List
            </h3>
            <p className="text-sm text-[#787774] leading-relaxed">
              List your farmland, accommodation, or equipment for the community.
              Farmer, landowner, or equipment provider.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
