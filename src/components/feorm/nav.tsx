"use client";

import { useState, useEffect, useCallback } from "react";
import { useFeormAuth, useFeormMarket, useFeormOnboarding } from "@/context/feorm-context";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Clock,
  LayoutDashboard,
  Tent,
  User,
  Settings,
  Shield,
  LifeBuoy,
  X,
  Sprout,
  ChevronRight,
} from "lucide-react";

export default function FeormNav() {
  const { user, persona } = useFeormAuth();
  const { setMarketView } = useFeormMarket();
  const { selectedRole, setHasCompletedOnboarding } = useFeormOnboarding();
  const pathname = usePathname();
  const router = useRouter();

  const isProvider = persona === "farmer";

  const [moreOpen, setMoreOpen] = useState(false);

  const closeMore = useCallback(() => setMoreOpen(false), []);

  // Close more menu on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    if (moreOpen) {
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }
  }, [moreOpen]);

  // Prevent body scroll when more menu is open
  useEffect(() => {
    if (moreOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [moreOpen]);

  // ── Persona label ──
  const getPersonaLabel = () => {
    if (isProvider) return "Viewing as: Farmer";
    return "Viewing as: Guest";
  };

  const getPersonaIcon = () => {
    if (isProvider) return <Sprout size={10} className="text-verified" />;
    return null;
  };

  // ── Mobile bottom nav tabs ──
  const mobileTabs = isProvider
    ? [
        { label: "Explore", href: "/marketplace", icon: MapPin, active: pathname === "/marketplace" || pathname.startsWith("/listing"), onClick: () => setMarketView("stays") },
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: pathname === "/dashboard" },
        { label: "Profile", href: "/profile", icon: User, active: pathname === "/profile" },
      ]
    : [
        { label: "Explore", href: "/marketplace", icon: MapPin, active: pathname === "/marketplace" || pathname.startsWith("/listing") },
        { label: "Journeys", href: "/journeys", icon: Clock, active: pathname === "/journeys" },
        { label: "Profile", href: "/profile", icon: User, active: pathname === "/profile" },
      ];

  // ── More menu items ──
  const moreItems = [
    { label: "Verification", href: "/verification", icon: Shield },
    { label: "Settings", href: "/settings", icon: Settings },
    { label: "Support", href: "/support", icon: LifeBuoy },
  ];

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          MOBILE: Slim Top Header + Floating Bottom Nav
      ═══════════════════════════════════════════════════════ */}

      {/* Top Header — Brand + Persona Badge + Avatar (56px) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white-feorm/90 backdrop-blur-xl border-b border-earth/5 demo-banner-offset">
        <div className="flex items-center justify-between h-14 px-5">
          <Link
            href="/marketplace"
            className="flex items-center gap-2.5 min-h-[44px]"
            aria-label="Feorm home"
          >
            <Image
              src="/feorm-logo.png"
              alt="Feorm"
              width={36}
              height={36}
              sizes="36px"
              className="rounded-lg"
            />
            <span className="font-serif-display text-xl italic lowercase leading-none">
              feorm<span className="text-harvest">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 text-[9px] uppercase font-bold px-2.5 py-1 rounded-full tracking-wider tag-pastel">
              {getPersonaIcon()}
              {isProvider ? "Farmer" : "Guest"}
            </span>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex items-center gap-1.5 min-h-[44px] min-w-[44px] justify-center rounded-full active:bg-earth/5 transition-colors"
              aria-label="More menu"
              aria-expanded={moreOpen}
            >
              <div className="w-8 h-8 rounded-full bg-earth text-white-feorm flex items-center justify-center text-xs font-medium font-serif-display">
                {user?.name?.[0] ?? "G"}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Bottom Tab Bar — 3 essential tabs */}
      <nav
        className="lg:hidden fixed bottom-4 left-4 right-4 z-40 bg-white-feorm/95 backdrop-blur-xl rounded-2xl warm-shadow-lg border border-earth/5 safe-area-bottom"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-around h-16">
          {mobileTabs.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(item as { onClick?: () => void }).onClick}
                className={`flex flex-col items-center justify-center gap-1 min-w-0 flex-1 min-h-[44px] transition-all duration-200 rounded-xl mx-1 ${
                  isActive
                    ? "bg-earth text-white-feorm"
                    : "text-muted-foreground active:text-earth"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={20} aria-hidden="true" strokeWidth={isActive ? 2.2 : 1.5} />
                <span className="text-[9px] font-semibold uppercase tracking-[0.04em] leading-none">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════
          MORE MENU — Bottom sheet
      ═══════════════════════════════════════════════════════ */}
      {moreOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-earth/20 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
            aria-hidden="true"
          />

          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white-feorm rounded-t-2xl warm-shadow-lg border-t border-earth/5 safe-area-bottom animate-slide-up">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-8 h-1 rounded-full bg-sand/60" />
            </div>

            <div className="px-5 pb-4 flex items-center gap-3 border-b border-earth/5">
              <div className="w-10 h-10 rounded-full bg-earth text-white-feorm flex items-center justify-center text-sm font-medium font-serif-display">
                {user?.name?.[0] ?? "G"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-earth truncate">
                  {user?.name || "Guest"} {user?.surname || "User"}
                </p>
                <p className="font-mono-feorm text-[9px] text-muted-foreground uppercase tracking-widest">
                  {isProvider ? "Farmer" : "Guest"}
                </p>
              </div>
              <button
                onClick={() => setMoreOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-fog flex items-center justify-center"
                aria-label="Close menu"
              >
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>

            <div className="py-2 px-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => {
                      closeMore();
                      (item as { onClick?: () => void }).onClick?.();
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-earth hover:bg-fog transition-colors min-h-[52px]"
                  >
                    <Icon size={18} className="text-muted-foreground" aria-hidden="true" />
                    <span className="text-sm font-medium">{item.label}</span>
                    <ChevronRight size={14} className="ml-auto text-sand" />
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════
          DESKTOP: Sidebar
      ═══════════════════════════════════════════════════════ */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[260px] bg-white-feorm border-r border-earth/5 py-8 px-6 z-50 demo-banner-offset"
        aria-label="Main navigation"
      >
        {/* Brand — larger logo */}
        <Link
          href="/marketplace"
          className="flex items-center gap-3 mb-8 px-1"
          aria-label="Feorm home"
        >
          <Image
            src="/feorm-logo.png"
            alt="Feorm"
            width={40}
            height={40}
            sizes="40px"
            className="rounded-lg"
          />
          <span className="font-serif-display text-2xl italic lowercase">
            feorm<span className="text-harvest">.</span>
          </span>
        </Link>

        {/* Persona Badge */}
        <div className="px-1 mb-6">
          <span className="flex items-center gap-1.5 text-[9px] uppercase font-bold px-3 py-1.5 rounded-full tracking-wider tag-pastel">
            {getPersonaIcon()}
            {getPersonaLabel()}
          </span>
        </div>

        {/* Nav Items — with active pill state */}
        <nav className="flex-1 flex flex-col gap-1" role="navigation">
          {(isProvider
            ? [
                { label: "Explore", href: "/marketplace", icon: MapPin, active: pathname === "/marketplace" || pathname.startsWith("/listing"), onClick: () => setMarketView("stays") },
                { label: "My Listings", href: "/dashboard", icon: Tent, active: pathname === "/dashboard" },
                { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: false },
                { label: "Profile", href: "/profile", icon: User, active: pathname === "/profile" },
                { label: "Verification", href: "/verification", icon: Shield, active: pathname === "/verification" },
                { label: "Settings", href: "/settings", icon: Settings, active: pathname === "/settings" },
                { label: "Support", href: "/support", icon: LifeBuoy, active: pathname === "/support" },
              ]
            : [
                { label: "Explore", href: "/marketplace", icon: MapPin, active: pathname === "/marketplace" || pathname.startsWith("/listing") },
                { label: "How it Works", href: "/landing", icon: Sprout, active: pathname === "/landing" },
                { label: "Journeys", href: "/journeys", icon: Clock, active: pathname === "/journeys" },
                { label: "Profile", href: "/profile", icon: User, active: pathname === "/profile" },
                { label: "Verification", href: "/verification", icon: Shield, active: pathname === "/verification" },
                { label: "Settings", href: "/settings", icon: Settings, active: pathname === "/settings" },
                { label: "Support", href: "/support", icon: LifeBuoy, active: pathname === "/support" },
              ]
          ).map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(item as { onClick?: () => void }).onClick}
                className={`flex items-center gap-3 rounded-full px-4 py-3 transition-all duration-200 min-h-[52px] group ${
                  isActive
                    ? "bg-earth text-white-feorm shadow-sm"
                    : "text-muted-foreground hover:bg-fog hover:text-earth"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  size={18}
                  className={`transition-colors duration-150 ${
                    isActive ? "text-harvest" : "text-sand group-hover:text-earth"
                  }`}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="border-t border-earth/5 pt-5 mt-2">
          <div className="flex items-center gap-3 px-1 mb-2">
            <div className="w-10 h-10 rounded-full bg-earth text-white-feorm flex items-center justify-center text-sm font-medium font-serif-display">
              {user?.name?.[0] ?? "G"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-earth truncate">
                {user?.name || "Guest"} {user?.surname || "User"}
              </p>
              <p className="font-mono-feorm text-[9px] text-muted-foreground uppercase tracking-widest truncate">
                {isProvider ? "Farmer" : "Guest"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
