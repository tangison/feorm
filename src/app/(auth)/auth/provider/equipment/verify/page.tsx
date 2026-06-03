"use client";

import { useRouter } from "next/navigation";
import { useFeormOnboarding, useFeormAuth } from "@/context/feorm-context";
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Shield } from "lucide-react";
import Image from "next/image";

export default function ProviderEquipmentVerifyPage() {
  const { setHasCompletedOnboarding } = useFeormOnboarding();
  const { user } = useFeormAuth();
  const router = useRouter();

  const handleContinue = () => {
    setHasCompletedOnboarding(true);
    router.push("/dashboard");
  };

  return (
    <div className="relative flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen">
      {/* Full bleed background */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/banner-stays.png"
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
          onClick={() => router.push("/auth/provider/equipment/assets")}
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
          <div className="w-2 h-2 rounded-full bg-white/30" />
          <div className="w-2 h-2 rounded-full bg-harvest" />
        </div>

        <h1 className="font-serif-display text-3xl md:text-4xl mb-3 text-white tracking-tight">
          Verification Notice
        </h1>
        <p className="text-sm text-white/60 leading-relaxed mb-8">
          Your equipment listing will be reviewed before going live. This usually takes 24–48 hours. You will receive an email once approved.
        </p>

        <div className="space-y-4 mb-8">
          {/* Status */}
          <div
            className="p-5 rounded-[8px] flex items-center gap-3"
            style={{
              background: "rgba(196,147,58,0.15)",
              border: "1px solid rgba(196,147,58,0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Clock size={20} className="text-harvest shrink-0" />
            <div>
              <p className="text-sm font-medium text-white">Pending Verification</p>
              <p className="text-xs text-white/50">We are reviewing your equipment listing</p>
            </div>
          </div>

          {/* Requirements */}
          <div
            className="p-5 rounded-[8px]"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <p className="text-[10px] font-medium uppercase tracking-widest mb-4 text-white/60">
              What verification requires
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle size={16} className="text-verified shrink-0 mt-0.5" />
                <p className="text-sm text-white/80">Valid Namibian ID or passport</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={16} className="text-verified shrink-0 mt-0.5" />
                <p className="text-sm text-white/80">Proof of equipment ownership or lease</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={16} className="text-verified shrink-0 mt-0.5" />
                <p className="text-sm text-white/80">At least 3 photos of your equipment</p>
              </div>
            </div>
          </div>

          {/* Info notice */}
          <div
            className="p-4 rounded-[8px] flex items-start gap-3"
            style={{
              background: "rgba(52,101,56,0.15)",
              border: "1px solid rgba(52,101,56,0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Shield size={16} className="text-verified shrink-0 mt-0.5" />
            <p className="text-xs text-white/70 leading-relaxed">
              Verified providers earn more trust from farmers. You can submit your verification documents from your dashboard at any time.
            </p>
          </div>
        </div>

        {/* Continue to Dashboard */}
        <button
          onClick={handleContinue}
          className="w-full px-5 py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 min-h-[44px] rounded-full font-semibold"
          style={{ backgroundColor: "#C4933A", color: "#1E1A14" }}
        >
          Continue to Dashboard
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
