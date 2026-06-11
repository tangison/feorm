"use client";

import Image from "next/image";
import Link from "next/link";

export default function FeormFooter() {
  return (
    <footer className="border-t border-earth/5 mt-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        {/* Main Grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-10">
          {/* Brand */}
          <div>
            <Link href="/marketplace" className="flex items-center gap-2 mb-3">
              <Image
                src="/feorm-logo.png"
                alt="Feorm"
                width={20}
                height={20}
                className="rounded-[3px]"
              />
              <span className="font-serif-display text-lg italic lowercase">
                feorm<span className="text-harvest">.</span>
              </span>
            </Link>
            <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[240px]">
              Farm stays from Namibian landowners. Escrow-protected. Verified hosts.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono-feorm text-[8px] uppercase tracking-widest text-muted-foreground mb-3">
              Explore
            </h4>
            <div className="space-y-2">
              <Link href="/marketplace?view=stays" className="block text-[11px] text-soil hover:text-earth transition-colors">
                Farm Stays
              </Link>
              <Link href="/journeys" className="block text-[11px] text-soil hover:text-earth transition-colors">
                My Journeys
              </Link>
              <Link href="/support" className="block text-[11px] text-soil hover:text-earth transition-colors">
                Support
              </Link>
            </div>
          </div>

          {/* Meta */}
          <div>
            <h4 className="font-mono-feorm text-[8px] uppercase tracking-widest text-muted-foreground mb-3">
              Metadata
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Project</span>
                <span className="font-mono-feorm text-[9px] text-earth">FE-N-0.1</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Region</span>
                <span className="font-mono-feorm text-[9px] text-earth">Sub-Saharan Africa</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Protocol</span>
                <span className="font-mono-feorm text-[9px] text-earth">Escrow + Verification</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">AIC 2026</span>
                <span className="font-mono-feorm text-[9px] text-earth">Agripreneurial Innovation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Color Strip */}
        <div className="mb-8">
          <div className="flex gap-0.5">
            {[
              { name: "earth", css: "var(--color-earth)" },
              { name: "soil", css: "var(--color-soil)" },
              { name: "bark", css: "var(--color-bark)" },
              { name: "harvest", css: "var(--color-harvest)" },
              { name: "sand", css: "var(--color-sand)" },
              { name: "cream", css: "var(--color-cream)" },
              { name: "fog", css: "var(--color-fog)" },
              { name: "white-feorm", css: "var(--color-white-feorm)" },
            ].map((color) => (
              <div
                key={color.name}
                className="h-1 flex-1 rounded-full"
                style={{ backgroundColor: color.css }}
              />
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 pt-5 border-t border-earth/5">
          <p className="font-mono-feorm text-[8px] uppercase tracking-widest text-muted-foreground">
            Simple, honest, built for the land
          </p>
          <p className="font-mono-feorm text-[8px] uppercase tracking-widest text-muted-foreground">
            Namibia — Built for the Land
          </p>
        </div>
      </div>
    </footer>
  );
}
