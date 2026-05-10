export interface PresetAvatar {
  id: string;
  label: string;
  gradient: string;
}

export const PRESET_AVATARS: PresetAvatar[] = [
  {
    id: "preset://amber-dunes",
    label: "Amber Dunes",
    gradient: "linear-gradient(135deg, #E8C96A 0%, #D4A853 50%, #B8862D 100%)",
  },
  {
    id: "preset://red-kalahari",
    label: "Red Kalahari",
    gradient: "linear-gradient(135deg, #9F2F2D 0%, #C44536 50%, #772E2E 100%)",
  },
  {
    id: "preset://desert-sage",
    label: "Desert Sage",
    gradient: "linear-gradient(135deg, #346538 0%, #4A7A4E 50%, #2D5A30 100%)",
  },
  {
    id: "preset://erongo-stone",
    label: "Erongo Stone",
    gradient: "linear-gradient(135deg, #787774 0%, #5C5A57 50%, #3C3A38 100%)",
  },
  {
    id: "preset://golden-hour",
    label: "Golden Hour",
    gradient: "linear-gradient(135deg, #FBF3DB 0%, #E8C96A 50%, #D4A853 100%)",
  },
  {
    id: "preset://deep-earth",
    label: "Deep Earth",
    gradient: "linear-gradient(135deg, #3C2F1A 0%, #5C4A2A 50%, #1E1A14 100%)",
  },
  {
    id: "preset://savanna-dawn",
    label: "Savanna Dawn",
    gradient: "linear-gradient(135deg, #D4C4A0 0%, #B8A080 50%, #8C7A5A 100%)",
  },
  {
    id: "preset://river-delta",
    label: "River Delta",
    gradient: "linear-gradient(135deg, #1F6C9F 0%, #2D8BC4 50%, #1A5A88 100%)",
  },
];

const PRESET_MAP: Record<string, string> = Object.fromEntries(
  PRESET_AVATARS.map((p) => [p.id, p.gradient])
);

export function isPresetAvatar(url: string): boolean {
  return url.startsWith("preset://");
}

export function getPresetGradient(url: string): string | null {
  return PRESET_MAP[url] || null;
}

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
