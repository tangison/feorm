"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFeormAuth, demoSignIn } from "@/context/feorm-auth";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { Suspense } from "react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, setUser } = useFeormAuth();
  const [verified, setVerified] = useState(false);

  // Demo mode: auto-verify on mount via setTimeout to avoid
  // the lint rule about setState in effects
  useEffect(() => {
    if (user && user.name) {
      // Already authenticated — redirect
      return;
    }

    const code = searchParams.get("code");
    if (code || !user) {
      // Simulate verification with a small delay
      const timer = setTimeout(() => {
        const demoUser = demoSignIn();
        setUser(demoUser);
        setVerified(true);
        setTimeout(() => {
          router.push("/auth/identity");
        }, 1000);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router, user, setUser]);

  // If user is already authenticated, redirect
  useEffect(() => {
    if (user) {
      if (!user.name) {
        router.push("/auth/identity");
      } else {
        router.push("/marketplace");
      }
    }
  }, [user, router]);

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
            VERIFY EMAIL
          </kbd>
          <h1 className="font-serif-display text-3xl md:text-4xl mb-4 text-earth">
            {verified ? "Email verified" : "Demo auto-verify"}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {verified
              ? "Your email is verified. Redirecting..."
              : "Demo mode: you are automatically verified."}
          </p>
        </div>

        <div className="space-y-6">
          <div className="border border-soil/10 bg-white-feorm p-8 rounded-[8px] text-center">
            {verified ? (
              <>
                <CheckCircle size={32} className="mx-auto mb-4 text-verified" />
                <p className="text-sm text-earth font-medium">Email confirmed successfully</p>
              </>
            ) : (
              <>
                <Mail size={32} className="mx-auto mb-4 text-harvest" />
                <p className="text-sm text-earth font-medium mb-2">
                  Demo mode: auto-verified
                </p>
                <p className="text-xs text-muted-foreground">
                  No email verification needed in demo mode.
                </p>
              </>
            )}
          </div>

          {!verified && (
            <button
              onClick={() => router.push("/auth")}
              className="w-full btn-secondary-feorm px-5 py-3 text-xs uppercase tracking-widest min-h-[44px]"
            >
              Try a different email
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-grow flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-harvest animate-pulse" />
            <span className="font-mono-feorm text-[9px] text-muted-foreground uppercase tracking-widest">
              Loading
            </span>
          </div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
