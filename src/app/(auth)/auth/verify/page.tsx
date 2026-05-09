"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFeorm } from "@/context/feorm-context";
import { useMutation } from "convex/react";
import { api } from "@/lib/convex";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function VerifyPage() {
  const { phone, setUser } = useFeorm();
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Convex mutation for OTP verification
  const verifyOtp = useMutation(api.auth.verifyOtp);

  const handleVerifyOtp = async () => {
    if (otp !== "123456") {
      setOtpError("Invalid code. Demo: use 123456");
      return;
    }
    setLoading(true);
    setOtpError("");
    try {
      const fullPhone = `+264${phone.replace(/\s/g, "")}`;
      const result = await verifyOtp({ phone: fullPhone, otp });
      if (result.success) {
        setUser({
          id: result.userId,
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
          className="mb-8 flex items-center gap-2 text-sm text-[#787774] hover:text-[#1E1A14] transition-colors"
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
            <label className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-[#787774]">
              Verification Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                setOtpError("");
              }}
              placeholder="123456"
              maxLength={6}
              className="w-full bg-transparent outline-none text-2xl text-[#1E1A14] placeholder-[#D4C4A0] font-mono-feorm tracking-[0.3em]"
            />
          </div>

          {otpError && (
            <p className="text-xs text-[#9F2F2D] font-mono-feorm">{otpError}</p>
          )}

          <button
            onClick={handleVerifyOtp}
            disabled={otp.length !== 6 || loading}
            className="w-full btn-primary-feorm py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify & Enter"}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
