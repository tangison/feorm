"use client";

import { useFeormAuth, useFeormMarket, useFeormOnboarding } from "@/context/feorm-context";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Clock,
  LayoutDashboard,
  User,
  Tent,
  Wrench,
  Settings,
  Shield,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import { isPresetAvatar, getPresetGradient } from "@/lib/avatar";

export default function FeormNav() {
  const { user, avatarUrl } = useFeormAuth();
  const { setMarketView } = useFeormMarket();
  const { selectedRole, setHasCompletedOnboarding } = useFeormOnboarding();
  const pathname = usePathname();
  const router = useRouter();

  const isProvider = selectedRole === "provider";

  const userInitials =
    user?.name && user?.surname
      ? `${user.name[0]}${user.surname[0]}`
      : "JD";

  const isPreset = avatarUrl && isPresetAvatar(avatarUrl);
  const presetGradient = isPreset ? getPresetGradient(avatarUrl) : null;

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

  // ── Mobile two-line nav items (compact set) ──
  const mobileProviderNav = [
    { label: "Stays", href: "/marketplace?view=stays", icon: Tent, active: pathname === "/marketplace", onClick: () => setMarketView("stays") },
    { label: "Gear", href: "/marketplace?view=equipment", icon: Wrench, active: pathname === "/marketplace", onClick: () => setMarketView("equipment") },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: pathname === "/dashboard" },
    { label: "Profile", href: "/profile", icon: User, active: pathname === "/profile" },
  ];

  const mobileVoyagerNav = [
    { label: "Explore", href: "/marketplace", icon: MapPin, active: pathname === "/marketplace" || pathname.startsWith("/listing") },
    { label: "Journeys", href: "/journeys", icon: Clock, active: pathname === "/journeys" },
    { label: "Profile", href: "/profile", icon: User, active: pathname === "/profile" },
    { label: "Settings", href: "/settings", icon: Settings, active: pathname === "/settings" },
  ];

  const desktopNavItems = isProvider ? providerNavItems : voyagerNavItems;
  const mobileNavItems = isProvider ? mobileProviderNav : mobileVoyagerNav;

  const hasActiveNav = mobileNavItems.some((i) => i.active);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          MOBILE: Premium Two-Line Navigation
          Line 1: Brand + Avatar (48px)
          Line 2: Nav tabs with active indicator (48px)
      ═══════════════════════════════════════════════════════ */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white-feorm/90 backdrop-blur-xl border-b border-earth/5">
        {/* Line 1 — Brand Row */}
        <div className="flex items-center justify-between h-12 px-5">
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

          <div className="flex items-center gap-2.5">
            <span
              className={`text-[8px] uppercase font-semibold px-2 py-0.5 rounded-full tracking-wider ${
                isProvider ? "tag-verified" : "tag-pastel"
              }`}
            >
              {isProvider ? "Provider" : "Voyager"}
            </span>
            <Link
              href="/profile"
              className="w-8 h-8 rounded-full bg-earth text-white-feorm flex items-center justify-center text-[10px] font-medium overflow-hidden"
              style={presetGradient ? { background: presetGradient } : undefined}
              aria-label="Profile"
            >
              {avatarUrl && !isPreset ? (
                <Image
                  src={avatarUrl}
                  alt="Avatar"
                  width={32}
                  height={32}
                  sizes="32px"
                  className="w-full h-full object-cover"
                />
              ) : !avatarUrl ? (
                userInitials
              ) : null}
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("feorm-session");
                setHasCompletedOnboarding(false);
                router.push("/");
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-fog hover:text-destructive transition-colors active:scale-[0.95]"
              aria-label="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* Line 2 — Nav Tabs */}
        <nav className="flex items-center h-12 px-2 gap-1" role="navigation" aria-label="Main navigation">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={(item as { onClick?: () => void }).onClick}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all duration-200 min-h-[44px] text-[11px] uppercase tracking-[0.04em] font-medium ${
                  isActive
                    ? "bg-earth text-white-feorm"
                    : "text-muted-foreground active:scale-[0.96]"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={14} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </header>

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
            <div
              className="w-8 h-8 rounded-full bg-earth text-white-feorm flex items-center justify-center text-[10px] font-medium overflow-hidden"
              style={presetGradient ? { background: presetGradient } : undefined}
            >
              {avatarUrl && !isPreset ? (
                <Image
                  src={avatarUrl}
                  alt="Avatar"
                  width={32}
                  height={32}
                  sizes="32px"
                  className="w-full h-full object-cover"
                />
              ) : !avatarUrl ? (
                userInitials
              ) : null}
            </div>
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
