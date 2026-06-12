"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFeormAuth, useFeormOnboarding } from "@/context/feorm-context";
import { useAuthMutations } from "@/hooks/use-auth";
import { ArrowLeft, ArrowRight, Camera, Upload, Sparkles } from "lucide-react";
import Image from "next/image";
import {
  HUMANOID_AVATARS,
  isHumanoidAvatar,
  getHumanoidAvatar,
  compressImage,
  resolveAvatarDisplay,
} from "@/lib/avatar";
import { NAMIBIAN_REGIONS } from "@/lib/regions";

export default function VoyagerProfilePage() {
  const { user, setUser, setAvatarUrl, avatarUrl } = useFeormAuth();
  const { selectedRole } = useFeormOnboarding();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [region, setRegion] = useState(user?.region || "");
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setupIdentity } = useAuthMutations();

  const avatarPreview = useMemo(
    () => resolveAvatarDisplay(avatarUrl),
    [avatarUrl]
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return;
      setUploadingAvatar(true);
      try {
        const dataUrl = await compressImage(file, 512, 0.8);
        setAvatarUrl(dataUrl);
      } catch {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") setAvatarUrl(reader.result);
        };
        reader.readAsDataURL(file);
      }
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [setAvatarUrl]
  );

  const handleContinue = useCallback(async () => {
    if (!name) return;
    setLoading(true);
    try {
      const userId = user?.id;
      if (userId) {
        await setupIdentity({
          userId,
          name,
          phone: phone ? `+264${phone.replace(/\s/g, "")}` : undefined,
          region,
          role: "voyager",
        });
      }
      setUser((prev: any) =>
        prev
          ? { ...prev, name, phone, region, role: "voyager" as const }
          : null
      );
      router.push("/auth/voyager/interests");
    } catch {
      router.push("/auth/voyager/interests");
    }
    setLoading(false);
  }, [name, phone, region, user, setupIdentity, setUser, router]);

  const selectedInfo = useMemo(() => {
    if (isHumanoidAvatar(avatarUrl)) return getHumanoidAvatar(avatarUrl);
    return null;
  }, [avatarUrl]);

  return (
    <div className="relative flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen">
      {/* Full bleed background */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/hero-gateway-mobile.png"
          alt=""
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)",
          }}
        />
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Back button */}
        <button
          onClick={() => router.push("/auth/role")}
          className="mb-6 flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors min-h-[44px]"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Logo */}
        <div className="text-center mb-6">
          <Image
            src="/feorm-logo.png"
            alt="Feorm"
            width={32}
            height={32}
            className="mx-auto mb-3 rounded-[3px]"
          />
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-harvest" />
          <div className="w-2 h-2 rounded-full bg-white/30" />
        </div>

        <h1 className="font-serif-display text-3xl md:text-4xl mb-3 text-white tracking-tight">
          Tell us about yourself
        </h1>
        <p className="text-sm text-white/60 leading-relaxed mb-8">
          Hosts want to know who is coming to stay. Add your details to get started.
        </p>

        <div className="space-y-4">
          {/* Full Name */}
          <div
            className="p-4 rounded-[8px]"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <label
              htmlFor="voyager-name"
              className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-white/60"
            >
              Full Name *
            </label>
            <input
              id="voyager-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Johan Deetlefs"
              autoComplete="name"
              className="w-full bg-transparent outline-none text-lg text-white placeholder-white/30"
            />
          </div>

          {/* Phone */}
          <div
            className="p-4 rounded-[8px]"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <label
              htmlFor="voyager-phone"
              className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-white/60"
            >
              Phone Number (Optional)
            </label>
            <div className="flex items-center">
              <span className="font-mono-feorm text-lg mr-3 text-white/50" aria-hidden="true">
                +264
              </span>
              <input
                id="voyager-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="81 000 0000"
                autoComplete="tel-national"
                className="w-full bg-transparent outline-none text-lg text-white placeholder-white/30 font-mono-feorm"
              />
            </div>
          </div>

          {/* Region */}
          <div
            className="p-4 rounded-[8px]"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <label
              htmlFor="voyager-region"
              className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-white/60"
            >
              Region
            </label>
            <select
              id="voyager-region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-transparent outline-none text-lg text-white min-h-[44px]"
            >
              <option value="" className="text-earth">Select your region</option>
              {NAMIBIAN_REGIONS.map((r) => (
                <option key={r} value={r} className="text-earth">{r}</option>
              ))}
            </select>
          </div>

          {/* Profile Photo (optional, skip) */}
          <div
            className="p-4 rounded-[8px]"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <p className="text-[10px] font-medium uppercase tracking-widest mb-3 text-white/60">
              Profile Photo (Optional)
            </p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center overflow-hidden shrink-0">
                {avatarPreview ? (
                  avatarPreview.type === "humanoid" ? (
                    <Image src={avatarPreview.src!} alt="Avatar" width={56} height={56} sizes="56px" className="w-full h-full object-cover" />
                  ) : avatarPreview.type === "preset" ? (
                    <div className="w-full h-full" style={{ background: avatarPreview.gradient ?? undefined }} />
                  ) : (
                    <Image src={avatarPreview.src!} alt="Avatar" width={56} height={56} sizes="56px" className="w-full h-full object-cover" />
                  )
                ) : (
                  <Camera size={20} className="text-white/30" />
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" aria-label="Upload profile image" />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors min-h-[44px]"
              >
                <Upload size={14} />
                {uploadingAvatar ? "Processing..." : "Upload Photo"}
              </button>
            </div>
          </div>

          {/* Continue */}
          <button
            onClick={handleContinue}
            disabled={!name || loading}
            className="w-full px-5 py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] rounded-full font-semibold"
            style={{ backgroundColor: "#C4933A", color: "#1E1A14" }}
          >
            {loading ? "Saving..." : "Complete Profile"}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
