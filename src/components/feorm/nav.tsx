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
  LogOut,
  X,
} from "lucide-react";
import { resolveAvatarDisplay } from "@/lib/avatar";

export default function FeormNav() {
  const { user, avatarUrl, setAvatarUrl } = useFeormAuth();
  const { setMarketView } = useFeormMarket();
  const { selectedRole, setHasCompletedOnboarding } = useFeormOnboarding();
  const pathname = usePathname();
  const router = useRouter();

  // Determine role from user context (more reliable than onboarding state)
  const userRole = user?.role;
  const isProvider = userRole === "provider_stay";
  const isAdmin = userRole === "admin";
  const isVoyager = userRole === "voyager";
  const isGuest = !user;

  const [moreOpen, setMoreOpen] = useState(false);

  // Close more menu (called from link click handlers)
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

  // ── Resolve avatar display ──
  const avatarDisplay = resolveAvatarDisplay(avatarUrl);

  // ── Helper: role display label ──
  const getRoleLabel = () => {
    if (isAdmin) return "Admin";
    if (userRole === "provider_stay") return "Farm Host";
    if (isVoyager) return "Traveler";
    return "Guest";
  };

  const getRoleTagStyle = () => {
    if (isAdmin) return "bg-harvest/20 text-harvest";
    if (isProvider) return "tag-verified";
    return "tag-pastel";
  };

  // ── Mobile bottom nav: 3-4 essential tabs ──
  const mobileTabs = isAdmin
    ? [
        { label: "Explore", href: "/marketplace", icon: MapPin, active: pathname === "/marketplace" || pathname.startsWith("/listing"), onClick: () => setMarketView("stays") },
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: pathname === "/dashboard" },
        { label: "Admin", href: "/admin", icon: Shield, active: pathname === "/admin" },
        { label: "Profile", href: "/profile", icon: User, active: pathname === "/profile" },
      ]
    : isProvider
    ? [
        { label: "My Farm Stays", href: "/marketplace", icon: Tent, active: pathname === "/marketplace" || pathname.startsWith("/listing"), onClick: () => setMarketView("stays") },
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: pathname === "/dashboard" },
        { label: "Profile", href: "/profile", icon: User, active: pathname === "/profile" },
      ]
    : [
        { label: "Farm Stays", href: "/marketplace", icon: MapPin, active: pathname === "/marketplace" || pathname.startsWith("/listing") },
        { label: "My Stays", href: "/journeys", icon: Clock, active: pathname === "/journeys" },
        { label: "Profile", href: "/profile", icon: User, active: pathname === "/profile" },
      ];

  // ── More menu items ──
  const moreItems = isAdmin
    ? [
        { label: "Settings", href: "/settings", icon: Settings },
        { label: "Support", href: "/support", icon: LifeBuoy },
      ]
    : isProvider
    ? [
        { label: "Verification", href: "/verification", icon: Shield },
        { label: "Settings", href: "/settings", icon: Settings },
        { label: "Support", href: "/support", icon: LifeBuoy },
      ]
    : [
        { label: "Verification", href: "/verification", icon: Shield },
        { label: "Settings", href: "/settings", icon: Settings },
        { label: "Support", href: "/support", icon: LifeBuoy },
      ];

  const signOut = useCallback(async () => {
    // Demo mode: clear localStorage and redirect
    if (typeof window !== "undefined") {
      localStorage.removeItem("feorm-demo-user");
    }
    setHasCompletedOnboarding(false);
    router.push("/");
  }, [setHasCompletedOnboarding, router]);

  // ── Shared avatar rendering ──
  const renderAvatar = (size: number = 32) => {
    if (!avatarDisplay) {
      return (
        <div className="rounded-full overflow-hidden shrink-0 bg-fog" style={{ width: size, height: size }}>
          <Image src="/avatars/amara.svg" alt="Avatar" width={size} height={size} sizes={`${size}px`} className="w-full h-full object-cover" />
        </div>
      );
    }

    if (avatarDisplay.type === "humanoid") {
      return (
        <div className="rounded-full overflow-hidden shrink-0 bg-fog" style={{ width: size, height: size }}>
          <Image src={avatarDisplay.src!} alt="Avatar" width={size} height={size} sizes={`${size}px`} className="w-full h-full object-cover" />
        </div>
      );
    }

    if (avatarDisplay.type === "preset") {
      return (
        <div
          className="rounded-full shrink-0"
          style={{ width: size, height: size, background: avatarDisplay.gradient ?? undefined }}
        />
      );
    }

    // Image URL or data URL
    return (
      <div className="rounded-full overflow-hidden shrink-0" style={{ width: size, height: size }}>
        <Image src={avatarDisplay.src!} alt="Avatar" width={size} height={size} sizes={`${size}px`} className="w-full h-full object-cover" />
      </div>
    );
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          MOBILE: Slim Top Header + Floating Bottom Nav
      ═══════════════════════════════════════════════════════ */}

      {/* Top Header — Brand + Avatar + More (48px) */}
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
              className={`text-[7px] uppercase font-bold px-1.5 py-0.5 rounded-full tracking-wider ${getRoleTagStyle()}`}
            >
              {getRoleLabel()}
            </span>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex items-center gap-1.5 min-h-[36px] min-w-[36px] justify-center rounded-full active:bg-earth/5 transition-colors"
              aria-label="More menu"
              aria-expanded={moreOpen}
            >
              {renderAvatar(28)}
            </button>
          </div>
        </div>
      </header>

      {/* Floating Bottom Tab Bar — 3-4 essential tabs */}
      <nav
        className="lg:hidden fixed bottom-4 left-4 right-4 z-40 bg-white-feorm/95 backdrop-blur-xl rounded-2xl shadow-lg shadow-earth/8 border border-earth/5 safe-area-bottom"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-around h-14">
          {mobileTabs.map((item) => {
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
                <Icon size={20} aria-hidden="true" strokeWidth={isActive ? 2.2 : 1.5} />
                <span className="text-[9px] font-medium uppercase tracking-[0.04em] leading-none">
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-harvest mt-0.5" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════
          MORE MENU — Takeaway sheet
      ═══════════════════════════════════════════════════════ */}
      {moreOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-earth/20 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
            aria-hidden="true"
          />

          {/* Sheet */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white-feorm rounded-t-2xl shadow-2xl border-t border-earth/5 safe-area-bottom animate-slide-up">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-8 h-1 rounded-full bg-sand/60" />
            </div>

            {/* User info */}
            <div className="px-5 pb-4 flex items-center gap-3 border-b border-earth/5">
              {renderAvatar(40)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-earth truncate">
                  {user?.name || "Guest"} {user?.surname || "User"}
                </p>
                <p className="font-mono-feorm text-[9px] text-muted-foreground uppercase tracking-widest">
                  {getRoleLabel()}
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

            {/* Menu items */}
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
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-earth hover:bg-fog transition-colors min-h-[44px]"
                  >
                    <Icon size={18} className="text-muted-foreground" aria-hidden="true" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Sign Out */}
            <div className="px-2 pb-4 pt-1 border-t border-earth/5 mx-2">
              <button
                onClick={signOut}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive-bg transition-colors w-full min-h-[44px]"
              >
                <LogOut size={18} aria-hidden="true" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════
          DESKTOP: Minimal Sidebar
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
            className={`text-[8px] uppercase font-semibold px-2.5 py-1 rounded-full tracking-wider ${getRoleTagStyle()}`}
          >
            {getRoleLabel()}
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 flex flex-col gap-0.5" role="navigation">
          {(isAdmin
            ? [
                { label: "Farm Stays", href: "/marketplace", icon: MapPin, active: pathname === "/marketplace" || pathname.startsWith("/listing"), onClick: () => setMarketView("stays") },
                { label: "Farm Stays", href: "/marketplace?view=stays", icon: Tent, active: false, onClick: () => setMarketView("stays") },
                { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: pathname === "/dashboard" },
                { label: "Admin", href: "/admin", icon: Shield, active: pathname === "/admin" },
                { label: "Profile", href: "/profile", icon: User, active: pathname === "/profile" },
                { label: "Settings", href: "/settings", icon: Settings, active: pathname === "/settings" },
                { label: "Support", href: "/support", icon: LifeBuoy, active: pathname === "/support" },
              ]
            : isProvider
            ? [
                { label: "Farm Stays", href: "/marketplace?view=stays", icon: Tent, active: pathname === "/marketplace", onClick: () => setMarketView("stays") },
                { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: pathname === "/dashboard" },
                { label: "Profile", href: "/profile", icon: User, active: pathname === "/profile" },
                { label: "Verification", href: "/verification", icon: Shield, active: pathname === "/verification" },
                { label: "Settings", href: "/settings", icon: Settings, active: pathname === "/settings" },
                { label: "Support", href: "/support", icon: LifeBuoy, active: pathname === "/support" },
              ]
            : [
                { label: "Farm Stays", href: "/marketplace", icon: MapPin, active: pathname === "/marketplace" || pathname.startsWith("/listing") },
                { label: "My Stays", href: "/journeys", icon: Clock, active: pathname === "/journeys" },
                { label: "Verification", href: "/verification", icon: Shield, active: pathname === "/verification" },
                { label: "Profile", href: "/profile", icon: User, active: pathname === "/profile" },
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
                {user?.name || "Guest"} {user?.surname || "User"}
              </p>
              <p className="font-mono-feorm text-[8px] text-muted-foreground uppercase tracking-widest truncate">
                {getRoleLabel()}
              </p>
            </div>
          </Link>
          <button
            onClick={signOut}
            className="flex items-center gap-2.5 rounded-lg px-4 py-2 text-destructive/70 hover:bg-destructive-bg transition-all duration-150 w-full min-h-[40px]"
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
