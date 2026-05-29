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
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-fog">
      <div className="max-w-3xl w-full">
        <div className="mb-12 text-center">
          <kbd className="font-mono-feorm text-[10px] border border-soil/20 bg-white-feorm px-2 py-1 rounded text-muted-foreground mb-6 inline-block">
            CHOOSE YOUR ROLE
          </kbd>
          <h1 className="font-serif-display text-3xl md:text-5xl mb-4 text-earth tracking-tight">
            How will you use the land?
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Pick the role that fits. You can change it later in Settings. 
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Voyager Card */}
          <button
            onClick={() => handleRoleSelect("voyager")}
            className="group p-8 md:p-10 text-left border-2 border-soil/10 rounded-[12px] transition-all duration-300 hover:border-harvest hover:shadow-[0_8px_32px_rgba(232,201,106,0.08)] bg-white-feorm active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-[12px] bg-accent flex items-center justify-center mb-6 group-hover:bg-harvest transition-colors duration-300">
              <Compass size={24} className="text-accent-foreground group-hover:text-earth transition-colors" />
            </div>
            <h3 className="font-serif-display text-2xl md:text-3xl mb-3 text-earth">
              I am a Voyager
            </h3>
            <p className="text-[10px] uppercase tracking-widest text-harvest font-mono-feorm font-medium mb-4">
              Guest / Traveler
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              Find farm stays, rent equipment, and experience real Namibian agrotourism. Your booking is protected by escrow and N$10,000 damage cover.
            </p>
            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-earth transition-colors">
              <span className="font-mono-feorm text-[10px] uppercase tracking-widest font-medium">
                Explore listings
              </span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </button>

          {/* Provider Card */}
          <button
            onClick={() => handleRoleSelect("provider")}
            className="group p-8 md:p-10 text-left border-2 border-soil/10 rounded-[12px] transition-all duration-300 hover:border-[#346538] hover:shadow-[0_8px_32px_rgba(52,101,56,0.08)] bg-white-feorm active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-[12px] bg-[#EDF3EC] flex items-center justify-center mb-6 group-hover:bg-[#346538] transition-colors duration-300">
              <Tractor size={24} className="text-[#346538] group-hover:text-white-feorm transition-colors" />
            </div>
            <h3 className="font-serif-display text-2xl md:text-3xl mb-3 text-earth">
              I am a Provider
            </h3>
            <p className="text-[10px] uppercase tracking-widest text-[#346538] font-mono-feorm font-medium mb-4">
              Host / Farmer
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              List your farmland, accommodation, or machinery and earn income. Escrow protection and verified bookings keep every transaction safe.
            </p>
            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-earth transition-colors">
              <span className="font-mono-feorm text-[10px] uppercase tracking-widest font-medium">
                Start earning
              </span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
