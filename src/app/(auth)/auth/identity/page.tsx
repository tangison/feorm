"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFeormAuth } from "@/context/feorm-context";
import { useAuthMutations } from "@/hooks/use-auth";
import { ArrowLeft, ArrowRight, Sparkles, Camera, Upload } from "lucide-react";
import Image from "next/image";
import {
  HUMANOID_AVATARS,
  isHumanoidAvatar,
  getHumanoidAvatar,
  isPresetAvatar,
  getPresetGradient,
  compressImage,
  resolveAvatarDisplay,
} from "@/lib/avatar";
import { NAMIBIAN_REGIONS } from "@/lib/regions";

export default function IdentityPage() {
  const { user, setUser, setAvatarUrl, avatarUrl } = useFeormAuth();
  const [name, setName] = useState(user?.name || "");
  const [surname, setSurname] = useState(user?.surname || "");
  const [phone, setPhoneLocal] = useState(user?.phone || "");
  const [region, setRegion] = useState(user?.region || "Khomas");
  const [loading, setLoading] = useState(false);
  const [generatingAvatar, setGeneratingAvatar] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setupIdentity } = useAuthMutations();

  // Derived: preview for current avatar
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
    if (!name) return;
    setGeneratingAvatar(true);
    try {
      const res = await fetch("/api/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, surname, region }),
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
  }, [name, surname, region, setAvatarUrl]);

  // ── Identity Setup ──
  const handleIdentitySetup = useCallback(async () => {
    if (!name) return;
    setLoading(true);
    try {
      const userId = user?.id;
      if (!userId) {
        router.push("/auth");
        return;
      }

      await setupIdentity({
        userId,
        name,
        surname,
        phone: phone ? `+264${phone.replace(/\s/g, "")}` : undefined,
        region,
        role: "guest",
      });
      setUser((prev: any) =>
        prev
          ? { ...prev, name, surname, phone, region, avatarUrl }
          : {
              id: userId,
              name,
              surname,
              phone,
              region,
              role: "guest",
              verified: false,
              avatarUrl,
            }
      );
      router.push("/auth/role");
    } catch {
      router.push("/auth/role");
    }
    setLoading(false);
  }, [name, surname, phone, region, user?.id, avatarUrl, setupIdentity, setUser, router]);

  // Resolve selected avatar info
  const selectedInfo = useMemo(() => {
    if (isHumanoidAvatar(avatarUrl)) {
      return getHumanoidAvatar(avatarUrl);
    }
    return null;
  }, [avatarUrl]);

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-fog">
      <div className="max-w-md w-full">
        <button
          onClick={() => router.push("/auth")}
          className="mb-8 flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-earth transition-colors min-h-[44px] rounded-full hover:bg-earth/5"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="mb-10">
          <kbd className="font-mono-feorm text-[10px] border border-soil/20 bg-white-feorm px-2 py-1 rounded text-muted-foreground mb-6 inline-block">
            YOUR PROFILE
          </kbd>
          <h1 className="font-serif-display text-3xl md:text-4xl mb-4 text-earth tracking-tight">
            Tell us about yourself
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pick an avatar and add your name. Hosts want to know who they are welcoming.
          </p>
        </div>

        <div className="space-y-5">
          {/* ── Avatar Section ── */}
          <div className="border border-soil/10 bg-white-feorm rounded-[8px] p-6">
            <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-5">
              Choose Your Avatar
            </p>

            {/* Preview Circle */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-sand flex items-center justify-center overflow-hidden shrink-0">
                {avatarPreview ? (
                  avatarPreview.type === "humanoid" ? (
                    <Image
                      src={avatarPreview.src!}
                      alt="Your avatar"
                      width={96}
                      height={96}
                      sizes="96px"
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
                      width={96}
                      height={96}
                      sizes="96px"
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <Camera size={24} className="text-sand" />
                )}
              </div>
            </div>

            {/* Humanoid Avatar Selection */}
            <div className="mb-6">
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-sand mb-4 text-center">
                Choose Your Character
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
              {selectedInfo && (
                <div className="text-center mt-3">
                  <p className="font-serif-display text-sm text-earth">{selectedInfo.label}</p>
                  <p className="font-mono-feorm text-[8px] uppercase tracking-widest text-muted-foreground">{selectedInfo.description}</p>
                </div>
              )}
            </div>

            {/* Upload Option */}
            <div className="mb-4">
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-sand mb-3 text-center">
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
                disabled={!name || generatingAvatar}
                className="w-full btn-harvest px-5 py-2.5 text-[10px] uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                type="button"
              >
                {generatingAvatar ? (
                  <>
                    <div className="w-3 h-3 rounded-full bg-earth animate-pulse" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={12} /> Generate Portrait
                  </>
                )}
              </button>
            </div>
          </div>

          {/* First Name */}
          <div className="border border-soil/20 bg-white-feorm p-4 rounded-[4px] focus-within:border-earth transition-colors">
            <label htmlFor="first-name" className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-muted-foreground">
              First Name
            </label>
            <input
              id="first-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Johan"
              autoComplete="given-name"
              className="w-full bg-transparent outline-none text-lg text-earth placeholder-sand min-h-[44px]"
            />
          </div>

          {/* Surname */}
          <div className="border border-soil/20 bg-white-feorm p-4 rounded-[4px] focus-within:border-earth transition-colors">
            <label htmlFor="surname" className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-muted-foreground">
              Surname
            </label>
            <input
              id="surname"
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="Deetlefs"
              autoComplete="family-name"
              className="w-full bg-transparent outline-none text-lg text-earth placeholder-sand min-h-[44px]"
            />
          </div>

          {/* Phone (optional) */}
          <div className="border border-soil/20 bg-white-feorm p-4 rounded-[4px] focus-within:border-earth transition-colors">
            <label htmlFor="phone-input" className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-muted-foreground">
              Phone Number (Optional)
            </label>
            <div className="flex items-center">
              <span className="font-mono-feorm text-lg mr-3 text-soil" aria-hidden="true">
                +264
              </span>
              <input
                id="phone-input"
                type="tel"
                value={phone}
                onChange={(e) => setPhoneLocal(e.target.value)}
                placeholder="81 000 0000"
                autoComplete="tel-national"
                className="w-full bg-transparent outline-none text-lg text-earth placeholder-sand font-mono-feorm"
              />
            </div>
          </div>

          {/* Region */}
          <div className="border border-soil/20 bg-white-feorm p-4 rounded-[4px] focus-within:border-earth transition-colors">
            <label htmlFor="region-select" className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-muted-foreground">
              Region
            </label>
            <select
              id="region-select"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-transparent outline-none text-lg text-earth min-h-[44px]"
            >
              {NAMIBIAN_REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Continue */}
          <button
            onClick={handleIdentitySetup}
            disabled={!name || loading}
            className="w-full btn-primary-feorm px-5 py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            type="button"
          >
            {loading ? "Saving..." : "Save & Continue"}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
