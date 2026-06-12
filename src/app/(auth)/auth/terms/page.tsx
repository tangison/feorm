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
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-fog">
      <div className="max-w-lg w-full">
        <div className="mb-10">
          <kbd className="font-mono-feorm text-[10px] border border-soil/20 bg-white-feorm px-2 py-1 rounded text-muted-foreground mb-6 inline-block">
            TERMS OF SERVICE
          </kbd>
          <h1 className="font-serif-display text-3xl md:text-4xl mb-4 text-earth">
            Your Rights & Responsibilities
          </h1>
          <p className="text-sm text-muted-foreground">
            A plain-language summary of the rules for using Feorm.
          </p>
        </div>

        <div className="border border-soil/10 bg-white-feorm rounded-[8px] p-6 md:p-8 mb-8 max-h-80 overflow-y-auto">
          <div className="space-y-6 text-sm text-soil leading-relaxed">
            <div>
              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                01 — Identity & Trust
              </h4>
              <p>
                Everyone on Feorm must verify their identity with a valid Namibian ID or passport. This protects both travelers and hosts.
              </p>
            </div>
            <div>
              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                02 — Damage Protection
              </h4>
              <p>
                The Feorm communal insurance fund covers up to N$10,000 in damage for verified bookings. This applies to both travelers and hosts.
              </p>
            </div>
            <div>
              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                03 — Staying in Touch
              </h4>
              <p>
                Booking communication happens through WhatsApp. Feorm does not store message content. Both parties should keep their own records.
              </p>
            </div>
            <div>
              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                04 — Resolving Disputes
              </h4>
              <p>
                Disputes are resolved through a community arbitration process. Both parties must submit photographic evidence within 48 hours.
              </p>
            </div>
          </div>
        </div>

        <label className="flex items-start gap-3 mb-8 cursor-pointer">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 w-4 h-4 accent-earth"
          />
          <span className="text-sm text-soil">
            I accept the terms of service and understand the damage protection policy applies to all bookings on Feorm.
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
          I Accept — Continue
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
