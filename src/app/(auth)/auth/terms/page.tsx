"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFeormAuth } from "@/context/feorm-context";
import { ArrowRight } from "lucide-react";

export default function TermsPage() {
  const { setUser } = useFeormAuth();
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-lg w-full">
        <div className="mb-10">
          <kbd className="font-mono-feorm text-[10px] border border-[#3C2F1A]/20 bg-[#FEFDFB] px-2 py-1 rounded text-[#787774] mb-6 inline-block">
            TERMS OF SERVICE
          </kbd>
          <h1 className="font-serif-display text-3xl md:text-4xl mb-4 text-[#1E1A14]">
            Your Rights & Responsibilities
          </h1>
          <p className="text-sm text-[#787774]">
            A plain-English summary of the rules for using Feorm.
          </p>
        </div>

        <div className="border border-[#3C2F1A]/10 bg-[#FEFDFB] rounded-[8px] p-6 md:p-8 mb-8 max-h-80 overflow-y-auto">
          <div className="space-y-6 text-sm text-[#3C2F1A] leading-relaxed">
            <div>
              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
                01 — Trust & Identity
              </h4>
              <p>
                All participants must verify their identity via a valid Namibian ID or
                passport. Anonymity is incompatible with the communal trust model.
              </p>
            </div>
            <div>
              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
                02 — Escrow Protocol
              </h4>
              <p>
                All equipment rentals require a refundable escrow deposit of N$1,500.
                This deposit is held in trust and released upon confirmed return
                condition.
              </p>
            </div>
            <div>
              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
                03 — Damage Coverage
              </h4>
              <p>
                The Feorm communal insurance fund provides up to N$10,000 in damage
                coverage for verified equipment rental transactions.
              </p>
            </div>
            <div>
              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
                04 — Communication
              </h4>
              <p>
                All transactional communication occurs via WhatsApp. Feorm does not
                store message content. Record-keeping is the responsibility of both
                parties.
              </p>
            </div>
            <div>
              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
                05 — Dispute Resolution
              </h4>
              <p>
                Disputes are resolved through a community arbitration process. Both
                parties must submit photographic evidence within 48 hours.
              </p>
            </div>
          </div>
        </div>

        <label className="flex items-start gap-3 mb-8 cursor-pointer">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 w-4 h-4 accent-[#1E1A14]"
          />
          <span className="text-sm text-[#3C2F1A]">
            I accept the terms of service and acknowledge the escrow and insurance policies as binding for all transactions on Feorm.
          </span>
        </label>

        <button
          onClick={() => {
            setUser((prev) => (prev ? { ...prev, verified: true } : null));
            router.push("/auth/verify-id");
          }}
          disabled={!accepted}
          className="w-full btn-primary-feorm px-5 py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        >
          I Accept — Continue to Marketplace
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
