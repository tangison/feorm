"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useFeormAuth, useFeormOnboarding } from "@/context/feorm-context";
import { useAuthMutations } from "@/hooks/use-auth";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { NAMIBIAN_REGIONS } from "@/lib/regions";
import Image from "next/image";

export default function ProviderStayProfilePage() {
  const { user, setUser } = useFeormAuth();
  const { setSelectedRole } = useFeormOnboarding();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [farmName, setFarmName] = useState("");
  const [region, setRegion] = useState(user?.region || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setupIdentity } = useAuthMutations();

  const handleContinue = useCallback(async () => {
    if (!name || !phone) return;
    setLoading(true);
    try {
      setSelectedRole("provider_stay");
      const userId = user?.id;
      if (userId) {
        await setupIdentity({
          userId,
          name,
          phone: `+264${phone.replace(/\s/g, "")}`,
          region,
          role: "provider_stay",
        });
      }
      setUser((prev: any) =>
        prev
          ? { ...prev, name, phone, region, role: "provider_stay" as const }
          : null
      );
      router.push("/auth/provider/stay/property");
    } catch {
      router.push("/auth/provider/stay/property");
    }
    setLoading(false);
  }, [name, phone, region, user, setupIdentity, setUser, setSelectedRole, router]);

  return (
    <div className="relative flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen">
      {/* Full bleed background */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/listing-stay-hero.png"
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

      <div className="max-w-md w-full relative z-10">
        {/* Back button */}
        <button
          onClick={() => router.push("/auth/role")}
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
          <div className="w-2 h-2 rounded-full bg-harvest" />
          <div className="w-2 h-2 rounded-full bg-white/30" />
          <div className="w-2 h-2 rounded-full bg-white/30" />
        </div>

        <h1 className="font-serif-display text-3xl md:text-4xl mb-3 text-white tracking-tight">
          About You
        </h1>
        <p className="text-sm text-white/60 leading-relaxed mb-8">
          Tell us about yourself and your farm. Voyagers want to know who is hosting them.
        </p>

        <div className="space-y-4">
          {/* Full Name */}
          <div
            className="p-4 rounded-[8px]"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <label
              htmlFor="stay-name"
              className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-white/60"
            >
              Full Name *
            </label>
            <input
              id="stay-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Johan Deetlefs"
              autoComplete="name"
              className="w-full bg-transparent outline-none text-lg text-white placeholder-white/30"
            />
          </div>

          {/* Phone */}
          <div
            className="p-4 rounded-[8px]"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <label
              htmlFor="stay-phone"
              className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-white/60"
            >
              Phone Number *
            </label>
            <div className="flex items-center">
              <span className="font-mono-feorm text-lg mr-3 text-white/50" aria-hidden="true">
                +264
              </span>
              <input
                id="stay-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="81 000 0000"
                autoComplete="tel-national"
                className="w-full bg-transparent outline-none text-lg text-white placeholder-white/30 font-mono-feorm"
              />
            </div>
          </div>

          {/* Farm/Business Name */}
          <div
            className="p-4 rounded-[8px]"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <label
              htmlFor="stay-farm"
              className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-white/60"
            >
              Farm / Business Name
            </label>
            <input
              id="stay-farm"
              type="text"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              placeholder="Erongo Granite Lodge"
              className="w-full bg-transparent outline-none text-lg text-white placeholder-white/30"
            />
          </div>

          {/* Region */}
          <div
            className="p-4 rounded-[8px]"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <label
              htmlFor="stay-region"
              className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-white/60"
            >
              Region
            </label>
            <select
              id="stay-region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-transparent outline-none text-lg text-white min-h-[44px]"
            >
              <option value="" className="text-earth">Select your region</option>
              {NAMIBIAN_REGIONS.map((r) => (
                <option key={r} value={r} className="text-earth">{r}</option>
              ))}
            </select>
          </div>

          {/* Continue */}
          <button
            onClick={handleContinue}
            disabled={!name || !phone || loading}
            className="w-full px-5 py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] rounded-full font-semibold"
            style={{ backgroundColor: "#C4933A", color: "#1E1A14" }}
          >
            {loading ? "Saving..." : "List My Stay"}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
