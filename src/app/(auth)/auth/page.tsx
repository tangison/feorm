"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFeormAuth, demoSignIn } from "@/context/feorm-auth";
import { ArrowRight, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

function AuthContent() {
  const { setUser, setEmail, setPhone, setAvatarUrl } = useFeormAuth();
  const searchParams = useSearchParams();
  const [email, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const messageParam = searchParams.get("message");
  const signInMessage = messageParam === "sign-in-to-book"
    ? "Sign in to book your farm stay"
    : null;

  const handleDemoSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      // Demo mode: auto-sign-in as demo user
      const user = demoSignIn();
      setUser(user);
      setEmail(user.email ?? "");
      setPhone(user.phone ?? "");
      setAvatarUrl(user.avatarUrl ?? "");
      setSent(true);
    } catch {
      setError("Could not sign in. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div
      className="flex-grow grid md:grid-cols-2 min-h-screen"
    >
      {/* Left: Desaturated Hero Image */}
      <div className="relative bg-earth overflow-hidden md:min-h-screen min-h-[35vh]">
        {/* Mobile hero — vertical portrait */}
        <Image
          src="/images/hero-gateway-mobile.png"
          alt="Namibian horizon"
          fill
          sizes="100vw"
          className="object-cover opacity-60 saturate-[0.6] md:hidden"
          priority
        />
        {/* Desktop hero — wide landscape */}
        <Image
          src="/images/hero-gateway.png"
          alt="Namibian horizon"
          fill
          sizes="50vw"
          className="object-cover opacity-60 saturate-[0.6] hidden md:block"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth via-earth/60 to-transparent md:bg-gradient-to-r md:from-transparent md:via-earth/40 md:to-earth" />
        <div className="relative z-10 flex flex-col justify-between h-full p-10 md:p-20">
          <div className="reveal">
            <h1 className="font-serif-display text-5xl md:text-7xl mb-2 italic lowercase text-white-feorm">
              feorm<span className="text-harvest">.</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-sand font-mono-feorm">
              Book Farm Stays Across Namibia
            </p>
          </div>
          <div className="reveal delay-1">
            <h1 className="font-serif-display text-3xl md:text-5xl mb-4 text-white-feorm leading-tight max-w-md">
              Wake up on a real Namibian farm.
            </h1>
            <p className="text-sm text-sand max-w-sm leading-relaxed">
              Skip the hotels. Stay on working farms, cattle posts, and bush lodges — from the Kunene River to the Kalahari dunes. Every host verified, every booking escrow-protected.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Email Auth */}
      <div className="bg-fog flex items-center justify-center p-10 md:p-20">
        <div className="w-full max-w-sm reveal delay-2">
          {!sent ? (
            <>
              <div className="mb-12">
                <kbd className="font-mono-feorm text-[10px] border border-soil/20 bg-white-feorm px-2 py-1 rounded text-muted-foreground mb-6 inline-block">
                  SIGN IN
                </kbd>
                {signInMessage && (
                  <div className="mb-4 p-3 bg-harvest/10 border border-harvest/20 rounded-[4px]" role="note">
                    <p className="text-sm text-earth font-medium">
                      {signInMessage}
                    </p>
                  </div>
                )}
                <h1 className="font-serif-display text-3xl mb-3 text-earth tracking-tight">
                  Get access to farm stays
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Demo mode: enter any email to sign in instantly. No password needed.
                </p>
              </div>

              <div className="space-y-6">
                <div className="border border-soil/20 bg-white-feorm p-4 rounded-[4px] focus-within:border-earth transition-colors">
                  <label
                    htmlFor="email-input"
                    className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-muted-foreground"
                  >
                    Email Address
                  </label>
                  <div className="flex items-center">
                    <Mail size={16} className="text-soil mr-3 shrink-0" aria-hidden="true" />
                    <input
                      id="email-input"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        setError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && email.includes("@")) {
                          handleDemoSignIn();
                        }
                      }}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full bg-transparent outline-none text-lg text-earth placeholder-sand font-mono-feorm"
                    />
                  </div>
                </div>

                {error && (
                  <p role="alert" className="text-xs text-destructive font-mono-feorm">{error}</p>
                )}

                <button
                  onClick={handleDemoSignIn}
                  disabled={!email || !email.includes("@") || loading}
                  className="w-full btn-primary-feorm px-5 py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                >
                  {loading ? "Signing in..." : "Sign In (Demo)"}
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>

              <div className="mt-6 p-4 bg-accent/30 border border-harvest/20 rounded-[4px]" role="note">
                <p className="text-[10px] text-accent-foreground font-mono-feorm uppercase tracking-wide">
                  Demo mode — instant sign-in, no email verification
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="mb-12">
                <kbd className="font-mono-feorm text-[10px] border border-harvest/30 bg-accent/30 px-2 py-1 rounded text-accent-foreground mb-6 inline-block">
                  WELCOME
                </kbd>
                <h1 className="font-serif-display text-3xl mb-3 text-earth tracking-tight">
                  You are signed in
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Redirecting you to the marketplace...
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-6 border border-soil/10 bg-white-feorm rounded-[8px] text-center">
                  <div className="w-3 h-3 rounded-full bg-harvest animate-pulse mx-auto mb-4" />
                  <p className="text-sm text-earth font-medium mb-2">
                    Redirecting to farm stays
                  </p>
                  <p className="text-xs text-muted-foreground">
                    You will be there in a moment.
                  </p>
                </div>

                <button
                  onClick={() => {
                    router.push("/marketplace");
                  }}
                  className="w-full btn-primary-feorm px-5 py-3 text-xs uppercase tracking-widest min-h-[44px]"
                >
                  Go to Marketplace
                  <ArrowRight size={14} className="ml-2" aria-hidden="true" />
                </button>
              </div>
            </>
          )}

          <p className="mt-8 text-[10px] text-muted-foreground uppercase tracking-wide leading-relaxed">
            By continuing, you agree to the{" "}
            <Link
              href="/auth/terms"
              className="border-b border-muted-foreground pb-0.5 hover:text-earth transition-colors"
            >
              Terms of Service
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
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
      <AuthContent />
    </Suspense>
  );
}
