"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFeormAuth } from "@/context/feorm-context";

export default function Home() {
  const { user } = useFeormAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/marketplace");
    } else {
      router.replace("/auth");
    }
  }, [user, router]);

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
