"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFeormOnboarding } from "@/context/feorm-context";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

const STAY_TYPES = [
  "Bush Camp",
  "Farmhouse",
  "Tent Camp",
  "Safari Lodge",
  "Homestay",
] as const;

export default function ProviderStayPropertyPage() {
  const { setHasCompletedOnboarding } = useFeormOnboarding();
  const [stayType, setStayType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const router = useRouter();

  const handleContinue = () => {
    router.push("/auth/provider/stay/verify");
  };

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
          onClick={() => router.push("/auth/provider/stay/profile")}
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
          <div className="w-2 h-2 rounded-full bg-white/30" />
        </div>

        <h1 className="font-serif-display text-3xl md:text-4xl mb-3 text-white tracking-tight">
          Your property
        </h1>
        <p className="text-sm text-white/60 leading-relaxed mb-8">
          Describe your farm stay so voyagers know what to expect.
        </p>

        <div className="space-y-4">
          {/* Type of Stay */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest mb-3 text-white/60">
              Type of Stay *
            </p>
            <div className="flex flex-wrap gap-2">
              {STAY_TYPES.map((type) => {
                const isSelected = stayType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setStayType(type)}
                    className="px-4 py-2.5 rounded-full text-xs uppercase tracking-widest font-medium transition-all duration-200 min-h-[44px]"
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
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Capacity */}
          <div
            className="p-4 rounded-[8px]"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <label
              htmlFor="stay-capacity"
              className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-white/60"
            >
              Approximate Capacity (guests)
            </label>
            <input
              id="stay-capacity"
              type="number"
              min="1"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g. 8"
              className="w-full bg-transparent outline-none text-lg text-white placeholder-white/30 font-mono-feorm"
            />
          </div>

          {/* Description */}
          <div
            className="p-4 rounded-[8px]"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <label
              htmlFor="stay-desc"
              className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-white/60"
            >
              Brief Description
            </label>
            <textarea
              id="stay-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your farm stay, surroundings, and what makes it special..."
              rows={3}
              className="w-full bg-transparent outline-none text-sm text-white placeholder-white/30 leading-relaxed resize-none"
            />
          </div>

          {/* GPS Coordinates */}
          <div
            className="p-4 rounded-[8px]"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <p className="text-[10px] font-medium uppercase tracking-widest mb-2 text-white/60">
              GPS Coordinates (Optional)
            </p>
            <p className="text-[9px] text-white/40 mb-3">
              Helps voyagers find you on the map. You can find these in Google Maps by right-clicking your location.
            </p>
            <div className="flex gap-3">
              <div className="flex-1">
                <label htmlFor="stay-lat" className="text-[9px] text-white/40 uppercase tracking-widest mb-1 block">
                  Latitude
                </label>
                <input
                  id="stay-lat"
                  type="text"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="-22.5609"
                  className="w-full bg-transparent outline-none text-sm text-white placeholder-white/30 font-mono-feorm"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="stay-lng" className="text-[9px] text-white/40 uppercase tracking-widest mb-1 block">
                  Longitude
                </label>
                <input
                  id="stay-lng"
                  type="text"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  placeholder="17.0658"
                  className="w-full bg-transparent outline-none text-sm text-white placeholder-white/30 font-mono-feorm"
                />
              </div>
            </div>
          </div>

          {/* Continue */}
          <button
            onClick={handleContinue}
            disabled={!stayType}
            className="w-full px-5 py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] rounded-full font-semibold"
            style={{ backgroundColor: "#C4933A", color: "#1E1A14" }}
          >
            Continue
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
