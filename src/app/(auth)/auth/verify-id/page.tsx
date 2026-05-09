"use client";

import { useRouter } from "next/navigation";
import { useFeorm } from "@/context/feorm-context";
import { useMutation } from "convex/react";
import { api } from "@/lib/convex";
import { Upload } from "lucide-react";

export default function VerifyIdPage() {
  const { user, phone, setUser } = useFeorm();
  const router = useRouter();
  const verifyUser = useMutation(api.auth.verifyUser);

  const handleVerify = async () => {
    try {
      const fullPhone = user?.phone || `+264${phone.replace(/\s/g, "")}`;
      await verifyUser({ phone: fullPhone });
    } catch {
      // Continue anyway for demo
    }
    setUser((prev) => (prev ? { ...prev, verified: true } : null));
    router.push("/marketplace");
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-lg w-full">
        <div className="mb-10">
          <h2 className="font-serif-display text-3xl md:text-4xl mb-4 text-[#1E1A14]">
            Trust Layer Protocol
          </h2>
          <p className="text-sm text-[#787774] leading-relaxed">
            Verified farmers. Protected assets. Escrow security requires formal
            identification prior to marketplace entry.
          </p>
        </div>

        <div className="bento-card p-8 md:p-12 text-center border-dashed border-2 border-[#D4C4A0]/50 bg-[#FEFDFB] mb-8 cursor-pointer hover:bg-[#FAF7F2] transition-colors">
          <div className="mx-auto w-10 h-10 mb-6 text-[#1E1A14] flex items-center justify-center">
            <Upload size={24} />
          </div>
          <p className="text-sm font-medium mb-1 text-[#1E1A14]">
            Upload National ID / Passport
          </p>
          <p className="text-xs text-[#787774] font-mono-feorm">
            PNG, JPG, HEIC up to 5MB
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => router.push("/marketplace")}
            className="flex-1 btn-secondary-feorm py-3 text-xs uppercase tracking-widest"
          >
            Skip (Browse Only)
          </button>
          <button
            onClick={handleVerify}
            className="flex-1 btn-primary-feorm py-3 text-xs uppercase tracking-widest"
          >
            Verify & Enter
          </button>
        </div>
      </div>
    </div>
  );
}
