"use client";

import { useFeormAuth, useFeormMarket, useFeormOnboarding } from "@/context/feorm-context";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Clock,
  LayoutDashboard,
  Tent,
  Wrench,
  Settings,
  Shield,
  LifeBuoy,
  LogOut,
  User,
} from "lucide-react";
import { isEmojiAvatar, getEmojiAvatar, isPresetAvatar, getPresetGradient } from "@/lib/avatar";

export default function FeormNav() {
  const { user, avatarUrl } = useFeormAuth();
  const { setMarketView } = useFeormMarket();
  const { selectedRole, setHasCompletedOnboarding } = useFeormOnboarding();
  const pathname = usePathname();
  const router = useRouter();

  const isProvider = selectedRole === "provider";

  // ── Resolve avatar display ──
  const avatarDisplay = (() => {
    if (!avatarUrl) return { type: "emoji" as const, emoji: "🌳", bg: "bg-gradient-to-br from-harvest/30 to-cream" };
    if (isEmojiAvatar(avatarUrl)) {
      const ea = getEmojiAvatar(avatarUrl);
      if (ea) return { type: "emoji" as const, emoji: ea.emoji, bg: ea.bg };
      return { type: "emoji" as const, emoji: "🌳", bg: "bg-gradient-to-br from-harvest/30 to-cream" };
    }
    if (isPresetAvatar(avatarUrl)) {
      const gradient = getPresetGradient(avatarUrl);
      return { type: "preset" as const, gradient };
    }
    return { type: "image" as const, url: avatarUrl };
  })();

  // ── Desktop sidebar nav items ──
  const providerNavItems = [
    { label: "Farm Stays", href: "/marketplace?view=stays", icon: Tent, active: pathname === "/marketplace", onClick: () => setMarketView("stays") },
    { label: "Equipment", href: "/marketplace?view=equipment", icon: Wrench, active: pathname === "/marketplace", onClick: () => setMarketView("equipment") },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: pathname === "/dashboard" },
    { label: "Profile", href: "/profile", icon: User, active: pathname === "/profile" },
    { label: "Verification", href: "/verification", icon: Shield, active: pathname === "/verification" },
    { label: "Settings", href: "/settings", icon: Settings, active: pathname === "/settings" },
    { label: "Support", href: "/support", icon: LifeBuoy, active: pathname === "/support" },
  ];

  const voyagerNavItems = [
    { label: "Explore", href: "/marketplace", icon: MapPin, active: pathname === "/marketplace" || pathname.startsWith("/listing") },
    { label: "Journeys", href: "/journeys", icon: Clock, active: pathname === "/journeys" },
    { label: "Verification", href: "/verification", icon: Shield, active: pathname === "/verification" },
    { label: "Profile", href: "/profile", icon: User, active: pathname === "/profile" },
    { label: "Settings", href: "/settings", icon: Settings, active: pathname === "/settings" },
    { label: "Support", href: "/support", icon: LifeBuoy, active: pathname === "/support" },
  ];

  // ── Mobile bottom nav items (5 max for thumb zone) ──
  const mobileBottomProvider = [
    { label: "Stays", href: "/marketplace?view=stays", icon: Tent, active: pathname === "/marketplace", onClick: () => setMarketView("stays") },
    { label: "Gear", href: "/marketplace?view=equipment", icon: Wrench, active: pathname === "/marketplace", onClick: () => setMarketView("equipment") },
    { label: "Board", href: "/dashboard", icon: LayoutDashboard, active: pathname === "/dashboard" },
    { label: "Profile", href: "/profile", icon: User, active: pathname === "/profile" },
    { label: "More", href: "/settings", icon: Settings, active: pathname === "/settings" || pathname === "/verification" || pathname === "/support" },
  ];

  const mobileBottomVoyager = [
    { label: "Explore", href: "/marketplace", icon: MapPin, active: pathname === "/marketplace" || pathname.startsWith("/listing") },
    { label: "Trips", href: "/journeys", icon: Clock, active: pathname === "/journeys" },
    { label: "Verify", href: "/verification", icon: Shield, active: pathname === "/verification" },
    { label: "Profile", href: "/profile", icon: User, active: pathname === "/profile" },
    { label: "More", href: "/settings", icon: Settings, active: pathname === "/settings" || pathname === "/support" },
  ];

  const desktopNavItems = isProvider ? providerNavItems : voyagerNavItems;
  const mobileBottomItems = isProvider ? mobileBottomProvider : mobileBottomVoyager;

  // ── Shared avatar rendering ──
  const renderAvatar = (size: number = 32) => {
    const cls = `w-[${size}px] h-[${size}px] rounded-full flex items-center justify-center overflow-hidden shrink-0`;

    if (avatarDisplay.type === "emoji") {
      return (
        <div className={`${avatarDisplay.bg} ${cls}`} style={{ width: size, height: size }}>
          <span style={{ fontSize: Math.round(size * 0.5) }} className="leading-none select-none">
            {avatarDisplay.emoji}
          </span>
        </div>
      );
    }
    if (avatarDisplay.type === "preset") {
      return (
        <div
          className={cls}
          style={{ width: size, height: size, background: avatarDisplay.gradient ?? undefined }}
        />
      );
    }
    return (
      <div className={cls} style={{ width: size, height: size }}>
        <Image
          src={avatarDisplay.url}
          alt="Avatar"
          width={size}
          height={size}
          sizes={`${size}px`}
          className="w-full h-full object-cover"
        />
      </div>
    );
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          MOBILE: Slim Top Header + Bottom Tab Bar
      ═══════════════════════════════════════════════════════ */}

      {/* Top Header — Brand + Avatar only (48px) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white-feorm/90 backdrop-blur-xl border-b border-earth/5">
        <div className="flex items-center justify-between h-12 px-4">
          <Link
            href="/marketplace"
            className="flex items-center gap-2"
            aria-label="Feorm home"
          >
            <Image
              src="/feorm-logo.png"
              alt=""
              width={22}
              height={22}
              sizes="22px"
              className="rounded-[3px]"
            />
            <span className="font-serif-display text-lg italic lowercase leading-none">
              feorm<span className="text-harvest">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <span
              className={`text-[7px] uppercase font-bold px-1.5 py-0.5 rounded-full tracking-wider ${
                isProvider ? "tag-verified" : "tag-pastel"
              }`}
            >
              {isProvider ? "Provider" : "Voyager"}
            </span>
            <Link href="/profile" aria-label="Profile">
              {renderAvatar(30)}
            </Link>
          </div>
        </div>
      </header>

      {/* Bottom Tab Bar — 5 icons in thumb zone (56px + safe area) */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white-feorm/95 backdrop-blur-xl border-t border-earth/8 safe-area-bottom"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-around h-14">
          {mobileBottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(item as { onClick?: () => void }).onClick}
                className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 min-h-[44px] transition-colors duration-150 ${
                  isActive
                    ? "text-earth"
                    : "text-muted-foreground active:text-earth"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={18} aria-hidden="true" strokeWidth={isActive ? 2.2 : 1.5} />
                <span className="text-[9px] font-medium uppercase tracking-[0.04em] leading-none">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════
          DESKTOP: Premium Minimal Sidebar
      ═══════════════════════════════════════════════════════ */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[240px] bg-white-feorm border-r border-earth/5 py-8 px-5 z-50"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <Link
          href="/marketplace"
          className="flex items-center gap-2 mb-10 px-1"
          aria-label="Feorm home"
        >
          <Image
            src="/feorm-logo.png"
            alt=""
            width={24}
            height={24}
            sizes="24px"
            className="rounded-[3px]"
          />
          <span className="font-serif-display text-xl italic lowercase">
            feorm<span className="text-harvest">.</span>
          </span>
        </Link>

        {/* Role Badge */}
        <div className="px-1 mb-5">
          <span
            className={`text-[8px] uppercase font-semibold px-2.5 py-1 rounded-full tracking-wider ${
              isProvider ? "tag-verified" : "tag-pastel"
            }`}
          >
            {isProvider ? "Provider" : "Voyager"}
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 flex flex-col gap-0.5" role="navigation">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(item as { onClick?: () => void }).onClick}
                className={`flex items-center gap-2.5 rounded-lg px-4 py-2.5 transition-all duration-150 min-h-[44px] group ${
                  isActive
                    ? "bg-earth text-white-feorm"
                    : "text-muted-foreground hover:bg-fog hover:text-earth"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  size={15}
                  className={`transition-colors duration-150 ${
                    isActive ? "text-harvest" : "text-sand group-hover:text-earth"
                  }`}
                  aria-hidden="true"
                />
                <span className="font-mono-feorm text-[10px] uppercase tracking-[0.06em] font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User + Sign Out */}
        <div className="border-t border-earth/5 pt-5 mt-2">
          <Link
            href="/profile"
            className="flex items-center gap-2.5 px-1 mb-3 group"
          >
            {renderAvatar(32)}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-earth truncate">
                {user?.name || "Demo"} {user?.surname || "User"}
              </p>
              <p className="font-mono-feorm text-[8px] text-muted-foreground uppercase tracking-widest truncate">
                {isProvider ? "Provider" : "Voyager"}
              </p>
            </div>
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("feorm-session");
              setHasCompletedOnboarding(false);
              router.push("/");
            }}
            className="flex items-center gap-2.5 rounded-lg px-4 py-2 text-destructive/70 hover:bg-[#FDEBEC] transition-all duration-150 w-full min-h-[40px]"
          >
            <LogOut size={14} aria-hidden="true" />
            <span className="font-mono-feorm text-[10px] uppercase tracking-[0.06em] font-medium">
              Sign Out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
