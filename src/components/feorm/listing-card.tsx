"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Listing } from "@/context/feorm-context";
import { formatPrice } from "@/lib/format";

function ListingCard({ item }: { item: Listing }) {
  return (
    <Link
      href={`/listing/${item.id}`}
      className="bento-card bento-card-lift flex flex-col group cursor-pointer"
    >
      {/* Image */}
      <div className="h-44 md:h-56 p-1.5 md:p-2 bg-white-feorm">
        <div className="w-full h-full relative rounded-md overflow-hidden bg-fog">
          <Image
            src={item.imageUrl || (item.type === "stay" ? "/images/listing-stay-hero.png" : "/images/listing-equip-hero.png")}
            alt={item.title}
            width={400}
            height={300}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] opacity-90"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-earth opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300" />
          {/* Category Tag */}
          <span
            className={`absolute top-2.5 left-2.5 text-[8px] uppercase font-semibold px-2 py-0.5 rounded-full tracking-wider ${
              item.type === "stay" ? "tag-pastel" : "tag-machinery"
            }`}
          >
            {item.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 md:p-5 flex-grow flex flex-col justify-between border-t border-earth/5">
        <div>
          <span className="font-mono-feorm text-[9px] text-muted-foreground uppercase tracking-widest">
            {item.region}
          </span>
          <h3 className="font-serif-display text-lg md:text-xl mt-1 text-earth group-hover:text-bark transition-colors leading-tight">
            {item.title}
          </h3>
        </div>
        <div className="mt-4 flex justify-between items-end">
          <span className="text-sm font-medium font-mono-feorm text-earth">
            {formatPrice(item.price)}{" "}
            <span className="text-[9px] text-muted-foreground font-normal uppercase tracking-wide">
              / day
            </span>
          </span>
          <div className="w-8 h-8 min-w-[36px] min-h-[36px] rounded-full border border-earth/8 flex items-center justify-center text-muted-foreground group-hover:bg-earth group-hover:text-white-feorm group-hover:border-earth transition-all duration-200">
            <ArrowUpRight size={12} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default React.memo(ListingCard);
