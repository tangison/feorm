"use client";

import { useFeormAuth, useFeormOnboarding } from "@/context/feorm-context";
import { useRouter } from "next/navigation";
import { Compass, Tent } from "lucide-react";
import Image from "next/image";

const ROLE_CARDS = [
  {
    id: "voyager" as const,
    icon: Compass,
    title: "I want to find and book farm stays",
    subtitle: "Traveler",
    description:
      "Browse verified farm stays across Namibia. Book with escrow protection so your money is safe until you arrive.",
    route: "/auth/voyager/profile",
    hoverBorder: "hover:border-harvest",
    hoverShadow: "hover:shadow-[0_8px_32px_rgba(232,201,106,0.08)]",
    iconBg: "bg-accent group-hover:bg-harvest",
    iconColor: "text-accent-foreground group-hover:text-earth",
    subtitleColor: "text-harvest",
  },
  {
    id: "provider_stay" as const,
    icon: Tent,
    title: "I have a farm stay to offer",
    subtitle: "Farm Host",
    description:
      "List your farm accommodation — bush camps, farmhouses, tent camps, lodges, or homestays. Earn income with escrow-protected payouts.",
    route: "/auth/provider/stay/profile",
    hoverBorder: "hover:border-verified",
    hoverShadow: "hover:shadow-[0_8px_32px_rgba(52,101,56,0.08)]",
    iconBg: "bg-verified-bg group-hover:bg-verified",
    iconColor: "text-verified group-hover:text-white-feorm",
    subtitleColor: "text-verified",
  },

] as const;

export default function RolePage() {
  const { setUser } = useFeormAuth();
  const { setSelectedRole } = useFeormOnboarding();
  const router = useRouter();

  const handleRoleSelect = (role: "voyager" | "provider_stay", route: string) => {
    setSelectedRole(role);
    setUser((prev: any) => (prev ? { ...prev, role } : null));
    router.push(route);
  };

  return (
    <div className="relative flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen">
      {/* Full bleed background */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/onboard-role-bg.png"
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

      <div className="max-w-3xl w-full relative z-10">
        {/* Feorm Logo */}
        <div className="text-center mb-10">
          <Image
            src="/feorm-logo.png"
            alt="Feorm"
            width={40}
            height={40}
            className="mx-auto mb-4 rounded-[4px]"
          />
          <h1 className="font-serif-display text-3xl md:text-5xl mb-4 text-white tracking-tight">
            What brings you to Feorm?
          </h1>
          <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed">
            Choose how you want to use Feorm. You can change this later in Settings.
          </p>
        </div>

        {/* Progress dots — step 1 of 1 for role selection */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-harvest" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {ROLE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id + card.title}
                onClick={() =>
                  handleRoleSelect(
                    card.id,
                    card.route
                  )
                }
                className={`group p-6 md:p-8 text-left border transition-all duration-300 ${card.hoverBorder} ${card.hoverShadow} active:scale-[0.98]`}
                style={{
                  background: "rgba(255,255,255,0.12)",
                  borderColor: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                  borderRadius: "12px",
                }}
              >
                <div
                  className={`w-12 h-12 rounded-[10px] ${card.iconBg} flex items-center justify-center mb-5 transition-colors duration-300`}
                >
                  <Icon
                    size={22}
                    className={`${card.iconColor} transition-colors`}
                  />
                </div>
                <h3 className="font-serif-display text-xl md:text-2xl mb-2 text-white">
                  {card.title}
                </h3>
                <p
                  className={`text-[10px] uppercase tracking-widest ${card.subtitleColor} font-mono-feorm font-medium mb-3`}
                >
                  {card.subtitle}
                </p>
                <p className="text-sm text-white/60 leading-relaxed">
                  {card.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
