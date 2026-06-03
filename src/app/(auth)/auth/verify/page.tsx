"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFeormAuth } from "@/context/feorm-context";
import { useAuthMutations } from "@/hooks/use-auth";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function VerifyPage() {
  const { phone, setUser } = useFeormAuth();
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Auth mutations — Supabase Auth
  const { verifyOtp } = useAuthMutations();

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError("Please enter the full 6-digit code");
      return;
    }
    setLoading(true);
    setOtpError("");
    try {
      const fullPhone = `+264${phone.replace(/\s/g, "")}`;
      const result = await verifyOtp(fullPhone, otp);
      if (result.success) {
        // Supabase Auth session is now active — the auth context
        // will pick it up via onAuthStateChange
        if (result.isNewUser) {
          router.push("/auth/identity");
        } else {
          router.push("/marketplace");
        }
        return;
      } else {
        setOtpError(result.error || "Verification failed");
      }
    } catch (err: any) {
      setOtpError(err.message || "Verification failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-fog">
      <div className="max-w-md w-full">
        <button
          onClick={() => router.push("/")}
          className="mb-8 flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-earth transition-colors min-h-[44px] rounded-full hover:bg-earth/5"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="mb-10">
          <kbd className="font-mono-feorm text-[10px] border border-soil/20 bg-white-feorm px-2 py-1 rounded text-muted-foreground mb-6 inline-block">
            STEP 2 OF 2
          </kbd>
          <h1 className="font-serif-display text-3xl md:text-4xl mb-4 text-earth">
            Verify Your Number
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Enter the 6-digit code we sent to +264{phone}
          </p>
        </div>

        <div className="space-y-6">
          <div className="border border-soil/20 bg-white-feorm p-4 rounded-[4px] focus-within:border-earth transition-colors">
            <label htmlFor="otp-input" className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-muted-foreground">
              Verification Code
            </label>
            <input
              id="otp-input"
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                setOtpError("");
              }}
              placeholder="123456"
              maxLength={6}
              aria-invalid={otpError ? "true" : undefined}
              aria-describedby={otpError ? "otp-error" : undefined}
              className="w-full bg-transparent outline-none text-2xl text-earth placeholder-sand font-mono-feorm tracking-[0.3em] min-h-[44px]"
            />
          </div>

          {otpError && (
            <p id="otp-error" role="alert" className="text-xs text-destructive font-mono-feorm">{otpError}</p>
          )}

          <button
            onClick={handleVerifyOtp}
            disabled={otp.length !== 6 || loading}
            className="w-full btn-primary-feorm px-5 py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="mt-6 p-4 bg-accent/30 border border-harvest/20 rounded-[4px]" role="note">
          <p className="text-[10px] text-accent-foreground font-mono-feorm uppercase tracking-wide">
            A 6-digit code has been sent to your phone
          </p>
        </div>
      </div>
    </div>
  );
}
