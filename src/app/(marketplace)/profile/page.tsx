"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useFeormAuth } from "@/context/feorm-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  Star,
  Settings,
  LogOut,
  ChevronRight,
  MapPin,
  ChevronDown,
  Sparkles,
  Camera,
  Upload,
} from "lucide-react";
import {
  PRESET_AVATARS,
  isPresetAvatar,
  getPresetGradient,
  compressImage,
} from "@/lib/avatar";

export default function ProfilePage() {
  const { user, phone, avatarUrl, setAvatarUrl } = useFeormAuth();
  const router = useRouter();
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [generatingAvatar, setGeneratingAvatar] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userInitials =
    user?.name && user?.surname
      ? `${user.name[0]}${user.surname[0]}`
      : "JD";

  // Avatar preview
  const avatarPreview = useMemo(() => {
    if (!avatarUrl) return null;
    if (isPresetAvatar(avatarUrl)) {
      const gradient = getPresetGradient(avatarUrl);
      return { type: "preset" as const, gradient };
    }
    return { type: "image" as const, url: avatarUrl };
  }, [avatarUrl]);

  // ── Preset Avatar Selection ──
  const handleSelectPreset = useCallback(
    (presetId: string) => {
      setAvatarUrl(presetId);
    },
    [setAvatarUrl]
  );

  // ── Custom Upload ──
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) return;

      setUploadingAvatar(true);
      try {
        const dataUrl = await compressImage(file, 512, 0.8);
        setAvatarUrl(dataUrl);
      } catch {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setAvatarUrl(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [setAvatarUrl]
  );

  // ── AI Generation ──
  const handleGenerateAvatar = useCallback(async () => {
    setGeneratingAvatar(true);
    try {
      const res = await fetch("/api/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user?.name || "User",
          surname: user?.surname || "",
          region: user?.region || "Namibia",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.avatarUrl) {
          setAvatarUrl(data.avatarUrl);
        }
      }
    } catch {
      setAvatarUrl("/images/avatar-placeholder.png");
    }
    setGeneratingAvatar(false);
  }, [user, setAvatarUrl]);

  return (
    <div className="flex-grow w-full max-w-2xl mx-auto px-6 py-12 md:py-24">
      <div className="mb-12">
        <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
          Account
        </p>
        <h1 className="font-serif-display text-4xl md:text-5xl text-[#1E1A14] mb-3 tracking-tight">
          Profile
        </h1>
        <p className="text-sm text-[#787774]">
          Manage your identity, verification, and account settings.
        </p>
      </div>

      <div className="space-y-4">
        {/* ── User Identity Card ── */}
        <div className="bento-card p-6">
          <div className="flex items-center gap-5 mb-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-[#1E1A14] text-[#FEFDFB] flex items-center justify-center text-xl font-medium font-serif-display shrink-0 overflow-hidden">
              {avatarPreview ? (
                avatarPreview.type === "preset" ? (
                  <div
                    className="w-full h-full"
                    style={{ background: avatarPreview.gradient }}
                  />
                ) : (
                  <Image
                    src={avatarPreview.url}
                    alt="Your avatar"
                    width={80}
                    height={80}
                    sizes="80px"
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                userInitials
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif-display text-xl text-[#1E1A14]">
                {user?.name && user?.surname
                  ? `${user.name} ${user.surname}`
                  : "Complete Your Profile"}
              </h3>
              <p className="text-sm text-[#787774] font-mono-feorm flex items-center gap-1">
                <MapPin size={10} aria-hidden="true" />
                +264{phone || "810000000"}
              </p>
            </div>
            <span
              className={`text-[9px] uppercase font-semibold px-2.5 py-1 rounded-full tracking-wider shrink-0 ${
                user?.verified ? "tag-verified" : "tag-pastel"
              }`}
            >
              {user?.verified ? "Verified" : "Unverified"}
            </span>
          </div>

          {/* Change Avatar Button */}
          <button
            onClick={() => setAvatarPickerOpen(!avatarPickerOpen)}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-[10px] uppercase tracking-widest font-mono-feorm text-[#787774] hover:text-[#1E1A14] border border-[#3C2F1A]/10 rounded-full hover:bg-[#FAF7F2] transition-all min-h-[44px]"
            type="button"
            aria-expanded={avatarPickerOpen}
          >
            <Camera size={12} />
            Change Avatar
            <ChevronDown
              size={12}
              className={`transition-transform duration-200 ${
                avatarPickerOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Collapsible Avatar Picker */}
          {avatarPickerOpen && (
            <div className="mt-5 pt-5 border-t border-[#3C2F1A]/10 space-y-5">
              {/* Preset Avatars */}
              <div>
                <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#D4C4A0] mb-3 text-center">
                  Choose a Preset
                </p>
                <div className="grid grid-cols-4 gap-3 justify-items-center">
                  {PRESET_AVATARS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset.id)}
                      className={`w-12 h-12 rounded-full transition-all duration-200 hover:scale-110 active:scale-[0.95] ${
                        avatarUrl === preset.id
                          ? "ring-2 ring-[#E8C96A] ring-offset-2 ring-offset-[#FEFDFB]"
                          : "ring-1 ring-[#3C2F1A]/10"
                      }`}
                      style={{ background: preset.gradient }}
                      aria-label={`Select ${preset.label} avatar`}
                      title={preset.label}
                      type="button"
                    />
                  ))}
                </div>
              </div>

              {/* Upload */}
              <div>
                <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#D4C4A0] mb-3 text-center">
                  Or Upload Your Own
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Upload profile image"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="w-full btn-secondary-feorm px-5 py-2.5 text-[10px] uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 min-h-[44px]"
                  type="button"
                >
                  {uploadingAvatar ? (
                    <>
                      <div className="w-3 h-3 rounded-full bg-[#1E1A14] animate-pulse" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload size={12} /> Upload Photo
                    </>
                  )}
                </button>
              </div>

              {/* AI Generate */}
              <div>
                <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#D4C4A0] mb-3 text-center">
                  Or Generate with AI
                </p>
                <button
                  onClick={handleGenerateAvatar}
                  disabled={generatingAvatar}
                  className="w-full btn-harvest px-5 py-2.5 text-[10px] uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 min-h-[44px]"
                  type="button"
                >
                  {generatingAvatar ? (
                    <>
                      <div className="w-3 h-3 rounded-full bg-[#1E1A14] animate-pulse" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} /> Generate AI Identity
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="bento-card p-6">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#787774] mb-1">
                Role
              </p>
              <p className="text-sm text-[#1E1A14] capitalize">{user?.role || "Explorer"}</p>
            </div>
            <div>
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#787774] mb-1">
                Region
              </p>
              <p className="text-sm text-[#1E1A14]">{user?.region || "Khomas"}</p>
            </div>
            <div>
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#787774] mb-1">
                Trust Score
              </p>
              <p className="text-sm text-[#1E1A14] flex items-center gap-1.5 font-mono-feorm">
                <Star size={14} className="text-[#E8C96A]" /> 4.8
              </p>
            </div>
            <div>
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#787774] mb-1">
                Member Since
              </p>
              <p className="text-sm text-[#1E1A14]">2026</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {!user?.verified && (
          <Link
            href="/verification"
            className="bento-card bento-card-lift p-6 flex items-center justify-between hover:border-[#1E1A14]/30 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-[#956400]" />
              <div>
                <p className="text-sm font-medium text-[#1E1A14]">Complete Verification</p>
                <p className="text-xs text-[#787774]">Upload ID to unlock full marketplace access</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#787774] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}

        <Link
          href="/support"
          className="bento-card bento-card-lift p-6 flex items-center justify-between hover:border-[#1E1A14]/30 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Settings size={18} className="text-[#787774]" />
            <p className="text-sm font-medium text-[#1E1A14]">Support Center</p>
          </div>
          <ChevronRight size={16} className="text-[#787774] group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <button
          onClick={() => {
            localStorage.removeItem("feorm-session");
            router.push("/");
          }}
          className="w-full bento-card p-6 flex items-center justify-between hover:border-[#9F2F2D]/30 transition-colors text-left group"
          type="button"
        >
          <div className="flex items-center gap-3">
            <LogOut size={18} className="text-[#9F2F2D]" />
            <p className="text-sm font-medium text-[#9F2F2D]">Sign Out</p>
          </div>
          <ChevronRight size={16} className="text-[#9F2F2D] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
