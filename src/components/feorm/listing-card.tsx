"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import type { Listing } from "@/context/feorm-context";
import { formatPrice } from "@/lib/format";

function ListingCard({ item }: { item: Listing }) {
  return (
    <Link
      href={`/listing/${item.id}`}
      className="bento-card bento-card-lift flex flex-col group cursor-pointer"
    >
      {/* Image */}
      <div className="h-48 md:h-60 p-2 bg-white-feorm">
        <div className="w-full h-full relative rounded-xl overflow-hidden bg-fog film-grain-overlay">
          <Image
            src={item.imageUrl || "/images/listing-stay-hero.png"}
            alt={item.title}
            width={400}
            height={300}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] listing-image-filter"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-earth opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 z-[3]" />
          {/* Category Tag */}
          <span
            className="absolute top-3 left-3 text-[8px] uppercase font-semibold px-2.5 py-1 rounded-full tracking-wider tag-pastel z-[4]"
          >
            {item.category}
          </span>
          {/* Demo Preview Badge */}
          <span className="demo-preview-badge">Demo Preview</span>
          {/* Rating */}
          {item.rating && (
            <span className="absolute bottom-3 left-3 flex items-center gap-1 bg-earth/80 backdrop-blur-sm text-white-feorm text-[10px] font-semibold px-2.5 py-1 rounded-full z-[4]">
              <Star size={10} className="text-harvest fill-harvest" />
              {item.rating}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 flex-grow flex flex-col justify-between border-t border-earth/5">
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
          <div className="w-9 h-9 min-w-[40px] min-h-[40px] rounded-full border border-earth/8 flex items-center justify-center text-muted-foreground group-hover:bg-harvest group-hover:text-earth group-hover:border-harvest transition-all duration-200">
            <ArrowUpRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default React.memo(ListingCard);
