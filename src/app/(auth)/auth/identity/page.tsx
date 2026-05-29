"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFeormAuth } from "@/context/feorm-context";
import { useAuthMutations } from "@/hooks/use-auth";
import { ArrowLeft, ArrowRight, Sparkles, Camera, Upload } from "lucide-react";
import Image from "next/image";
import {
  PRESET_AVATARS,
  isPresetAvatar,
  getPresetGradient,
  compressImage,
} from "@/lib/avatar";
import { NAMIBIAN_REGIONS } from "@/lib/regions";

export default function IdentityPage() {
  const { phone, setUser, setAvatarUrl, avatarUrl } = useFeormAuth();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [region, setRegion] = useState("Khomas");
  const [loading, setLoading] = useState(false);
  const [generatingAvatar, setGeneratingAvatar] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setupIdentity } = useAuthMutations();

  // Derived: preview style for current avatar
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

      // Validate file type
      if (!file.type.startsWith("image/")) return;

      // Validate size (max 5MB)
      if (file.size > 5 * 1024 * 1024) return;

      setUploadingAvatar(true);
      try {
        const dataUrl = await compressImage(file, 512, 0.8);
        setAvatarUrl(dataUrl);
      } catch {
        // Fallback: use raw data URL
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setAvatarUrl(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
      setUploadingAvatar(false);
      // Reset file input
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
      setAvatarUrl("/images/avatar-placeholder.png");
    }
    setGeneratingAvatar(false);
  }, [name, surname, region, setAvatarUrl]);

  // ── Identity Setup ──
  const handleIdentitySetup = useCallback(async () => {
    if (!name || !surname) return;
    setLoading(true);
    try {
      const fullPhone = `+264${phone.replace(/\s/g, "")}`;
      await setupIdentity({
        phone: fullPhone,
        name,
        surname,
        region,
        role: "explorer",
      });
      setUser((prev: any) =>
        prev
          ? { ...prev, name, surname, region, avatarUrl }
          : {
              id: "demo",
              phone: fullPhone,
              name,
              surname,
              region,
              role: "explorer",
              verified: false,
              avatarUrl,
            }
      );
      router.push("/auth/role");
    } catch {
      router.push("/auth/role");
    }
    setLoading(false);
  }, [name, surname, region, phone, avatarUrl, setupIdentity, setUser, router]);

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-fog">
      <div className="max-w-md w-full">
        <button
          onClick={() => router.push("/auth/verify")}
          className="mb-8 flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-earth transition-colors min-h-[44px] rounded-full hover:bg-earth/5"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="mb-10">
          <kbd className="font-mono-feorm text-[10px] border border-soil/20 bg-white-feorm px-2 py-1 rounded text-muted-foreground mb-6 inline-block">
            YOUR PROFILE
          </kbd>
          <h1 className="font-serif-display text-3xl md:text-4xl mb-4 text-earth tracking-tight">
            Tell Us About Yourself
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Hosts want to know who they are welcoming. Add your name and region to build trust.
          </p>
        </div>

        <div className="space-y-5">
          {/* ── Avatar Creation ── */}
          <div className="border border-soil/10 bg-white-feorm rounded-[8px] p-6">
            <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground mb-5">
              Avatar Creation
            </p>

            {/* Preview Circle */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-sand flex items-center justify-center overflow-hidden shrink-0 relative">
                {avatarPreview ? (
                  avatarPreview.type === "preset" ? (
                    <div
                      className="w-full h-full"
                      style={{ background: avatarPreview.gradient ?? undefined }}
                    />
                  ) : (
                    <Image
                      src={avatarPreview.url}
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

            {/* Option 1: Choose a Preset */}
            <div className="mb-6">
              <p className="font-mono-feorm text-[9px] uppercase tracking-widest text-sand mb-3 text-center">
                Choose a Preset
              </p>
              <div className="grid grid-cols-4 gap-3 justify-items-center">
                {PRESET_AVATARS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`w-12 h-12 rounded-full transition-all duration-200 hover:scale-110 active:scale-[0.95] ${
                      avatarUrl === preset.id
                        ? "ring-2 ring-harvest ring-offset-2 ring-offset-white-feorm"
                        : "ring-1 ring-soil/10"
                    }`}
                    style={{ background: preset.gradient }}
                    aria-label={`Select ${preset.label} avatar`}
                    title={preset.label}
                    type="button"
                  />
                ))}
              </div>
            </div>

            {/* Option 2: Upload Your Own */}
            <div className="mb-5">
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

            {/* Option 3: Generate AI Identity */}
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
              <p className="text-[9px] text-muted-foreground font-mono-feorm text-center uppercase tracking-wider mt-2">
                Editorial-style portrait for your profile
              </p>
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
            disabled={!name || !surname || loading}
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
