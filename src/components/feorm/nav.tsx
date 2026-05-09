"use client";

import { useFeorm } from "@/context/feorm-context";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
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
    <nav className="border-b border-[#3C2F1A]/10 bg-[#FEFDFB] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/marketplace" className="flex items-center gap-2">
            <Image
              src="/feorm-logo.png"
              alt="Feorm"
              width={32}
              height={32}
              className="rounded-[4px]"
            />
            <span className="font-serif-display text-2xl italic lowercase">
              feorm<span className="text-[#E8C96A]">.</span>
            </span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <button
              onClick={() => {
                setMarketView("stays");
                router.push("/marketplace?view=stays");
              }}
              className={`pb-1 transition-colors ${
                pathname === "/marketplace" && marketView === "stays"
                  ? "text-[#1E1A14] border-b-2 border-[#1E1A14]"
                  : "text-[#787774] border-b-2 border-transparent hover:text-[#1E1A14]"
              }`}
            >
              Farm Stays
            </button>
            <button
              onClick={() => {
                setMarketView("equipment");
                router.push("/marketplace?view=equipment");
              }}
              className={`pb-1 transition-colors ${
                pathname === "/marketplace" && marketView === "equipment"
                  ? "text-[#1E1A14] border-b-2 border-[#1E1A14]"
                  : "text-[#787774] border-b-2 border-transparent hover:text-[#1E1A14]"
              }`}
            >
              Equipment
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/journeys"
            className="hidden md:block btn-secondary-feorm px-4 py-2 text-xs uppercase tracking-widest"
          >
            My Journeys
          </Link>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden"
          >
            {mobileNavOpen ? (
              <X size={20} className="text-[#1E1A14]" />
            ) : (
              <Menu size={20} className="text-[#1E1A14]" />
            )}
          </button>
          <Link
            href="/profile"
            className="h-8 w-8 bg-[#FAF7F2] border border-[#3C2F1A]/10 rounded-full flex items-center justify-center text-xs font-medium text-[#3C2F1A] hover:bg-[#F2EDE2] transition-colors"
          >
            {userInitials}
          </Link>
        </div>
      </div>

      {/* Mobile Sub-Nav (Marketplace Toggle) */}
      {pathname === "/marketplace" && (
        <div className="md:hidden flex border-t border-[#3C2F1A]/5 bg-[#FAF7F2]">
          <button
            onClick={() => setMarketView("stays")}
            className={`flex-1 py-3 text-xs font-medium ${
              marketView === "stays"
                ? "text-[#1E1A14] border-b-2 border-[#1E1A14]"
                : "text-[#787774] border-b-2 border-transparent"
            }`}
          >
            Farm Stays
          </button>
          <button
            onClick={() => setMarketView("equipment")}
            className={`flex-1 py-3 text-xs font-medium ${
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
        <div className="md:hidden border-t border-[#3C2F1A]/10 bg-[#FEFDFB] p-6 space-y-4">
          <Link
            href="/marketplace"
            onClick={() => setMobileNavOpen(false)}
            className="flex items-center gap-3 text-sm text-[#1E1A14]"
          >
            <Home size={16} /> Marketplace
          </Link>
          <Link
            href="/journeys"
            onClick={() => setMobileNavOpen(false)}
            className="flex items-center gap-3 text-sm text-[#1E1A14]"
          >
            <Clock size={16} /> My Journeys
          </Link>
          {user?.role === "lister" && (
            <Link
              href="/dashboard"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-3 text-sm text-[#1E1A14]"
            >
              <Package size={16} /> Host Dashboard
            </Link>
          )}
          <Link
            href="/profile"
            onClick={() => setMobileNavOpen(false)}
            className="flex items-center gap-3 text-sm text-[#1E1A14]"
          >
            <User size={16} /> Profile
          </Link>
          <Link
            href="/support"
            onClick={() => setMobileNavOpen(false)}
            className="flex items-center gap-3 text-sm text-[#1E1A14]"
          >
            <MessageCircle size={16} /> Support
          </Link>
          <div className="pt-4 border-t border-[#3C2F1A]/10">
            <button
              onClick={() => {
                setMobileNavOpen(false);
                localStorage.removeItem("feorm-session");
                router.push("/");
              }}
              className="flex items-center gap-3 text-sm text-[#9F2F2D]"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
