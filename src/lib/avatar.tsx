/**
 * Feorm Emoji Avatar System
 *
 * 5 brand-aligned emojis representing Namibian agrotourism identity.
 * Users pick one during onboarding — no letter initials, just visual identity.
 *
 * Each emoji has a themed background gradient that matches Feorm's earth palette.
 */

export interface EmojiAvatar {
  id: string;
  emoji: string;
  label: string;
  bg: string;       // Tailwind background class
  ring: string;     // Tailwind ring class when selected
}

export const EMOJI_AVATARS: EmojiAvatar[] = [
  {
    id: "emoji://acacia",
    emoji: "🌳",
    label: "Acacia",
    bg: "bg-gradient-to-br from-harvest/30 to-cream",
    ring: "ring-harvest",
  },
  {
    id: "emoji://desert-fox",
    emoji: "🦊",
    label: "Desert Fox",
    bg: "bg-gradient-to-br from-earth/15 to-sand/30",
    ring: "ring-earth",
  },
  {
    id: "emoji://sunrise",
    emoji: "🌅",
    label: "Sunrise",
    bg: "bg-gradient-to-br from-harvest/20 to-accent/40",
    ring: "ring-harvest",
  },
  {
    id: "emoji://ox",
    emoji: "🐂",
    label: "Ox",
    bg: "bg-gradient-to-br from-cream to-sand/20",
    ring: "ring-bark",
  },
  {
    id: "emoji://wheat",
    emoji: "🌾",
    label: "Wheat",
    bg: "bg-gradient-to-br from-accent/40 to-cream",
    ring: "ring-harvest",
  },
];

const EMOJI_MAP: Record<string, EmojiAvatar> = Object.fromEntries(
  EMOJI_AVATARS.map((a) => [a.id, a])
);

/** Check if a URL is an emoji avatar reference */
export function isEmojiAvatar(url: string): boolean {
  return url.startsWith("emoji://");
}

/** Get the EmojiAvatar object for a given URL */
export function getEmojiAvatar(url: string): EmojiAvatar | null {
  return EMOJI_MAP[url] || null;
}

/** Legacy: Check if a URL is a preset gradient avatar */
export function isPresetAvatar(url: string): boolean {
  return url.startsWith("preset://");
}

/** Legacy: Get gradient for preset avatar (still supported for existing users) */
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
 * Compress an uploaded image to a data URL.
 * Used when users upload their own photo instead of picking an emoji.
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
