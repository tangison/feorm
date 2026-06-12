import type { Metadata, Viewport } from "next";
import { DM_Sans, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { FeormProvider } from "@/context/feorm-context";

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1E1A14",
};

export const metadata: Metadata = {
  title: "Feorm | Book Farm Stays Across Namibia",
  description:
    "Stay on real Namibian farms. Browse verified farm stays from the Kunene to the Kalahari — book direct with escrow protection.",
  keywords: [
    "Feorm",
    "Namibia farm stay",
    "Namibian agrotourism",
    "farm stay booking",
    "Namibia accommodation",
    "escrow booking",
    "rural Namibia",
  ],
  authors: [{ name: "Feorm" }],
  icons: {
    icon: "/feorm-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSerif.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {/* Skip to Content — WCAG 2.4.1 Bypass Blocks */}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <FeormProvider>
          {children}
          <Toaster />
        </FeormProvider>
      </body>
    </html>
  );
}
