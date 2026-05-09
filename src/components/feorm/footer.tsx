"use client";

import Image from "next/image";
import Link from "next/link";

export default function FeormFooter() {
  return (
    <footer className="border-t border-[#3C2F1A]/10 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        {/* Design System Showcase */}
        <div className="grid md:grid-cols-2 gap-16 mb-16">
          {/* Color Palette */}
          <div>
            <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-6">
              The Namibian Palette
            </h4>
            <div className="grid grid-cols-5 gap-3">
              {[
                { name: "Earth", hex: "#1E1A14" },
                { name: "Soil", hex: "#3C2F1A" },
                { name: "Harvest", hex: "#E8C96A" },
                { name: "Sand", hex: "#D4C4A0" },
                { name: "Fog", hex: "#FAF7F2" },
              ].map((c) => (
                <div key={c.name}>
                  <div
                    className="h-16 w-full border border-[#3C2F1A]/10 rounded-[4px] mb-2"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="font-mono-feorm text-[9px] font-bold block text-[#1E1A14]">
                    {c.name}
                  </span>
                  <span className="font-mono-feorm text-[8px] text-[#787774]">
                    {c.hex}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Typography & Components */}
          <div>
            <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-6">
              Typographic Architecture
            </h4>
            <div className="bg-[#FAF7F2] p-6 rounded-[8px] border border-[#3C2F1A]/5">
              <p className="font-serif-display text-2xl mb-3 italic">
                The Land Provides.
              </p>
              <p className="text-sm mb-4 text-[#1E1A14]">
                Premium Utilitarian Minimalism for the agrotourism network.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="tag-pastel text-[10px] uppercase font-medium px-2.5 py-1">
                  Harvest
                </span>
                <span className="tag-verified text-[10px] uppercase font-medium px-2.5 py-1">
                  Verified
                </span>
                <span className="tag-machinery text-[10px] uppercase font-medium px-2.5 py-1">
                  Machinery
                </span>
                <span className="tag-alert text-[10px] uppercase font-medium px-2.5 py-1">
                  Alert
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-[#3C2F1A]/10">
          <Link href="/marketplace" className="flex items-center gap-2">
            <Image
              src="/feorm-logo.png"
              alt="Feorm"
              width={28}
              height={28}
              className="rounded-[4px]"
            />
            <span className="font-serif-display text-2xl italic lowercase">
              feorm<span className="text-[#E8C96A]">.</span>
            </span>
          </Link>
          <div className="flex gap-12">
            <div>
              <span className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#787774] mb-2 block">
                Project Code
              </span>
              <span className="font-mono-feorm text-xs text-[#1E1A14]">
                FE-N-0.1
              </span>
            </div>
            <div>
              <span className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#787774] mb-2 block">
                Region
              </span>
              <span className="font-mono-feorm text-xs text-[#1E1A14]">
                Sub-Saharan Africa
              </span>
            </div>
            <div>
              <span className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#787774] mb-2 block">
                AIC 2026
              </span>
              <span className="font-mono-feorm text-xs text-[#1E1A14]">
                Agripreneurial Innovation
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
