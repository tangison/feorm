/**
 * Feorm Humanoid Avatar System
 *
 * 5 brand-aligned cartoonish humanoid avatars representing Namibian identities.
 * Users pick one during onboarding — no letter initials, no emojis — real illustrated characters.
 *
 * Each avatar is an SVG file stored in /public/avatars/ with Feorm's earth palette.
 */

export interface HumanoidAvatar {
  id: string;
  label: string;
  src: string;       // Path to SVG in /public/avatars/
  ring: string;      // Tailwind ring class when selected
  accent: string;    // Accent color for labels/badges
  description: string;
}

export const HUMANOID_AVATARS: HumanoidAvatar[] = [
  {
    id: "avatar://amara",
    label: "Amara",
    src: "/avatars/amara.svg",
    ring: "ring-harvest",
    accent: "text-accent-foreground",
    description: "Farmer & Host",
  },
  {
    id: "avatar://kazo",
    label: "Kazo",
    src: "/avatars/kazo.svg",
    ring: "ring-bark",
    accent: "text-bark",
    description: "Explorer & Guide",
  },
  {
    id: "avatar://tandi",
    label: "Tandi",
    src: "/avatars/tandi.svg",
    ring: "ring-harvest",
    accent: "text-accent-foreground",
    description: "Community Leader",
  },
  {
    id: "avatar://shona",
    label: "Shona",
    src: "/avatars/shona.svg",
    ring: "ring-sand",
    accent: "text-muted-foreground",
    description: "Elder & Mentor",
  },
  {
    id: "avatar://nale",
    label: "Nale",
    src: "/avatars/nale.svg",
    ring: "ring-earth",
    accent: "text-earth",
    description: "Adventurer",
  },
];

const AVATAR_MAP: Record<string, HumanoidAvatar> = Object.fromEntries(
  HUMANOID_AVATARS.map((a) => [a.id, a])
);

/** Check if a URL is a humanoid avatar reference */
export function isHumanoidAvatar(url: string): boolean {
  return url.startsWith("avatar://");
}

/** Get the HumanoidAvatar object for a given URL */
export function getHumanoidAvatar(url: string): HumanoidAvatar | null {
  return AVATAR_MAP[url] || null;
}

/** @deprecated Legacy emoji system — still supported for existing users */
export function isEmojiAvatar(url: string): boolean {
  return url.startsWith("emoji://");
}

/** @deprecated Legacy — returns null (emoji avatars are replaced by humanoid ones) */
export function getEmojiAvatar(_url: string): null {
  return null;
}

/** Check if a URL is a preset gradient avatar (legacy) */
export function isPresetAvatar(url: string): boolean {
  return url.startsWith("preset://");
}

/** Legacy: Get gradient for preset avatar */
// NOTE: Hex colors in gradients below are intentional — they are component colors
// in a multi-stop linear-gradient, not standalone design tokens. Do NOT replace
// with CSS variable references (e.g., #346538 is part of "desert-sage" gradient).
const LEGACY_PRESETS: Record<string, string> = {
  "preset://amber-dunes": "linear-gradient(135deg, #E8C96A 0%, #D4A853 50%, #B8862D 100%)",
  "preset://red-kalahari": "linear-gradient(135deg, #9F2F2D 0%, #C44536 50%, #772E2E 100%)",
  "preset://desert-sage": "linear-gradient(135deg, #346538 0%, #4A7A4E 50%, #2D5A30 100%)",
  "preset://erongo-stone": "linear-gradient(135deg, #787774 0%, #5C5A57 50%, #3C3A38 100%)",
  "preset://golden-hour": "linear-gradient(135deg, #FBF3DB 0%, #E8C96A 50%, #D4A853 100%)",
  "preset://deep-earth": "linear-gradient(135deg, #3C2F1A 0%, #5C4A2A 50%, #1E1A14 100%)",
  "preset://savanna-dawn": "linear-gradient(135deg, #D4C4A0 0%, #B8A080 50%, #8C7A5A 100%)",
  "preset://river-delta": "linear-gradient(135deg, #1F6C9F 0%, #2D8BC4 50%, #1A5A88 100%)",
};

export function getPresetGradient(url: string): string | null {
  return LEGACY_PRESETS[url] || null;
}

/**
 * Resolve an avatarUrl to display info.
 * Returns the type of avatar and rendering data.
 */
export function resolveAvatarDisplay(avatarUrl: string | ""): {
  type: "humanoid" | "preset" | "image";
  src?: string;
  gradient?: string;
} | null {
  if (!avatarUrl) return null;

  if (isHumanoidAvatar(avatarUrl)) {
    const ha = getHumanoidAvatar(avatarUrl);
    if (ha) return { type: "humanoid", src: ha.src };
    // Fallback to first avatar
    return { type: "humanoid", src: HUMANOID_AVATARS[0].src };
  }

  if (isEmojiAvatar(avatarUrl)) {
    // Migrate: default to first humanoid avatar
    return { type: "humanoid", src: HUMANOID_AVATARS[0].src };
  }

  if (isPresetAvatar(avatarUrl)) {
    const gradient = getPresetGradient(avatarUrl);
    if (gradient) return { type: "preset", gradient };
  }

  // It's an image URL or data URL
  return { type: "image", src: avatarUrl };
}

/**
 * Compress an uploaded image to a data URL.
 * Used when users upload their own photo instead of picking an avatar.
 */
export function compressImage(
  file: File,
  maxSize: number = 512,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject("Canvas not supported");
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
