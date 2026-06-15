"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/marketplace");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-earth/20 border-t-earth rounded-full animate-spin" />
        <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-muted-foreground">
          Loading
        </p>
      </div>
    </div>
  );
}
