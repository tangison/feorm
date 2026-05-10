"use client";

import Image from "next/image";
import Link from "next/link";

export default function FeormFooter() {
  return (
    <footer className="border-t border-[#3C2F1A]/10 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {/* Brand + Tagline */}
          <div>
            <Link href="/marketplace" className="flex items-center gap-2.5 mb-4">
              <Image
                src="/feorm-logo.png"
                alt="Feorm"
                width={24}
                height={24}
                className="rounded-[4px]"
              />
              <span className="font-serif-display text-xl italic lowercase">
                feorm<span className="text-[#E8C96A]">.</span>
              </span>
            </Link>
            <p className="text-sm text-[#787774] leading-relaxed max-w-[260px]">
              Book farm stays and rent farming equipment from Namibian landowners. Escrow-protected, verified hosts, N$10,000 damage cover.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-4">
              Explore
            </h4>
            <div className="space-y-3">
              <Link href="/marketplace?view=stays" className="block text-sm text-[#3C2F1A] hover:text-[#1E1A14] transition-colors">
                Farm Stays
              </Link>
              <Link href="/marketplace?view=equipment" className="block text-sm text-[#3C2F1A] hover:text-[#1E1A14] transition-colors">
                Equipment Exchange
              </Link>
              <Link href="/journeys" className="block text-sm text-[#3C2F1A] hover:text-[#1E1A14] transition-colors">
                My Journeys
              </Link>
              <Link href="/support" className="block text-sm text-[#3C2F1A] hover:text-[#1E1A14] transition-colors">
                Support Center
              </Link>
            </div>
          </div>

          {/* Meta */}
          <div>
            <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-4">
              Metadata
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#787774]">Project</span>
                <span className="font-mono-feorm text-xs text-[#1E1A14]">FE-N-0.1</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#787774]">Region</span>
                <span className="font-mono-feorm text-xs text-[#1E1A14]">Sub-Saharan Africa</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#787774]">Protocol</span>
                <span className="font-mono-feorm text-xs text-[#1E1A14]">Escrow + Verification</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#787774]">AIC 2026</span>
                <span className="font-mono-feorm text-xs text-[#1E1A14]">Agripreneurial Innovation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Color Palette Strip */}
        <div className="mb-12">
          <div className="flex gap-1">
            {[
              { hex: "#1E1A14" },
              { hex: "#3C2F1A" },
              { hex: "#5C4A2A" },
              { hex: "#E8C96A" },
              { hex: "#D4C4A0" },
              { hex: "#F2EDE2" },
              { hex: "#FAF7F2" },
              { hex: "#FEFDFB" },
            ].map((c) => (
              <div
                key={c.hex}
                className="h-1.5 flex-1 rounded-full"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        {/* Bottom Line */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-[#3C2F1A]/10">
          <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#787774]">
            Premium Utilitarian Minimalism
          </p>
          <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#787774]">
            Namibia — Built for the Land
          </p>
        </div>
      </div>
    </footer>
  );
}
