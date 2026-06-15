"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sprout, MapPin, Heart } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex-grow">
      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-gateway.png"
            alt="Namibian farmland at golden hour"
            fill
            className="object-cover listing-image-filter"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-earth/80 via-earth/50 to-earth/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-block font-mono-feorm text-[10px] uppercase tracking-widest text-harvest mb-6 border border-harvest/30 rounded-full px-4 py-2">
              Namibian Farm Stays
            </span>
            <h1 className="hero-headline font-serif-display text-white-feorm mb-6">
              Your farm. Their adventure.
            </h1>
            <p className="text-lg md:text-xl text-sand/90 mb-10 leading-relaxed max-w-lg">
              Feorm connects Namibian landowners with travellers seeking authentic farm stays. Real land, real hosts, real rest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/marketplace"
                className="btn-harvest flex items-center justify-center gap-2 px-8 py-4 text-sm uppercase tracking-widest min-h-[52px]"
              >
                Explore Stays
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/dashboard"
                className="btn-secondary-feorm border-white-feorm/30 text-white-feorm hover:bg-white-feorm/10 flex items-center justify-center gap-2 px-8 py-4 text-sm uppercase tracking-widest min-h-[52px]"
              >
                List Your Farm
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════ */}
      <section className="section-spacing bg-white-feorm">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <span className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-3 block">
              How it works
            </span>
            <h2 className="section-headline font-serif-display text-earth">
              From farmland to fond memories
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
                <Sprout size={28} className="text-accent-foreground" />
              </div>
              <span className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground mb-2 block">
                Step 01
              </span>
              <h3 className="font-serif-display text-xl text-earth mb-3">
                Farmers list their space
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Namibian landowners create a listing with photos, amenities, and pricing. No middlemen, no complicated setup. Just honest descriptions of what you will find on the farm.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
                <MapPin size={28} className="text-accent-foreground" />
              </div>
              <span className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground mb-2 block">
                Step 02
              </span>
              <h3 className="font-serif-display text-xl text-earth mb-3">
                Guests discover and book
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Travellers browse farm stays by region, read verified host profiles, and book directly through Feorm. Escrow protection holds deposits safely until check-in day.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
                <Heart size={28} className="text-accent-foreground" />
              </div>
              <span className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground mb-2 block">
                Step 03
              </span>
              <h3 className="font-serif-display text-xl text-earth mb-3">
                Everyone connects over the land
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Guest arrives at the farm, meets the host, and experiences Namibian rural life firsthand. After the stay, both leave verified reviews. The land brings people together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PRICING / PLANS
      ═══════════════════════════════════════════════════════ */}
      <section className="section-spacing bg-fog">
        <div className="max-w-5xl mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <span className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-3 block">
              Pricing
            </span>
            <h2 className="section-headline font-serif-display text-earth">
              Simple, honest pricing
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Guest Card */}
            <div className="bento-card p-8 md:p-10 rounded-[20px]">
              <div className="mb-6">
                <span className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground mb-3 block">
                  For Guests
                </span>
                <h3 className="font-serif-display text-2xl text-earth mb-2">
                  Explorer
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Browse and book farm stays across Namibia. Free to explore, pay only when you book.
                </p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-mono-feorm text-earth font-medium">Free</span>
                <span className="text-sm text-muted-foreground ml-2">to browse</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-earth">
                  <span className="w-5 h-5 rounded-full bg-verified-bg flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-verified text-[10px] font-bold">1</span>
                  </span>
                  Browse all verified farm stays by region
                </li>
                <li className="flex items-start gap-3 text-sm text-earth">
                  <span className="w-5 h-5 rounded-full bg-verified-bg flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-verified text-[10px] font-bold">2</span>
                  </span>
                  Escrow-protected bookings with verified hosts
                </li>
                <li className="flex items-start gap-3 text-sm text-earth">
                  <span className="w-5 h-5 rounded-full bg-verified-bg flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-verified text-[10px] font-bold">3</span>
                  </span>
                  Direct WhatsApp contact with your host
                </li>
                <li className="flex items-start gap-3 text-sm text-earth">
                  <span className="w-5 h-5 rounded-full bg-verified-bg flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-verified text-[10px] font-bold">4</span>
                  </span>
                  AI-powered smart suggestions for your trip
                </li>
              </ul>
              <Link
                href="/marketplace"
                className="btn-primary-feorm w-full mt-8 flex items-center justify-center gap-2 px-6 py-4 text-xs uppercase tracking-widest min-h-[52px]"
              >
                Start Exploring
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Host Card — Featured */}
            <div className="bento-card p-8 md:p-10 rounded-[20px] border-2 border-harvest relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 tag-pastel text-[9px] uppercase font-bold px-4 py-1.5">
                Most Popular
              </span>
              <div className="mb-6">
                <span className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground mb-3 block">
                  For Farmers
                </span>
                <h3 className="font-serif-display text-2xl text-earth mb-2">
                  Host
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  List your farm stay for free. Earn income from your land. Only pay when you earn.
                </p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-mono-feorm text-earth font-medium">10%</span>
                <span className="text-sm text-muted-foreground ml-2">per booking</span>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-earth">
                  <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-accent-foreground text-[10px] font-bold">1</span>
                  </span>
                  List your farm stay for free, no upfront cost
                </li>
                <li className="flex items-start gap-3 text-sm text-earth">
                  <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-accent-foreground text-[10px] font-bold">2</span>
                  </span>
                  Verified host badge and trust score
                </li>
                <li className="flex items-start gap-3 text-sm text-earth">
                  <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-accent-foreground text-[10px] font-bold">3</span>
                  </span>
                  AI-powered listing descriptions and tips
                </li>
                <li className="flex items-start gap-3 text-sm text-earth">
                  <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-accent-foreground text-[10px] font-bold">4</span>
                  </span>
                  Dashboard with earnings, bookings, and analytics
                </li>
              </ul>
              <Link
                href="/dashboard"
                className="btn-harvest w-full mt-8 flex items-center justify-center gap-2 px-6 py-4 text-xs uppercase tracking-widest min-h-[52px]"
              >
                List Your Farm
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TRUST BAR
      ═══════════════════════════════════════════════════════ */}
      <section className="section-spacing bg-earth">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            <div>
              <p className="font-serif-display text-4xl md:text-5xl text-harvest mb-2">120+</p>
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-sand">
                Farm Listings
              </p>
            </div>
            <div>
              <p className="font-serif-display text-4xl md:text-5xl text-harvest mb-2">4.9</p>
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-sand">
                Average Rating
              </p>
            </div>
            <div>
              <p className="font-serif-display text-4xl md:text-5xl text-harvest mb-2">500+</p>
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-sand">
                Stays Booked
              </p>
            </div>
            <div>
              <p className="font-serif-display text-4xl md:text-5xl text-harvest mb-2">12</p>
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-sand">
                Provinces
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA SECTION
      ═══════════════════════════════════════════════════════ */}
      <section className="section-spacing bg-fog">
        <div className="max-w-3xl mx-auto px-6 md:px-8 text-center">
          <h2 className="section-headline font-serif-display text-earth mb-4">
            Ready to experience the land?
          </h2>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-lg mx-auto">
            Whether you are a farmer looking to earn from your land or a traveller seeking an authentic Namibian experience, Feorm is built for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/marketplace"
              className="btn-harvest flex items-center justify-center gap-2 px-8 py-4 text-sm uppercase tracking-widest min-h-[52px]"
            >
              Explore Farm Stays
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
