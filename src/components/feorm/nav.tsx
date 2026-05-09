"use client";

import { useFeorm } from "@/context/feorm-context";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Clock,
  LayoutDashboard,
  User,
  LifeBuoy,
  LogOut,
  Tent,
  Wrench,
} from "lucide-react";

export default function FeormNav() {
  const { user, setMarketView } = useFeorm();
  const pathname = usePathname();
  const router = useRouter();

  const userInitials =
    user?.name && user?.surname
      ? `${user.name[0]}${user.surname[0]}`
      : "JD";

  const navItems = [
    {
      label: "Farm Stays",
      href: "/marketplace?view=stays",
      icon: Tent,
      active: pathname === "/marketplace",
      onClick: () => setMarketView("stays"),
    },
    {
      label: "Equipment",
      href: "/marketplace?view=equipment",
      icon: Wrench,
      active: pathname === "/marketplace",
      onClick: () => setMarketView("equipment"),
    },
    {
      label: "Journeys",
      href: "/journeys",
      icon: Clock,
      active: pathname === "/journeys",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
      active: pathname === "/profile",
    },
    {
      label: "Support",
      href: "/support",
      icon: LifeBuoy,
      active: pathname === "/support",
    },
  ];

  // Mobile bottom nav — primary 4 items only
  const mobileNavItems = [
    {
      label: "Explore",
      href: "/marketplace",
      icon: MapPin,
      active: pathname === "/marketplace" || pathname.startsWith("/listing"),
    },
    {
      label: "Journeys",
      href: "/journeys",
      icon: Clock,
      active: pathname === "/journeys",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
      active: pathname === "/profile",
    },
  ];

  return (
    <>
      {/* ── Desktop Sidebar (Left) ────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[260px] bg-[#FEFDFB] border-r border-[#3C2F1A]/10 py-10 px-6 z-50"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <Link
          href="/marketplace"
          className="flex items-center gap-2.5 mb-12 px-2"
          aria-label="Feorm — Return to marketplace"
        >
          <Image
            src="/feorm-logo.png"
            alt=""
            width={28}
            height={28}
            className="rounded-[4px]"
          />
          <span className="font-serif-display text-2xl italic lowercase">
            feorm<span className="text-[#E8C96A]">.</span>
          </span>
        </Link>

        {/* Nav Items */}
        <nav className="flex-1 flex flex-col gap-1" role="navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={item.onClick}
                className={`flex items-center gap-3 rounded-full px-5 py-3 transition-all duration-200 min-h-[44px] group ${
                  isActive
                    ? "bg-[#1E1A14] text-[#FEFDFB]"
                    : "text-[#787774] hover:bg-[#FAF7F2] hover:text-[#1E1A14]"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  size={16}
                  className={`transition-colors duration-200 ${
                    isActive ? "text-[#E8C96A]" : "text-[#787774] group-hover:text-[#1E1A14]"
                  }`}
                  aria-hidden="true"
                />
                <span className="font-mono-feorm text-[11px] uppercase tracking-[0.05em] font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User + Sign Out */}
        <div className="border-t border-[#3C2F1A]/10 pt-6 mt-4">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-2 mb-4 group"
          >
            <div className="w-9 h-9 rounded-full bg-[#1E1A14] text-[#FEFDFB] flex items-center justify-center text-xs font-medium font-serif-display">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1E1A14] truncate">
                {user?.name || "Demo"} {user?.surname || "User"}
              </p>
              <p className="font-mono-feorm text-[9px] text-[#787774] uppercase tracking-widest truncate">
                {user?.role || "Explorer"}
              </p>
            </div>
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("feorm-session");
              router.push("/");
            }}
            className="flex items-center gap-3 rounded-full px-5 py-2.5 text-[#9F2F2D] hover:bg-[#FDEBEC] transition-all duration-200 w-full min-h-[44px]"
          >
            <LogOut size={16} aria-hidden="true" />
            <span className="font-mono-feorm text-[11px] uppercase tracking-[0.05em] font-medium">
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Nav ─────────────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-[#FEFDFB] border-t border-[#3C2F1A]/10 flex justify-around items-center z-50 px-2 safe-area-bottom"
        aria-label="Mobile navigation"
      >
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] rounded-2xl transition-all duration-200 ${
                isActive
                  ? "text-[#1E1A14]"
                  : "text-[#787774] active:scale-[0.95]"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                size={20}
                className={`transition-colors duration-200 ${
                  isActive ? "text-[#1E1A14]" : "text-[#787774]"
                }`}
                aria-hidden="true"
              />
              <span
                className={`font-mono-feorm text-[9px] uppercase tracking-[0.05em] font-medium ${
                  isActive ? "text-[#1E1A14]" : "text-[#787774]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
