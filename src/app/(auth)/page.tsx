"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFeorm } from "@/context/feorm-context";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AuthPage() {
  const { phone, setPhone } = useFeorm();
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const router = useRouter();

  const handleRequestOtp = async () => {
    if (!phone || phone.length < 8) return;
    setLoading(true);
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request-otp",
          phone: `+264${phone.replace(/\s/g, "")}`,
        }),
      });
    } catch {
      // Demo mode: proceed anyway
    }
    setTransitioning(true);
    setTimeout(() => {
      router.push("/auth/verify");
    }, 300);
  };

  return (
    <div
      className={`flex-grow grid md:grid-cols-2 min-h-screen transition-all duration-300 ease-out ${
        transitioning
          ? "opacity-0 scale-[0.98] blur-[2px]"
          : "opacity-100 scale-100 blur-0"
      }`}
    >
      {/* Left: Desaturated Hero Image */}
      <div className="relative bg-[#1E1A14] overflow-hidden md:min-h-screen min-h-[35vh]">
        <Image
          src="/images/hero-gateway.png"
          alt="Namibian horizon"
          fill
          className="object-cover opacity-60 saturate-[0.6]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1A14] via-[#1E1A14]/60 to-transparent md:bg-gradient-to-r md:from-transparent md:via-[#1E1A14]/40 md:to-[#1E1A14]" />
        <div className="relative z-10 flex flex-col justify-between h-full p-10 md:p-20">
          <div className="reveal">
            <h1 className="font-serif-display text-5xl md:text-7xl mb-2 italic lowercase text-[#FEFDFB]">
              feorm<span className="text-[#E8C96A]">.</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4C4A0] font-mono-feorm">
              Network 0.1
            </p>
          </div>
          <div className="reveal delay-1">
            <h2 className="font-serif-display text-3xl md:text-5xl mb-4 text-[#FEFDFB] leading-tight max-w-md">
              Provision of the Land.
            </h2>
            <p className="text-sm text-[#D4C4A0] max-w-sm leading-relaxed">
              A decentralized marketplace connecting Namibian farmland with those
              who require its provisions and equipment.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Phone Auth */}
      <div className="bg-[#FAF7F2] flex items-center justify-center p-10 md:p-20">
        <div className="w-full max-w-sm reveal delay-2">
          <div className="mb-12">
            <kbd className="font-mono-feorm text-[10px] border border-[#3C2F1A]/20 bg-[#FEFDFB] px-2 py-1 rounded text-[#787774] mb-6 inline-block">
              SECURE GATEWAY
            </kbd>
            <h2 className="font-serif-display text-3xl mb-3 text-[#1E1A14] tracking-tight">
              Initialize Connection
            </h2>
            <p className="text-sm text-[#787774] leading-relaxed">
              Access the communal marketplace via verified mobile credential.
            </p>
          </div>

          <div className="space-y-6">
            <div className="border border-[#3C2F1A]/20 bg-[#FEFDFB] p-4 rounded-[4px] focus-within:border-[#1E1A14] transition-colors">
              <label
                htmlFor="phone-input"
                className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-[#787774]"
              >
                Mobile Number
              </label>
              <div className="flex items-center">
                <span className="font-mono-feorm text-lg mr-3 text-[#3C2F1A]" aria-hidden="true">
                  +264
                </span>
                <input
                  id="phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="81 000 0000"
                  autoComplete="tel-national"
                  className="w-full bg-transparent outline-none text-lg text-[#1E1A14] placeholder-[#D4C4A0] font-mono-feorm"
                />
              </div>
            </div>
            <button
              onClick={handleRequestOtp}
              disabled={!phone || phone.length < 8 || loading}
              className="w-full btn-primary-feorm px-5 py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              {loading ? "Requesting..." : "Initialize Connection"}
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 p-4 bg-[#FBF3DB]/30 border border-[#E8C96A]/20 rounded-[4px]" role="note">
            <p className="text-[10px] text-[#956400] font-mono-feorm uppercase tracking-wide">
              Demo Mode: Enter any number, then use OTP <strong>123456</strong>
            </p>
          </div>

          <p className="mt-8 text-[10px] text-[#787774] uppercase tracking-wide leading-relaxed">
            By continuing, you agree to the{" "}
            <Link
              href="/auth/terms"
              className="border-b border-[#787774] pb-0.5 hover:text-[#1E1A14] transition-colors"
            >
              Communal Ethic
            </Link>{" "}
            and standard terms of service.
          </p>
        </div>
      </div>
    </div>
  );
}
