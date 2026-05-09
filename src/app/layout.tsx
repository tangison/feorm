import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Feorm | Premium Utilitarian",
  description:
    "A decentralized marketplace connecting Namibian farmland with those who require its provisions and equipment.",
  keywords: [
    "Feorm",
    "Namibia",
    "Agrotourism",
    "Equipment Rental",
    "Farm Stay",
    "Marketplace",
  ],
  authors: [{ name: "Feorm Network" }],
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
        <FeormProvider>
          {children}
          <Toaster />
        </FeormProvider>
      </body>
    </html>
  );
}
