"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFeorm } from "@/context/feorm-context";
import { useAuthMutations } from "@/hooks/use-auth";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function VerifyPage() {
  const { phone, setUser } = useFeorm();
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Auth mutations with REST primary + demo fallback
  const { verifyOtp } = useAuthMutations();

  const handleVerifyOtp = async () => {
    if (otp !== "123456") {
      setOtpError("Invalid code. Demo: use 123456");
      return;
    }
    setLoading(true);
    setOtpError("");
    try {
      const fullPhone = `+264${phone.replace(/\s/g, "")}`;
      const result = await verifyOtp(fullPhone, otp);
      if (result.success) {
        setUser({
          id: result.userId || "demo-user",
          phone: fullPhone,
          role: "explorer",
          verified: false,
        });
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
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-md w-full">
        <button
          onClick={() => router.push("/")}
          className="mb-8 flex items-center gap-2 text-sm text-[#787774] hover:text-[#1E1A14] transition-colors min-h-[44px]"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="mb-10">
          <kbd className="font-mono-feorm text-[10px] border border-[#3C2F1A]/20 bg-[#FEFDFB] px-2 py-1 rounded text-[#787774] mb-6 inline-block">
            VERIFICATION PROTOCOL
          </kbd>
          <h2 className="font-serif-display text-3xl md:text-4xl mb-4 text-[#1E1A14]">
            Trust Layer
          </h2>
          <p className="text-sm text-[#787774] leading-relaxed">
            Enter the 6-digit code sent to +264{phone}
          </p>
        </div>

        <div className="space-y-6">
          <div className="border border-[#3C2F1A]/20 bg-[#FEFDFB] p-4 rounded-[4px] focus-within:border-[#1E1A14] transition-colors">
            <label htmlFor="otp-input" className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-[#787774]">
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
              className="w-full bg-transparent outline-none text-2xl text-[#1E1A14] placeholder-[#D4C4A0] font-mono-feorm tracking-[0.3em] min-h-[44px]"
            />
          </div>

          {otpError && (
            <p id="otp-error" role="alert" className="text-xs text-[#9F2F2D] font-mono-feorm">{otpError}</p>
          )}

          <button
            onClick={handleVerifyOtp}
            disabled={otp.length !== 6 || loading}
            className="w-full btn-primary-feorm px-5 py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {loading ? "Verifying..." : "Verify & Enter"}
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="mt-6 p-4 bg-[#FBF3DB]/30 border border-[#E8C96A]/20 rounded-[4px]" role="note">
          <p className="text-[10px] text-[#956400] font-mono-feorm uppercase tracking-wide">
            Demo Mode: Use OTP <strong>123456</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
