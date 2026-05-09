"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Listing } from "@/context/feorm-context";

function formatPrice(cents: number): string {
  return `N$ ${(cents / 100).toLocaleString()}`;
}

export default function ListingCard({ item }: { item: Listing }) {
  return (
    <Link
      href={`/listing/${item.id}`}
      className="bento-card flex flex-col group cursor-pointer"
    >
      <div className="h-64 p-2 bg-[#FEFDFB]">
        <div className="w-full h-full relative rounded-[4px] overflow-hidden bg-[#FAF7F2]">
          <Image
            src={item.imageUrl}
            alt={item.title}
            width={400}
            height={300}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[#1E1A14] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </div>
      </div>
      <div className="p-6 md:p-8 flex-grow flex flex-col justify-between border-t border-[#3C2F1A]/5">
        <div>
          <div className="flex justify-between items-start mb-4">
            <span
              className={`text-[10px] uppercase font-medium px-2.5 py-1 inline-block rounded-full ${
                item.type === "stay" ? "tag-pastel" : "tag-machinery"
              }`}
            >
              {item.category}
            </span>
            <span className="font-mono-feorm text-xs text-[#787774]">
              {item.region}
            </span>
          </div>
          <h3 className="font-serif-display text-2xl mb-2 text-[#1E1A14] group-hover:text-[#5C4A2A] transition-colors">
            {item.title}
          </h3>
        </div>
        <div className="mt-6 flex justify-between items-end">
          <span className="text-lg font-medium text-[#1E1A14]">
            {formatPrice(item.price)}{" "}
            <span className="text-xs text-[#787774] font-normal uppercase tracking-wide">
              / day
            </span>
          </span>
          <div className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-full border border-[#3C2F1A]/10 flex items-center justify-center text-[#1E1A14] group-hover:bg-[#1E1A14] group-hover:text-[#FEFDFB] transition-colors">
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export { formatPrice };
