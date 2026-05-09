"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFeorm } from "@/context/feorm-context";
import { useAuthMutations } from "@/hooks/use-auth";
import { ArrowLeft, ArrowRight } from "lucide-react";

const regions = [
  "Khomas", "Otjozondjupa", "Erongo", "Hardap", "Omaheke",
  "Karas", "Kunene", "Ohangwena", "Oshana", "Oshikoto",
  "Zambezi", "Kavango East", "Kavango West",
];

export default function IdentityPage() {
  const { phone, setUser } = useFeorm();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [region, setRegion] = useState("Khomas");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { setupIdentity } = useAuthMutations();

  const handleIdentitySetup = async () => {
    if (!name || !surname) return;
    setLoading(true);
    try {
      const fullPhone = `+264${phone.replace(/\s/g, "")}`;
      await setupIdentity({
        phone: fullPhone,
        name,
        surname,
        region,
        role: "explorer",
      });
      setUser((prev) =>
        prev
          ? { ...prev, name, surname, region }
          : {
              id: "demo",
              phone: fullPhone,
              name,
              surname,
              region,
              role: "explorer",
              verified: false,
            }
      );
      router.push("/auth/role");
    } catch {
      // Continue anyway for demo
      router.push("/auth/role");
    }
    setLoading(false);
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-md w-full">
        <button
          onClick={() => router.push("/auth/verify")}
          className="mb-8 flex items-center gap-2 text-sm text-[#787774] hover:text-[#1E1A14] transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="mb-10">
          <kbd className="font-mono-feorm text-[10px] border border-[#3C2F1A]/20 bg-[#FEFDFB] px-2 py-1 rounded text-[#787774] mb-6 inline-block">
            IDENTITY PROTOCOL
          </kbd>
          <h2 className="font-serif-display text-3xl md:text-4xl mb-4 text-[#1E1A14]">
            Establish Profile
          </h2>
          <p className="text-sm text-[#787774] leading-relaxed">
            Your identity strengthens the communal trust network.
          </p>
        </div>

        <div className="space-y-5">
          <div className="border border-[#3C2F1A]/20 bg-[#FEFDFB] p-4 rounded-[4px] focus-within:border-[#1E1A14] transition-colors">
            <label htmlFor="first-name" className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-[#787774]">
              First Name
            </label>
            <input
              id="first-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Johan"
              autoComplete="given-name"
              className="w-full bg-transparent outline-none text-lg text-[#1E1A14] placeholder-[#D4C4A0] min-h-[44px]"
            />
          </div>

          <div className="border border-[#3C2F1A]/20 bg-[#FEFDFB] p-4 rounded-[4px] focus-within:border-[#1E1A14] transition-colors">
            <label htmlFor="surname" className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-[#787774]">
              Surname
            </label>
            <input
              id="surname"
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="Deetlefs"
              autoComplete="family-name"
              className="w-full bg-transparent outline-none text-lg text-[#1E1A14] placeholder-[#D4C4A0] min-h-[44px]"
            />
          </div>

          <div className="border border-[#3C2F1A]/20 bg-[#FEFDFB] p-4 rounded-[4px] focus-within:border-[#1E1A14] transition-colors">
            <label htmlFor="region-select" className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-[#787774]">
              Region
            </label>
            <select
              id="region-select"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-transparent outline-none text-lg text-[#1E1A14] min-h-[44px]"
            >
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleIdentitySetup}
            disabled={!name || !surname || loading}
            className="w-full btn-primary-feorm py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {loading ? "Saving..." : "Continue"}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
