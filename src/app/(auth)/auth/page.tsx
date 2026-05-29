"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFeormAuth } from "@/context/feorm-context";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AuthPage() {
  const { phone, setPhone } = useFeormAuth();
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
      <div className="relative bg-earth overflow-hidden md:min-h-screen min-h-[35vh]">
        <Image
          src="/images/hero-gateway.png"
          alt="Namibian horizon"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover opacity-60 saturate-[0.6]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth via-earth/60 to-transparent md:bg-gradient-to-r md:from-transparent md:via-earth/40 md:to-earth" />
        <div className="relative z-10 flex flex-col justify-between h-full p-10 md:p-20">
          <div className="reveal">
            <h1 className="font-serif-display text-5xl md:text-7xl mb-2 italic lowercase text-white-feorm">
              feorm<span className="text-harvest">.</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-sand font-mono-feorm">
              Namibian Farmland Marketplace
            </p>
          </div>
          <div className="reveal delay-1">
            <h1 className="font-serif-display text-3xl md:text-5xl mb-4 text-white-feorm leading-tight max-w-md">
              Stay on a Farm. Rent a Tractor.
            </h1>
            <p className="text-sm text-sand max-w-sm leading-relaxed">
              Book farm stays and rent farming equipment from Namibian landowners.
              Escrow-protected. N$10,000 damage cover. Verified hosts only.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Phone Auth */}
      <div className="bg-fog flex items-center justify-center p-10 md:p-20">
        <div className="w-full max-w-sm reveal delay-2">
          <div className="mb-12">
            <kbd className="font-mono-feorm text-[10px] border border-soil/20 bg-white-feorm px-2 py-1 rounded text-muted-foreground mb-6 inline-block">
              STEP 1 OF 2
            </kbd>
            <h1 className="font-serif-display text-3xl mb-3 text-earth tracking-tight">
              Enter Your Number
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We will send a 6-digit code to verify your number. No password needed.
            </p>
          </div>

          <div className="space-y-6">
            <div className="border border-soil/20 bg-white-feorm p-4 rounded-[4px] focus-within:border-earth transition-colors">
              <label
                htmlFor="phone-input"
                className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-muted-foreground"
              >
                Mobile Number
              </label>
              <div className="flex items-center">
                <span className="font-mono-feorm text-lg mr-3 text-soil" aria-hidden="true">
                  +264
                </span>
                <input
                  id="phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="81 000 0000"
                  autoComplete="tel-national"
                  className="w-full bg-transparent outline-none text-lg text-earth placeholder-sand font-mono-feorm"
                />
              </div>
            </div>
            <button
              onClick={handleRequestOtp}
              disabled={!phone || phone.length < 8 || loading}
              className="w-full btn-primary-feorm px-5 py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              {loading ? "Sending..." : "Send Verification Code"}
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 p-4 bg-accent/30 border border-harvest/20 rounded-[4px]" role="note">
            <p className="text-[10px] text-accent-foreground font-mono-feorm uppercase tracking-wide">
              Demo Mode: Enter any number, then use OTP <strong>123456</strong>
            </p>
          </div>

          <p className="mt-8 text-[10px] text-muted-foreground uppercase tracking-wide leading-relaxed">
            By continuing, you agree to the{" "}
            <Link
              href="/auth/terms"
              className="border-b border-muted-foreground pb-0.5 hover:text-earth transition-colors"
            >
              Terms of Service
            </Link>{" "}
            to continue.
          </p>
        </div>
      </div>
    </div>
  );
}
