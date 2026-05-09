"use client";

import Link from "next/link";
import { MessageCircle, ChevronRight } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="flex-grow w-full max-w-2xl mx-auto px-6 py-12 md:py-24">
      <div className="mb-12">
        <h2 className="font-serif-display text-4xl md:text-5xl text-[#1E1A14] mb-3">
          Support Center
        </h2>
        <p className="text-sm text-[#787774]">
          Get help with your Feorm experience.
        </p>
      </div>

      <div className="space-y-6">
        <a
          href="https://wa.me/264810000000?text=Hello%2C%20I%20need%20help%20with%20Feorm."
          target="_blank"
          rel="noopener noreferrer"
          className="bento-card p-6 flex items-center gap-4 hover:border-[#25D366] transition-colors block"
        >
          <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center">
            <MessageCircle size={20} className="text-[#25D366]" />
          </div>
          <div className="flex-grow">
            <h3 className="font-serif-display text-lg text-[#1E1A14]">
              WhatsApp Support
            </h3>
            <p className="text-xs text-[#787774]">
              Direct line to the Feorm team. Mon-Fri, 08:00-17:00 CAT.
            </p>
          </div>
          <ChevronRight size={16} className="text-[#787774]" />
        </a>

        <div className="bento-card p-6">
          <h3 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-6">
            Frequently Asked
          </h3>
          <div className="space-y-4 text-sm">
            <div className="pb-4 border-b border-[#3C2F1A]/5">
              <h4 className="font-medium text-[#1E1A14] mb-1">
                How does escrow work?
              </h4>
              <p className="text-[#787774] leading-relaxed">
                A N$1,500 refundable deposit is held for each equipment rental. It&apos;s
                released once the owner confirms the asset&apos;s return condition.
              </p>
            </div>
            <div className="pb-4 border-b border-[#3C2F1A]/5">
              <h4 className="font-medium text-[#1E1A14] mb-1">
                What if equipment is damaged?
              </h4>
              <p className="text-[#787774] leading-relaxed">
                The communal insurance fund covers up to N$10,000 in damage. Both
                parties must submit before/after photos within 48 hours.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-[#1E1A14] mb-1">
                How do I get paid as a host?
              </h4>
              <p className="text-[#787774] leading-relaxed">
                Payouts are processed weekly via bank transfer or MTC Money.
                Minimum payout threshold is N$500.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
