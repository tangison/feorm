"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

const EQUIPMENT_TYPES = [
  "Tractors",
  "Irrigation",
  "Power",
  "Transport",
  "Processing",
  "Other",
] as const;

export default function ProviderEquipmentAssetsPage() {
  const [equipmentType, setEquipmentType] = useState("");
  const [units, setUnits] = useState("");
  const [offerOperator, setOfferOperator] = useState(false);
  const [offerDelivery, setOfferDelivery] = useState(false);
  const [serviceRadius, setServiceRadius] = useState(50);
  const router = useRouter();

  const handleContinue = () => {
    router.push("/auth/provider/equipment/verify");
  };

  return (
    <div className="relative flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen">
      {/* Full bleed background */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/listing-equip-hero.png"
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
          onClick={() => router.push("/auth/provider/equipment/profile")}
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
          Your equipment
        </h1>
        <p className="text-sm text-white/60 leading-relaxed mb-8">
          Tell us about the equipment you want to list for rent.
        </p>

        <div className="space-y-4">
          {/* Equipment Type */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest mb-3 text-white/60">
              Primary Equipment Type *
            </p>
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT_TYPES.map((type) => {
                const isSelected = equipmentType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setEquipmentType(type)}
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

          {/* Number of Units */}
          <div
            className="p-4 rounded-[8px]"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <label
              htmlFor="equip-units"
              className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-white/60"
            >
              Number of Units Available
            </label>
            <input
              id="equip-units"
              type="number"
              min="1"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              placeholder="e.g. 3"
              className="w-full bg-transparent outline-none text-lg text-white placeholder-white/30 font-mono-feorm"
            />
          </div>

          {/* Operator Toggle */}
          <div
            className="p-4 rounded-[8px] flex items-center justify-between"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div>
              <p className="text-sm text-white">Do you offer an operator?</p>
              <p className="text-xs text-white/50">A trained person to operate the equipment</p>
            </div>
            <button
              onClick={() => setOfferOperator(!offerOperator)}
              className={`w-12 h-7 rounded-full transition-colors duration-200 relative shrink-0 ml-3 ${
                offerOperator ? "bg-verified" : "bg-white/20"
              }`}
              role="switch"
              aria-checked={offerOperator}
              aria-label="Offer operator"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform duration-200 ${
                  offerOperator ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Delivery Toggle */}
          <div
            className="p-4 rounded-[8px] flex items-center justify-between"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div>
              <p className="text-sm text-white">Do you offer delivery?</p>
              <p className="text-xs text-white/50">Transport equipment to the renter</p>
            </div>
            <button
              onClick={() => setOfferDelivery(!offerDelivery)}
              className={`w-12 h-7 rounded-full transition-colors duration-200 relative shrink-0 ml-3 ${
                offerDelivery ? "bg-verified" : "bg-white/20"
              }`}
              role="switch"
              aria-checked={offerDelivery}
              aria-label="Offer delivery"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-transform duration-200 ${
                  offerDelivery ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Service Radius Slider */}
          <div
            className="p-4 rounded-[8px]"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <label
                htmlFor="equip-radius"
                className="text-[10px] font-medium uppercase tracking-widest text-white/60"
              >
                Service Radius
              </label>
              <span className="font-mono-feorm text-sm text-harvest font-medium">
                {serviceRadius} km
              </span>
            </div>
            <input
              id="equip-radius"
              type="range"
              min="0"
              max="500"
              value={serviceRadius}
              onChange={(e) => setServiceRadius(parseInt(e.target.value))}
              className="w-full accent-harvest"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-white/30 font-mono-feorm">0 km</span>
              <span className="text-[9px] text-white/30 font-mono-feorm">500 km</span>
            </div>
          </div>

          {/* Continue */}
          <button
            onClick={handleContinue}
            disabled={!equipmentType}
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
