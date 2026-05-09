"use client";

import { useFeorm } from "@/context/feorm-context";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  Clock,
  Package,
  User,
  MessageCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function FeormNav() {
  const { user, phone, marketView, setMarketView } = useFeorm();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const userInitials =
    user?.name && user?.surname
      ? `${user.name[0]}${user.surname[0]}`
      : "JD";

  return (
    <nav className="border-b border-[#3C2F1A]/10 bg-[#FEFDFB] sticky top-0 z-40" aria-label="Main navigation">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/marketplace" className="flex items-center gap-2" aria-label="Feorm — Return to marketplace">
            <Image
              src="/feorm-logo.png"
              alt=""
              width={32}
              height={32}
              className="rounded-[4px]"
            />
            <span className="font-serif-display text-2xl italic lowercase">
              feorm<span className="text-[#E8C96A]">.</span>
            </span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium" role="tablist">
            <Link
              href="/marketplace?view=stays"
              onClick={() => setMarketView("stays")}
              role="tab"
              aria-selected={pathname === "/marketplace" && marketView === "stays"}
              className={`pb-1 transition-colors min-h-[44px] flex items-center ${
                pathname === "/marketplace" && marketView === "stays"
                  ? "text-[#1E1A14] border-b-2 border-[#1E1A14]"
                  : "text-[#787774] border-b-2 border-transparent hover:text-[#1E1A14]"
              }`}
            >
              Farm Stays
            </Link>
            <Link
              href="/marketplace?view=equipment"
              onClick={() => setMarketView("equipment")}
              role="tab"
              aria-selected={pathname === "/marketplace" && marketView === "equipment"}
              className={`pb-1 transition-colors min-h-[44px] flex items-center ${
                pathname === "/marketplace" && marketView === "equipment"
                  ? "text-[#1E1A14] border-b-2 border-[#1E1A14]"
                  : "text-[#787774] border-b-2 border-transparent hover:text-[#1E1A14]"
              }`}
            >
              Equipment
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/journeys"
            className="hidden md:flex btn-secondary-feorm px-4 py-2 text-xs uppercase tracking-widest items-center min-h-[44px]"
          >
            My Journeys
          </Link>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-expanded={mobileNavOpen}
            aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
          >
            {mobileNavOpen ? (
              <X size={20} className="text-[#1E1A14]" />
            ) : (
              <Menu size={20} className="text-[#1E1A14]" />
            )}
          </button>
          <Link
            href="/profile"
            aria-label={`Profile: ${user?.name || "User"}`}
            className="h-10 w-10 min-w-[44px] min-h-[44px] bg-[#FAF7F2] border border-[#3C2F1A]/10 rounded-full flex items-center justify-center text-xs font-medium text-[#3C2F1A] hover:bg-[#F2EDE2] transition-colors"
          >
            {userInitials}
          </Link>
        </div>
      </div>

      {/* Mobile Sub-Nav (Marketplace Toggle) */}
      {pathname === "/marketplace" && (
        <div className="md:hidden flex border-t border-[#3C2F1A]/5 bg-[#FAF7F2]" role="tablist">
          <button
            onClick={() => setMarketView("stays")}
            role="tab"
            aria-selected={marketView === "stays"}
            className={`flex-1 py-3 text-xs font-medium min-h-[44px] ${
              marketView === "stays"
                ? "text-[#1E1A14] border-b-2 border-[#1E1A14]"
                : "text-[#787774] border-b-2 border-transparent"
            }`}
          >
            Farm Stays
          </button>
          <button
            onClick={() => setMarketView("equipment")}
            role="tab"
            aria-selected={marketView === "equipment"}
            className={`flex-1 py-3 text-xs font-medium min-h-[44px] ${
              marketView === "equipment"
                ? "text-[#1E1A14] border-b-2 border-[#1E1A14]"
                : "text-[#787774] border-b-2 border-transparent"
            }`}
          >
            Equipment
          </button>
        </div>
      )}

      {/* Mobile Full Nav Dropdown */}
      {mobileNavOpen && (
        <div className="md:hidden border-t border-[#3C2F1A]/10 bg-[#FEFDFB] p-6 space-y-2" role="menu">
          <Link
            href="/marketplace"
            onClick={() => setMobileNavOpen(false)}
            className="flex items-center gap-3 text-sm text-[#1E1A14] min-h-[44px] py-2"
            role="menuitem"
          >
            <Home size={16} aria-hidden="true" /> Marketplace
          </Link>
          <Link
            href="/journeys"
            onClick={() => setMobileNavOpen(false)}
            className="flex items-center gap-3 text-sm text-[#1E1A14] min-h-[44px] py-2"
            role="menuitem"
          >
            <Clock size={16} aria-hidden="true" /> My Journeys
          </Link>
          {user?.role === "lister" && (
            <Link
              href="/dashboard"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-3 text-sm text-[#1E1A14] min-h-[44px] py-2"
              role="menuitem"
            >
              <Package size={16} aria-hidden="true" /> Host Dashboard
            </Link>
          )}
          <Link
            href="/profile"
            onClick={() => setMobileNavOpen(false)}
            className="flex items-center gap-3 text-sm text-[#1E1A14] min-h-[44px] py-2"
            role="menuitem"
          >
            <User size={16} aria-hidden="true" /> Profile
          </Link>
          <Link
            href="/support"
            onClick={() => setMobileNavOpen(false)}
            className="flex items-center gap-3 text-sm text-[#1E1A14] min-h-[44px] py-2"
            role="menuitem"
          >
            <MessageCircle size={16} aria-hidden="true" /> Support
          </Link>
          <div className="pt-4 border-t border-[#3C2F1A]/10">
            <button
              onClick={() => {
                setMobileNavOpen(false);
                localStorage.removeItem("feorm-session");
                router.push("/");
              }}
              className="flex items-center gap-3 text-sm text-[#9F2F2D] min-h-[44px] py-2"
              role="menuitem"
            >
              <LogOut size={16} aria-hidden="true" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
