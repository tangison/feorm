"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Listing } from "@/context/feorm-context";

function formatPrice(cents: number): string {
  return `N$ ${(cents / 100).toLocaleString()}`;
}

export default function ListingCard({ item }: { item: Listing }) {
  return (
    <Link
      href={`/listing/${item.id}`}
      className="bento-card bento-card-lift flex flex-col group cursor-pointer"
    >
      <div className="h-56 p-2 bg-[#FEFDFB]">
        <div className="w-full h-full relative rounded-[4px] overflow-hidden bg-[#FAF7F2]">
          <Image
            src={item.imageUrl}
            alt={item.title}
            width={400}
            height={300}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[#1E1A14] opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300" />
          {/* Category Tag on Image */}
          <span
            className={`absolute top-3 left-3 text-[9px] uppercase font-semibold px-2 py-0.5 rounded-full tracking-wider ${
              item.type === "stay" ? "tag-pastel" : "tag-machinery"
            }`}
          >
            {item.category}
          </span>
        </div>
      </div>
      <div className="p-5 md:p-6 flex-grow flex flex-col justify-between border-t border-[#3C2F1A]/5">
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="font-mono-feorm text-[10px] text-[#787774] uppercase tracking-widest">
              {item.region}
            </span>
          </div>
          <h3 className="font-serif-display text-xl mb-1 text-[#1E1A14] group-hover:text-[#5C4A2A] transition-colors leading-tight">
            {item.title}
          </h3>
        </div>
        <div className="mt-5 flex justify-between items-end">
          <span className="text-base font-medium font-mono-feorm text-[#1E1A14]">
            {formatPrice(item.price)}{" "}
            <span className="text-[10px] text-[#787774] font-normal uppercase tracking-wide">
              / day
            </span>
          </span>
          <div className="w-9 h-9 min-w-[44px] min-h-[44px] rounded-full border border-[#3C2F1A]/10 flex items-center justify-center text-[#787774] group-hover:bg-[#1E1A14] group-hover:text-[#FEFDFB] group-hover:border-[#1E1A14] transition-all duration-200">
            <ArrowUpRight size={13} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export { formatPrice };
