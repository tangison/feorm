"use client";

import { useFeorm } from "@/context/feorm-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Star, Settings, LogOut, ChevronRight } from "lucide-react";

export default function ProfilePage() {
  const { user, phone } = useFeorm();
  const router = useRouter();

  const userInitials =
    user?.name && user?.surname
      ? `${user.name[0]}${user.surname[0]}`
      : "JD";

  return (
    <div className="flex-grow w-full max-w-2xl mx-auto px-6 py-12 md:py-24">
      <div className="mb-12">
        <h2 className="font-serif-display text-4xl md:text-5xl text-[#1E1A14] mb-3">
          Profile
        </h2>
        <p className="text-sm text-[#787774]">
          Manage your identity, verification, and account settings.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bento-card p-6 flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-[#1E1A14] text-[#FEFDFB] flex items-center justify-center text-xl font-medium font-serif-display">
            {userInitials}
          </div>
          <div className="flex-grow">
            <h3 className="font-serif-display text-xl text-[#1E1A14]">
              {user?.name} {user?.surname}
            </h3>
            <p className="text-sm text-[#787774] font-mono-feorm">
              +264{phone}
            </p>
          </div>
          <span
            className={`text-[10px] uppercase font-medium px-2.5 py-1 rounded-full ${
              user?.verified ? "tag-verified" : "tag-pastel"
            }`}
          >
            {user?.verified ? "Verified" : "Unverified"}
          </span>
        </div>

        <div className="bento-card p-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-1">
                Role
              </p>
              <p className="text-[#1E1A14] capitalize">{user?.role || "Explorer"}</p>
            </div>
            <div>
              <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-1">
                Region
              </p>
              <p className="text-[#1E1A14]">{user?.region || "—"}</p>
            </div>
            <div>
              <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-1">
                Trust Score
              </p>
              <p className="text-[#1E1A14] flex items-center gap-1">
                <Star size={14} className="text-[#E8C96A]" /> 4.8
              </p>
            </div>
            <div>
              <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-1">
                Member Since
              </p>
              <p className="text-[#1E1A14]">2026</p>
            </div>
          </div>
        </div>

        {!user?.verified && (
          <Link
            href="/auth/verify-id"
            className="w-full bento-card p-4 flex items-center justify-between hover:border-[#1E1A14] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-[#956400]" />
              <div>
                <p className="text-sm font-medium text-[#1E1A14]">Complete Verification</p>
                <p className="text-xs text-[#787774]">Upload ID to unlock full marketplace access</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#787774]" />
          </Link>
        )}

        <Link
          href="/support"
          className="w-full bento-card p-4 flex items-center justify-between hover:border-[#1E1A14] transition-colors"
        >
          <div className="flex items-center gap-3">
            <Settings size={18} className="text-[#787774]" />
            <p className="text-sm font-medium text-[#1E1A14]">Support Center</p>
          </div>
          <ChevronRight size={16} className="text-[#787774]" />
        </Link>

        <button
          onClick={() => {
            localStorage.removeItem("feorm-session");
            router.push("/");
          }}
          className="w-full bento-card p-4 flex items-center justify-between hover:border-[#9F2F2D] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <LogOut size={18} className="text-[#9F2F2D]" />
            <p className="text-sm font-medium text-[#9F2F2D]">Sign Out</p>
          </div>
          <ChevronRight size={16} className="text-[#9F2F2D]" />
        </button>
      </div>
    </div>
  );
}
