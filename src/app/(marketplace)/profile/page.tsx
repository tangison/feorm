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
  HUMANOID_AVATARS,
  isHumanoidAvatar,
  getHumanoidAvatar,
  isPresetAvatar,
  getPresetGradient,
  compressImage,
  resolveAvatarDisplay,
} from "@/lib/avatar";

export default function ProfilePage() {
  const { user, phone, avatarUrl, setAvatarUrl } = useFeormAuth();
  const router = useRouter();
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [generatingAvatar, setGeneratingAvatar] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Avatar preview
  const avatarPreview = useMemo(() => resolveAvatarDisplay(avatarUrl), [avatarUrl]);

  // ── Avatar Selection ──
  const handleSelectAvatar = useCallback(
    (avatarId: string) => {
      setAvatarUrl(avatarId);
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
      setAvatarUrl("/avatars/amara.svg");
    }
    setGeneratingAvatar(false);
  }, [user, setAvatarUrl]);

  // Resolve selected avatar label
  const selectedLabel = useMemo(() => {
    if (isHumanoidAvatar(avatarUrl)) {
      return getHumanoidAvatar(avatarUrl)?.label || null;
    }
    return null;
  }, [avatarUrl]);

  return (
    <div className="flex-grow w-full max-w-2xl mx-auto px-6 py-12 md:py-24">
      <div className="mb-12">
        <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          Account
        </p>
        <h1 className="font-serif-display text-4xl md:text-5xl text-earth mb-3 tracking-tight">
          Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Set up your profile so travelers and hosts know who you are.
        </p>
      </div>

      <div className="space-y-4">
        {/* ── User Identity Card ── */}
        <div className="bento-card p-6">
          <div className="flex items-center gap-5 mb-5">
            {/* Avatar display */}
            <div className="w-20 h-20 rounded-full bg-fog flex items-center justify-center shrink-0 overflow-hidden">
              {avatarPreview ? (
                avatarPreview.type === "humanoid" ? (
                  <Image
                    src={avatarPreview.src!}
                    alt="Your avatar"
                    width={80}
                    height={80}
                    sizes="80px"
                    className="w-full h-full object-cover"
                  />
                ) : avatarPreview.type === "preset" ? (
                  <div
                    className="w-full h-full"
                    style={{ background: avatarPreview.gradient ?? undefined }}
                  />
                ) : (
                  <Image
                    src={avatarPreview.src!}
                    alt="Your avatar"
                    width={80}
                    height={80}
                    sizes="80px"
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <Image
                  src="/avatars/amara.svg"
                  alt="Default avatar"
                  width={80}
                  height={80}
                  sizes="80px"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif-display text-xl text-earth">
                {user?.name && user?.surname
                  ? `${user.name} ${user.surname}`
                  : "Complete Your Profile"}
              </h3>
              <p className="text-sm text-muted-foreground font-mono-feorm flex items-center gap-1">
                <MapPin size={10} aria-hidden="true" />
                +264{phone || "810000000"}
              </p>
              {selectedLabel && (
                <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-accent-foreground mt-0.5">
                  {selectedLabel}
                </p>
              )}
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
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 text-[10px] uppercase tracking-widest font-mono-feorm text-muted-foreground hover:text-earth border border-soil/10 rounded-full hover:bg-fog transition-all min-h-[44px]"
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
            <div className="mt-5 pt-5 border-t border-soil/10 space-y-5">
              {/* Humanoid Avatars */}
              <div>
                <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-sand mb-4 text-center">
                  Pick a Profile Character
                </p>
                <div className="flex items-center justify-center gap-2.5">
                  {HUMANOID_AVATARS.map((ha) => (
                    <button
                      key={ha.id}
                      onClick={() => handleSelectAvatar(ha.id)}
                      className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-[0.95] overflow-hidden ${
                        avatarUrl === ha.id
                          ? `ring-2 ${ha.ring} ring-offset-2 ring-offset-white-feorm`
                          : "ring-1 ring-soil/10"
                      }`}
                      aria-label={`Select ${ha.label} avatar — ${ha.description}`}
                      title={`${ha.label} — ${ha.description}`}
                      type="button"
                    >
                      <Image
                        src={ha.src}
                        alt={ha.label}
                        width={56}
                        height={56}
                        sizes="56px"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                {/* Show selected character info */}
                {avatarUrl && isHumanoidAvatar(avatarUrl) && (() => {
                  const ha = getHumanoidAvatar(avatarUrl);
                  return ha ? (
                    <div className="text-center mt-3">
                      <p className="font-serif-display text-sm text-earth">{ha.label}</p>
                      <p className="font-mono-feorm text-[8px] uppercase tracking-widest text-muted-foreground">{ha.description}</p>
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Upload */}
              <div>
                <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-sand mb-3 text-center">
                  Or Upload Your Own Photo
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
                      <div className="w-3 h-3 rounded-full bg-earth animate-pulse" />
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
                <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-sand mb-3 text-center">
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
                      <div className="w-3 h-3 rounded-full bg-earth animate-pulse" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} /> Generate a Portrait
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
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground mb-1">
                Role
              </p>
              <p className="text-sm text-earth capitalize">{user?.role || "Explorer"}</p>
            </div>
            <div>
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground mb-1">
                Region
              </p>
              <p className="text-sm text-earth">{user?.region || "Khomas"}</p>
            </div>
            <div>
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground mb-1">
                Trust Score
              </p>
              <p className="text-sm text-earth flex items-center gap-1.5 font-mono-feorm">
                <Star size={14} className="text-harvest" /> 4.8
              </p>
            </div>
            <div>
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-muted-foreground mb-1">
                Member Since
              </p>
              <p className="text-sm text-earth">2026</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {!user?.verified && (
          <Link
            href="/verification"
            className="bento-card bento-card-lift p-6 flex items-center justify-between hover:border-earth/30 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-accent-foreground" />
              <div>
                <p className="text-sm font-medium text-earth">Get Verified to Build Trust</p>
                <p className="text-xs text-muted-foreground">Verified hosts get a trust badge and appear higher in search results</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}

        <Link
          href="/support"
          className="bento-card bento-card-lift p-6 flex items-center justify-between hover:border-earth/30 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Settings size={18} className="text-muted-foreground" />
            <p className="text-sm font-medium text-earth">Support Center</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <button
          onClick={() => {
            // TODO: Replace with Supabase Auth — supabase.auth.signOut()
            router.push("/");
          }}
          className="w-full bento-card p-6 flex items-center justify-between hover:border-destructive/30 transition-colors text-left group"
          type="button"
        >
          <div className="flex items-center gap-3">
            <LogOut size={18} className="text-destructive" />
            <p className="text-sm font-medium text-destructive">Sign Out</p>
          </div>
          <ChevronRight size={16} className="text-destructive group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
