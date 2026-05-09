"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  Upload,
  Shield,
  CheckCircle,
  Clock,
  Star,
  Phone,
  User,
  MapPin,
  Calendar,
  MessageCircle,
  Settings,
  LogOut,
  Home,
  Package,
  FileText,
  ChevronRight,
  X,
  Menu,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────
interface Listing {
  id: string;
  title: string;
  region: string;
  price: number;
  type: string;
  category: string;
  description: string;
  imageUrl: string;
  features: string;
  hostId: string;
  hostName: string;
  hostPhone: string;
  available: boolean;
}

interface Booking {
  id: string;
  userId: string;
  listingId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  escrowAmount: number;
  serviceFee: number;
  status: string;
  referenceNumber: string;
  withOperator: boolean;
  listing: Listing;
}

interface FeormUser {
  id: string;
  phone: string;
  name?: string;
  surname?: string;
  region?: string;
  role: string;
  verified: boolean;
}

type Screen =
  | "auth"
  | "otp"
  | "identity"
  | "role"
  | "onboarding"
  | "terms"
  | "verify"
  | "home"
  | "detail"
  | "order"
  | "summary"
  | "payment"
  | "success"
  | "connect"
  | "journeys"
  | "dashboard"
  | "profile"
  | "support";

type MarketView = "stays" | "equipment";

// ─── Utility Functions ────────────────────────────────────────────
function formatPrice(cents: number): string {
  return `N$ ${(cents / 100).toLocaleString()}`;
}

function generateRef(): string {
  return `FE-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase()}`;
}

// ─── Reveal Animation Hook ────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    const revealEls = el.querySelectorAll(".reveal");
    revealEls.forEach((e) => observer.observe(e));
    return () => observer.disconnect();
  }, []);
  return ref;
}

// ─── Main Application ─────────────────────────────────────────────
export default function FeormApp() {
  const [screen, setScreen] = useState<Screen>("auth");
  const [prevScreen, setPrevScreen] = useState<Screen>("auth");
  const [marketView, setMarketView] = useState<MarketView>("stays");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [user, setUser] = useState<FeormUser | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  // Identity form state
  const [identityName, setIdentityName] = useState("");
  const [identitySurname, setIdentitySurname] = useState("");
  const [identityRegion, setIdentityRegion] = useState("Khomas");
  const [selectedRole, setSelectedRole] = useState<"explorer" | "lister">(
    "explorer"
  );

  // Order form state
  const [orderStartDate, setOrderStartDate] = useState("");
  const [orderEndDate, setOrderEndDate] = useState("");
  const [orderWithOperator, setOrderWithOperator] = useState(false);

  // Terms state
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Mobile nav state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const regions = [
    "Khomas",
    "Otjozondjupa",
    "Erongo",
    "Hardap",
    "Omaheke",
    "Karas",
    "Kunene",
    "Ohangwena",
    "Oshana",
    "Oshikoto",
    "Zambezi",
    "Kavango East",
    "Kavango West",
  ];

  const navigateTo = useCallback(
    (s: Screen) => {
      setPrevScreen(screen);
      setScreen(s);
      window.scrollTo(0, 0);
    },
    [screen]
  );

  // Fetch listings
  const fetchListings = useCallback(async (type: MarketView) => {
    try {
      const res = await fetch(`/api/listings?type=${type === "stays" ? "stay" : "equipment"}`);
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }
    } catch {
      // silently fail
    }
  }, []);

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/bookings?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch {
      // silently fail
    }
  }, [user]);

  // Auto-fetch listings when market view changes
  useEffect(() => {
    if (screen === "home") {
      const type = marketView === "stays" ? "stay" : "equipment";
      fetch(`/api/listings?type=${type}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => { setListings(data); })
        .catch(() => {});
    }
  }, [marketView, screen]);

  // Auto-fetch bookings when user navigates to journeys
  useEffect(() => {
    if (screen === "journeys" && user) {
      fetch(`/api/bookings?userId=${user.id}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => { setBookings(data); })
        .catch(() => {});
    }
  }, [screen, user]);

  // ─── Auth: Request OTP ────────────────────────────────
  const handleRequestOtp = async () => {
    if (!phone || phone.length < 8) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request-otp", phone: `+264${phone.replace(/\s/g, "")}` }),
      });
      const data = await res.json();
      if (data.success) {
        navigateTo("otp");
      }
    } catch {
      // Demo mode: proceed anyway
      navigateTo("otp");
    }
    setLoading(false);
  };

  // ─── Auth: Verify OTP ─────────────────────────────────
  const handleVerifyOtp = async () => {
    if (otp !== "123456") {
      setOtpError("Invalid code. Demo: use 123456");
      return;
    }
    setLoading(true);
    setOtpError("");
    try {
      const fullPhone = `+264${phone.replace(/\s/g, "")}`;
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-otp", phone: fullPhone, otp }),
      });
      const data = await res.json();
      if (data.success) {
        const u: FeormUser = {
          id: data.userId,
          phone: fullPhone,
          role: "explorer",
          verified: false,
        };
        setUser(u);
        if (data.isNewUser) {
          navigateTo("identity");
        } else {
          fetchListings(marketView);
          navigateTo("home");
        }
      }
    } catch {
      // Fallback
      navigateTo("identity");
    }
    setLoading(false);
  };

  // ─── Identity Setup ──────────────────────────────────
  const handleIdentitySetup = async () => {
    if (!identityName || !identitySurname) return;
    setLoading(true);
    try {
      const fullPhone = `+264${phone.replace(/\s/g, "")}`;
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "setup-identity",
          phone: fullPhone,
          name: identityName,
          surname: identitySurname,
          region: identityRegion,
          role: selectedRole,
        }),
      });
    } catch {
      // Continue anyway
    }
    if (user) {
      setUser({
        ...user,
        name: identityName,
        surname: identitySurname,
        region: identityRegion,
        role: selectedRole,
      });
    }
    navigateTo("role");
    setLoading(false);
  };

  // ─── WhatsApp Bridge ──────────────────────────────────
  const triggerWhatsApp = (listingTitle: string, ref?: string) => {
    const msg = ref
      ? `Hi, I've just booked [${listingTitle}] on Feorm. Looking forward to it! My Ref is: ${ref}`
      : `System Alert: Initiating inquiry for [${listingTitle}] via Feorm network.`;
    window.open(`https://wa.me/264810000000?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // ─── Create Booking ──────────────────────────────────
  const handleCreateBooking = async () => {
    if (!user || !selectedListing || !orderStartDate || !orderEndDate) return;
    setLoading(true);
    const days = Math.max(
      1,
      Math.ceil(
        (new Date(orderEndDate).getTime() - new Date(orderStartDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );
    const rentalPrice = selectedListing.price * days;
    const serviceFee = Math.round(rentalPrice * 0.1);
    const totalPrice = rentalPrice + serviceFee + 150000;

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          listingId: selectedListing.id,
          startDate: orderStartDate,
          endDate: orderEndDate,
          totalPrice,
          serviceFee,
          withOperator: orderWithOperator,
        }),
      });
      if (res.ok) {
        const booking = await res.json();
        setBookings((prev) => [booking, ...prev]);
        navigateTo("success");
        return;
      }
    } catch {
      // Fallback: show success anyway for demo
    }
    navigateTo("success");
    setLoading(false);
  };

  // ─── Render Helpers ──────────────────────────────────

  const stayListings = listings.filter((l) => l.type === "stay");
  const equipListings = listings.filter((l) => l.type === "equipment");
  const currentListings = marketView === "stays" ? stayListings : equipListings;

  const userInitials = user?.name && user?.surname
    ? `${user.name[0]}${user.surname[0]}`
    : "JD";

  // ─── SCREEN: Auth (Splash & Phone Entry) ──────────────
  const renderAuth = () => (
    <div className="flex-grow grid md:grid-cols-2 min-h-screen">
      {/* Left: Editorial Cover */}
      <div className="bg-[#1E1A14] text-[#FEFDFB] flex flex-col justify-between p-10 md:p-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_#E8C96A_0%,_transparent_70%)] pointer-events-none" />
        <div className="reveal relative z-10">
          <h1 className="font-serif-display text-5xl md:text-7xl mb-2 italic lowercase">
            feorm<span className="text-[#E8C96A]">.</span>
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#D4C4A0] font-mono-feorm">
            Network 0.1
          </p>
        </div>
        <div className="reveal delay-1 relative z-10 mt-24 md:mt-0">
          <h2 className="font-serif-display text-3xl md:text-5xl mb-6 max-w-md leading-tight">
            Where the land works for you.
          </h2>
          <p className="text-sm md:text-base text-[#D4C4A0] max-w-sm leading-relaxed">
            A decentralized marketplace connecting Namibian farmland with those who
            require its provisions and equipment.
          </p>
        </div>
      </div>

      {/* Right: Phone Auth */}
      <div className="bg-[#FAF7F2] flex items-center justify-center p-10 md:p-24">
        <div className="w-full max-w-sm reveal delay-2">
          <div className="mb-12">
            <kbd className="font-mono-feorm text-[10px] border border-[#3C2F1A]/20 bg-[#FEFDFB] px-2 py-1 rounded text-[#787774] mb-6 inline-block">
              SECURE GATEWAY
            </kbd>
            <h3 className="font-serif-display text-3xl mb-3 text-[#1E1A14]">
              Establish Identity
            </h3>
            <p className="text-sm text-[#787774]">
              Access the communal marketplace via verified mobile credential.
            </p>
          </div>

          <div className="space-y-6">
            <div className="border border-[#3C2F1A]/20 bg-[#FEFDFB] p-4 rounded-[4px] focus-within:border-[#1E1A14] transition-colors">
              <label className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-[#787774]">
                Mobile Number
              </label>
              <div className="flex items-center">
                <span className="font-mono-feorm text-lg mr-3 text-[#3C2F1A]">
                  +264
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="81 000 0000"
                  className="w-full bg-transparent outline-none text-lg text-[#1E1A14] placeholder-[#D4C4A0] font-mono-feorm"
                />
              </div>
            </div>
            <button
              onClick={handleRequestOtp}
              disabled={!phone || phone.length < 8 || loading}
              className="w-full btn-primary-feorm py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Requesting..." : "Request Access"}
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="mt-6 p-4 bg-[#FBF3DB]/30 border border-[#E8C96A]/20 rounded-[4px]">
            <p className="text-[10px] text-[#956400] font-mono-feorm uppercase tracking-wide">
              Demo Mode: Enter any number, then use OTP <strong>123456</strong>
            </p>
          </div>

          <p className="mt-8 text-[10px] text-[#787774] uppercase tracking-wide leading-relaxed">
            By continuing, you agree to the{" "}
            <button
              onClick={() => navigateTo("terms")}
              className="border-b border-[#787774] pb-0.5"
            >
              Communal Ethic
            </button>{" "}
            and standard terms of service.
          </p>
        </div>
      </div>
    </div>
  );

  // ─── SCREEN: OTP Verification ────────────────────────
  const renderOtp = () => (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-md w-full">
        <button
          onClick={() => navigateTo("auth")}
          className="mb-8 flex items-center gap-2 text-sm text-[#787774] hover:text-[#1E1A14] transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="mb-10">
          <kbd className="font-mono-feorm text-[10px] border border-[#3C2F1A]/20 bg-[#FEFDFB] px-2 py-1 rounded text-[#787774] mb-6 inline-block">
            VERIFICATION PROTOCOL
          </kbd>
          <h2 className="font-serif-display text-3xl md:text-4xl mb-4 text-[#1E1A14]">
            Trust Layer
          </h2>
          <p className="text-sm text-[#787774] leading-relaxed">
            Enter the 6-digit code sent to +264{phone}
          </p>
        </div>

        <div className="space-y-6">
          <div className="border border-[#3C2F1A]/20 bg-[#FEFDFB] p-4 rounded-[4px] focus-within:border-[#1E1A14] transition-colors">
            <label className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-[#787774]">
              Verification Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                setOtpError("");
              }}
              placeholder="123456"
              maxLength={6}
              className="w-full bg-transparent outline-none text-2xl text-[#1E1A14] placeholder-[#D4C4A0] font-mono-feorm tracking-[0.3em]"
            />
          </div>

          {otpError && (
            <p className="text-xs text-[#9F2F2D] font-mono-feorm">{otpError}</p>
          )}

          <button
            onClick={handleVerifyOtp}
            disabled={otp.length !== 6 || loading}
            className="w-full btn-primary-feorm py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify & Enter"}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  // ─── SCREEN: Identity Setup ──────────────────────────
  const renderIdentity = () => (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-md w-full">
        <button
          onClick={() => navigateTo("otp")}
          className="mb-8 flex items-center gap-2 text-sm text-[#787774] hover:text-[#1E1A14] transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="mb-10">
          <kbd className="font-mono-feorm text-[10px] border border-[#3C2F1A]/20 bg-[#FEFDFB] px-2 py-1 rounded text-[#787774] mb-6 inline-block">
            IDENTITY PROTOCOL
          </kbd>
          <h2 className="font-serif-display text-3xl md:text-4xl mb-4 text-[#1E1A14]">
            Establish Profile
          </h2>
          <p className="text-sm text-[#787774] leading-relaxed">
            Your identity strengthens the communal trust network.
          </p>
        </div>

        <div className="space-y-5">
          <div className="border border-[#3C2F1A]/20 bg-[#FEFDFB] p-4 rounded-[4px] focus-within:border-[#1E1A14] transition-colors">
            <label className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-[#787774]">
              First Name
            </label>
            <input
              type="text"
              value={identityName}
              onChange={(e) => setIdentityName(e.target.value)}
              placeholder="Johan"
              className="w-full bg-transparent outline-none text-lg text-[#1E1A14] placeholder-[#D4C4A0]"
            />
          </div>

          <div className="border border-[#3C2F1A]/20 bg-[#FEFDFB] p-4 rounded-[4px] focus-within:border-[#1E1A14] transition-colors">
            <label className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-[#787774]">
              Surname
            </label>
            <input
              type="text"
              value={identitySurname}
              onChange={(e) => setIdentitySurname(e.target.value)}
              placeholder="Deetlefs"
              className="w-full bg-transparent outline-none text-lg text-[#1E1A14] placeholder-[#D4C4A0]"
            />
          </div>

          <div className="border border-[#3C2F1A]/20 bg-[#FEFDFB] p-4 rounded-[4px] focus-within:border-[#1E1A14] transition-colors">
            <label className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-[#787774]">
              Region
            </label>
            <select
              value={identityRegion}
              onChange={(e) => setIdentityRegion(e.target.value)}
              className="w-full bg-transparent outline-none text-lg text-[#1E1A14]"
            >
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleIdentitySetup}
            disabled={!identityName || !identitySurname || loading}
            className="w-full btn-primary-feorm py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Continue"}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  // ─── SCREEN: Role Selection ──────────────────────────
  const renderRole = () => (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-2xl w-full">
        <div className="mb-12 text-center">
          <kbd className="font-mono-feorm text-[10px] border border-[#3C2F1A]/20 bg-[#FEFDFB] px-2 py-1 rounded text-[#787774] mb-6 inline-block">
            THE FEORM CHOICE
          </kbd>
          <h2 className="font-serif-display text-3xl md:text-4xl mb-4 text-[#1E1A14]">
            How will you use the network?
          </h2>
          <p className="text-sm text-[#787774]">
            Your role shapes your marketplace experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => {
              setSelectedRole("explorer");
              navigateTo("onboarding");
            }}
            className={`p-8 md:p-12 text-left border-2 rounded-[8px] transition-all hover:border-[#1E1A14] ${
              selectedRole === "explorer"
                ? "border-[#1E1A14] bg-[#FEFDFB]"
                : "border-[#3C2F1A]/10 bg-[#FEFDFB]"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#FBF3DB] flex items-center justify-center mb-6">
              <MapPin size={20} className="text-[#956400]" />
            </div>
            <h3 className="font-serif-display text-2xl mb-3 text-[#1E1A14]">
              I want to Explore
            </h3>
            <p className="text-sm text-[#787774] leading-relaxed">
              Discover farm stays and rent equipment across the Namibian landscape.
              Tourist, researcher, or seasonal renter.
            </p>
          </button>

          <button
            onClick={() => {
              setSelectedRole("lister");
              navigateTo("onboarding");
            }}
            className={`p-8 md:p-12 text-left border-2 rounded-[8px] transition-all hover:border-[#1E1A14] ${
              selectedRole === "lister"
                ? "border-[#1E1A14] bg-[#FEFDFB]"
                : "border-[#3C2F1A]/10 bg-[#FEFDFB]"
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#EDF3EC] flex items-center justify-center mb-6">
              <Shield size={20} className="text-[#346538]" />
            </div>
            <h3 className="font-serif-display text-2xl mb-3 text-[#1E1A14]">
              I want to List
            </h3>
            <p className="text-sm text-[#787774] leading-relaxed">
              List your farmland, accommodation, or equipment for the community.
              Farmer, landowner, or equipment provider.
            </p>
          </button>
        </div>
      </div>
    </div>
  );

  // ─── SCREEN: Onboarding Carousel ─────────────────────
  const onboardingSlides = [
    {
      icon: <Shield size={32} className="text-[#956400]" />,
      title: "Escrow Protection",
      desc: "Every transaction is secured via an N$1,500 escrow deposit. Funds are held in trust until both parties confirm the condition of the asset.",
    },
    {
      icon: <CheckCircle size={32} className="text-[#346538]" />,
      title: "N$10,000 Damage Cover",
      desc: "In the event of equipment damage, the Feorm communal insurance provides up to N$10,000 in coverage. Verified identities only.",
    },
    {
      icon: <Star size={32} className="text-[#E8C96A]" />,
      title: "The Sharing Economy",
      desc: "Feorm is built on the principle that idle assets should work for the community. Your farm, your tractor, your land — all nodes in the network.",
    },
  ];

  const renderOnboarding = () => (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-lg w-full text-center">
        <div className="mb-12">
          <div className="w-16 h-16 rounded-full bg-[#FBF3DB] flex items-center justify-center mx-auto mb-8">
            {onboardingSlides[onboardingStep].icon}
          </div>
          <h2 className="font-serif-display text-3xl md:text-4xl mb-6 text-[#1E1A14]">
            {onboardingSlides[onboardingStep].title}
          </h2>
          <p className="text-sm text-[#787774] leading-relaxed max-w-md mx-auto">
            {onboardingSlides[onboardingStep].desc}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-10">
          {onboardingSlides.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === onboardingStep ? "bg-[#1E1A14]" : "bg-[#D4C4A0]"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-4">
          {onboardingStep > 0 && (
            <button
              onClick={() => setOnboardingStep((s) => s - 1)}
              className="flex-1 btn-secondary-feorm py-3 text-xs uppercase tracking-widest"
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (onboardingStep < 2) {
                setOnboardingStep((s) => s + 1);
              } else {
                navigateTo("terms");
              }
            }}
            className="flex-1 btn-primary-feorm py-3 text-xs uppercase tracking-widest flex justify-center items-center gap-2"
          >
            {onboardingStep < 2 ? "Next" : "Continue"}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  // ─── SCREEN: Terms of Service ────────────────────────
  const renderTerms = () => (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-lg w-full">
        <div className="mb-10">
          <kbd className="font-mono-feorm text-[10px] border border-[#3C2F1A]/20 bg-[#FEFDFB] px-2 py-1 rounded text-[#787774] mb-6 inline-block">
            LEGAL PROTOCOL
          </kbd>
          <h2 className="font-serif-display text-3xl md:text-4xl mb-4 text-[#1E1A14]">
            The Communal Ethic
          </h2>
          <p className="text-sm text-[#787774]">
            A plain-English summary of your rights and responsibilities.
          </p>
        </div>

        <div className="border border-[#3C2F1A]/10 bg-[#FEFDFB] rounded-[8px] p-6 md:p-8 mb-8 max-h-80 overflow-y-auto">
          <div className="space-y-6 text-sm text-[#3C2F1A] leading-relaxed">
            <div>
              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
                01 — Trust & Identity
              </h4>
              <p>
                All participants must verify their identity via a valid Namibian ID or
                passport. Anonymity is incompatible with the communal trust model.
              </p>
            </div>
            <div>
              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
                02 — Escrow Protocol
              </h4>
              <p>
                All equipment rentals require a refundable escrow deposit of N$1,500.
                This deposit is held in trust and released upon confirmed return
                condition.
              </p>
            </div>
            <div>
              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
                03 — Damage Coverage
              </h4>
              <p>
                The Feorm communal insurance fund provides up to N$10,000 in damage
                coverage for verified equipment rental transactions.
              </p>
            </div>
            <div>
              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
                04 — Communication
              </h4>
              <p>
                All transactional communication occurs via WhatsApp. Feorm does not
                store message content. Record-keeping is the responsibility of both
                parties.
              </p>
            </div>
            <div>
              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
                05 — Dispute Resolution
              </h4>
              <p>
                Disputes are resolved through a community arbitration process. Both
                parties must submit photographic evidence within 48 hours.
              </p>
            </div>
          </div>
        </div>

        <label className="flex items-start gap-3 mb-8 cursor-pointer">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 w-4 h-4 accent-[#1E1A14]"
          />
          <span className="text-sm text-[#3C2F1A]">
            I accept the Communal Ethic and acknowledge the terms of service as
            binding for all transactions on the Feorm network.
          </span>
        </label>

        <button
          onClick={() => {
            if (user) {
              setUser({ ...user, verified: true });
            }
            fetchListings(marketView);
            navigateTo("home");
          }}
          disabled={!termsAccepted}
          className="w-full btn-primary-feorm py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          I Accept — Enter Marketplace
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );

  // ─── SCREEN: Verification Center ─────────────────────
  const renderVerify = () => (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-lg w-full">
        <div className="mb-10">
          <h2 className="font-serif-display text-3xl md:text-4xl mb-4 text-[#1E1A14]">
            Trust Layer Protocol
          </h2>
          <p className="text-sm text-[#787774] leading-relaxed">
            Verified farmers. Protected assets. Escrow security requires formal
            identification prior to marketplace entry.
          </p>
        </div>

        <div className="bento-card p-8 md:p-12 text-center border-dashed border-2 border-[#D4C4A0]/50 bg-[#FEFDFB] mb-8 cursor-pointer hover:bg-[#FAF7F2] transition-colors">
          <div className="mx-auto w-10 h-10 mb-6 text-[#1E1A14] flex items-center justify-center">
            <Upload size={24} />
          </div>
          <p className="text-sm font-medium mb-1 text-[#1E1A14]">
            Upload National ID / Passport
          </p>
          <p className="text-xs text-[#787774] font-mono-feorm">
            PNG, JPG, HEIC up to 5MB
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => {
              fetchListings(marketView);
              navigateTo("home");
            }}
            className="flex-1 btn-secondary-feorm py-3 text-xs uppercase tracking-widest"
          >
            Skip (Browse Only)
          </button>
          <button
            onClick={() => {
              if (user) setUser({ ...user, verified: true });
              fetchListings(marketView);
              navigateTo("home");
            }}
            className="flex-1 btn-primary-feorm py-3 text-xs uppercase tracking-widest"
          >
            Verify & Enter
          </button>
        </div>
      </div>
    </div>
  );

  // ─── Top Navigation ──────────────────────────────────
  const renderNav = () => {
    const showNav =
      screen === "home" ||
      screen === "detail" ||
      screen === "order" ||
      screen === "summary" ||
      screen === "journeys" ||
      screen === "dashboard" ||
      screen === "profile" ||
      screen === "support";

    if (!showNav) return null;

    return (
      <nav className="border-b border-[#3C2F1A]/10 bg-[#FEFDFB] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigateTo("home")}
              className="font-serif-display text-2xl italic lowercase"
            >
              feorm<span className="text-[#E8C96A]">.</span>
            </button>
            <div className="hidden md:flex gap-6 text-sm font-medium">
              <button
                onClick={() => {
                  setMarketView("stays");
                  navigateTo("home");
                }}
                className={`pb-1 transition-colors ${
                  screen === "home" && marketView === "stays"
                    ? "text-[#1E1A14] border-b-2 border-[#1E1A14]"
                    : "text-[#787774] border-b-2 border-transparent hover:text-[#1E1A14]"
                }`}
              >
                Farm Stays
              </button>
              <button
                onClick={() => {
                  setMarketView("equipment");
                  navigateTo("home");
                }}
                className={`pb-1 transition-colors ${
                  screen === "home" && marketView === "equipment"
                    ? "text-[#1E1A14] border-b-2 border-[#1E1A14]"
                    : "text-[#787774] border-b-2 border-transparent hover:text-[#1E1A14]"
                }`}
              >
                Equipment
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo("journeys")}
              className="hidden md:block btn-secondary-feorm px-4 py-2 text-xs uppercase tracking-widest"
            >
              My Journeys
            </button>
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden"
            >
              <Menu size={20} className="text-[#1E1A14]" />
            </button>
            <button
              onClick={() => navigateTo("profile")}
              className="h-8 w-8 bg-[#FAF7F2] border border-[#3C2F1A]/10 rounded-full flex items-center justify-center text-xs font-medium text-[#3C2F1A] hover:bg-[#F2EDE2] transition-colors"
            >
              {userInitials}
            </button>
          </div>
        </div>

        {/* Mobile Sub-Nav */}
        <div className="md:hidden flex border-t border-[#3C2F1A]/5 bg-[#FAF7F2]">
          <button
            onClick={() => {
              setMarketView("stays");
              navigateTo("home");
            }}
            className={`flex-1 py-3 text-xs font-medium ${
              marketView === "stays"
                ? "text-[#1E1A14] border-b-2 border-[#1E1A14]"
                : "text-[#787774] border-b-2 border-transparent"
            }`}
          >
            Farm Stays
          </button>
          <button
            onClick={() => {
              setMarketView("equipment");
              navigateTo("home");
            }}
            className={`flex-1 py-3 text-xs font-medium ${
              marketView === "equipment"
                ? "text-[#1E1A14] border-b-2 border-[#1E1A14]"
                : "text-[#787774] border-b-2 border-transparent"
            }`}
          >
            Equipment
          </button>
        </div>

        {/* Mobile Full Nav Dropdown */}
        {mobileNavOpen && (
          <div className="md:hidden border-t border-[#3C2F1A]/10 bg-[#FEFDFB] p-6 space-y-4">
            <button
              onClick={() => {
                navigateTo("home");
                setMobileNavOpen(false);
              }}
              className="flex items-center gap-3 text-sm text-[#1E1A14] w-full"
            >
              <Home size={16} /> Marketplace
            </button>
            <button
              onClick={() => {
                navigateTo("journeys");
                setMobileNavOpen(false);
              }}
              className="flex items-center gap-3 text-sm text-[#1E1A14] w-full"
            >
              <Clock size={16} /> My Journeys
            </button>
            {user?.role === "lister" && (
              <button
                onClick={() => {
                  navigateTo("dashboard");
                  setMobileNavOpen(false);
                }}
                className="flex items-center gap-3 text-sm text-[#1E1A14] w-full"
              >
                <Package size={16} /> Host Dashboard
              </button>
            )}
            <button
              onClick={() => {
                navigateTo("profile");
                setMobileNavOpen(false);
              }}
              className="flex items-center gap-3 text-sm text-[#1E1A14] w-full"
            >
              <User size={16} /> Profile
            </button>
            <button
              onClick={() => {
                navigateTo("support");
                setMobileNavOpen(false);
              }}
              className="flex items-center gap-3 text-sm text-[#1E1A14] w-full"
            >
              <MessageCircle size={16} /> Support
            </button>
            <div className="pt-4 border-t border-[#3C2F1A]/10">
              <button
                onClick={() => {
                  setUser(null);
                  setPhone("");
                  setOtp("");
                  navigateTo("auth");
                  setMobileNavOpen(false);
                }}
                className="flex items-center gap-3 text-sm text-[#9F2F2D] w-full"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>
    );
  };

  // ─── SCREEN: Home Marketplace ────────────────────────
  const renderHome = () => (
    <div className="flex-grow w-full max-w-6xl mx-auto px-6 py-12 md:py-24">
      <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h2 className="font-serif-display text-4xl md:text-5xl text-[#1E1A14] mb-3">
            {marketView === "stays" ? "Farm Stays" : "Equipment Exchange"}
          </h2>
          <p className="text-sm text-[#787774] max-w-lg">
            {marketView === "stays"
              ? "Authentic agrotourism provisions across the Namibian landscape."
              : "Peer-to-peer machinery rentals secured via escrow protocol."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono-feorm text-[10px] text-[#787774] uppercase tracking-widest">
            Filter:
          </span>
          <button className="border border-[#3C2F1A]/10 bg-[#FEFDFB] px-3 py-1.5 rounded-full text-xs hover:bg-[#FAF7F2] transition-colors">
            Region
          </button>
          <button className="border border-[#3C2F1A]/10 bg-[#FEFDFB] px-3 py-1.5 rounded-full text-xs hover:bg-[#FAF7F2] transition-colors">
            Availability
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {currentListings.map((item, index) => (
          <button
            key={item.id}
            onClick={() => {
              setSelectedListing(item);
              navigateTo("detail");
            }}
            className="bento-card flex flex-col group cursor-pointer text-left"
          >
            <div className="h-64 p-2 bg-[#FEFDFB]">
              <div className="w-full h-full relative rounded-[4px] overflow-hidden bg-[#FAF7F2]">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#1E1A14] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </div>
            </div>
            <div className="p-6 md:p-8 flex-grow flex flex-col justify-between border-t border-[#3C2F1A]/5">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`text-[10px] uppercase font-medium px-2.5 py-1 inline-block rounded-full ${
                      item.type === "stay"
                        ? "tag-pastel"
                        : "tag-machinery"
                    }`}
                  >
                    {item.category}
                  </span>
                  <span className="font-mono-feorm text-xs text-[#787774]">
                    {item.region}
                  </span>
                </div>
                <h3 className="font-serif-display text-2xl mb-2 text-[#1E1A14] group-hover:text-[#5C4A2A] transition-colors">
                  {item.title}
                </h3>
              </div>
              <div className="mt-6 flex justify-between items-end">
                <span className="text-lg font-medium text-[#1E1A14]">
                  {formatPrice(item.price)}{" "}
                  <span className="text-xs text-[#787774] font-normal uppercase tracking-wide">
                    / day
                  </span>
                </span>
                <div className="w-8 h-8 rounded-full border border-[#3C2F1A]/10 flex items-center justify-center text-[#1E1A14] group-hover:bg-[#1E1A14] group-hover:text-[#FEFDFB] transition-colors">
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // ─── SCREEN: Detail View ─────────────────────────────
  const renderDetail = () => {
    if (!selectedListing) return null;
    const features = selectedListing.features.split(",");

    return (
      <div className="flex-grow w-full max-w-6xl mx-auto bg-[#FEFDFB] md:my-12 md:border md:border-[#3C2F1A]/10 md:rounded-[8px] md:min-h-[700px] overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left: Image */}
          <div className="w-full md:w-1/2 bg-[#FAF7F2] relative h-[40vh] md:h-auto border-b md:border-b-0 md:border-r border-[#3C2F1A]/10">
            <Image
              src={selectedListing.imageUrl}
              alt={selectedListing.title}
              width={600}
              height={450}
              className="w-full h-full object-cover opacity-90 p-2 md:p-6"
              loading="lazy"
            />
            <button
              onClick={() => navigateTo("home")}
              className="absolute top-6 left-6 md:top-10 md:left-10 bg-[#FEFDFB] border border-[#3C2F1A]/10 p-2 rounded-full text-[#1E1A14] hover:bg-[#FAF7F2] transition-colors shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          {/* Right: Details */}
          <div className="w-full md:w-1/2 bg-[#FEFDFB] p-8 md:p-16 flex flex-col overflow-y-auto">
            <div className="flex-grow max-w-md">
              <div className="flex items-center gap-3 mb-6">
                <span
                  className={`text-[10px] uppercase font-medium px-2.5 py-1 rounded-full ${
                    selectedListing.type === "stay"
                      ? "tag-pastel"
                      : "tag-machinery"
                  }`}
                >
                  {selectedListing.category}
                </span>
                <span className="font-mono-feorm text-xs text-[#787774]">
                  {selectedListing.region}
                </span>
              </div>

              <h2 className="font-serif-display text-4xl md:text-5xl mb-6 text-[#1E1A14] leading-[1.1]">
                {selectedListing.title}
              </h2>

              <div className="text-[#1E1A14] mb-10 pb-10 border-b border-[#3C2F1A]/10">
                <span className="text-3xl font-medium">
                  {formatPrice(selectedListing.price)}
                </span>
                <span className="text-sm text-[#787774] ml-1 uppercase tracking-wide">
                  / day
                </span>
              </div>

              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-4">
                Description
              </h4>
              <p className="text-[#3C2F1A] text-sm leading-relaxed mb-10">
                {selectedListing.description}
              </p>

              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-4">
                Specifications
              </h4>
              <div className="flex flex-wrap gap-2 mb-10">
                {features.map((f) => (
                  <span
                    key={f}
                    className="border border-[#3C2F1A]/10 rounded bg-[#FAF7F2] px-3 py-1 text-xs text-[#787774]"
                  >
                    {f.trim()}
                  </span>
                ))}
              </div>

              {/* Host Bio */}
              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-4">
                Host
              </h4>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 rounded-full bg-[#1E1A14] text-[#FEFDFB] flex items-center justify-center text-xs font-medium">
                  {selectedListing.hostName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1E1A14]">
                    {selectedListing.hostName}
                  </p>
                  <p className="text-xs text-[#787774] font-mono-feorm">
                    {selectedListing.hostPhone}
                  </p>
                </div>
                <span className="tag-verified text-[10px] uppercase font-medium px-2.5 py-1">
                  Verified
                </span>
              </div>
            </div>

            <div className="mt-auto pt-6 bg-[#FEFDFB]">
              <div className="flex justify-between text-sm mb-4">
                <span className="text-[#787774]">Security Escrow</span>
                <span className="font-medium font-mono-feorm text-[#1E1A14]">
                  N$ 1,500
                </span>
              </div>
              <button
                onClick={() => navigateTo("order")}
                className="w-full btn-primary-feorm py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2"
              >
                {selectedListing.type === "stay"
                  ? "Request Stay"
                  : "Rent Machinery"}
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => triggerWhatsApp(selectedListing.title)}
                className="w-full mt-3 border border-[#25D366] text-[#25D366] py-3 text-xs uppercase tracking-widest flex justify-center items-center gap-2 rounded-full hover:bg-[#25D366]/5 transition-colors"
              >
                <MessageCircle size={14} /> WhatsApp Inquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── SCREEN: Order Configuration ─────────────────────
  const renderOrder = () => {
    if (!selectedListing) return null;

    return (
      <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-[60vh] bg-[#FAF7F2]">
        <div className="max-w-lg w-full">
          <button
            onClick={() => navigateTo("detail")}
            className="mb-8 flex items-center gap-2 text-sm text-[#787774] hover:text-[#1E1A14] transition-colors"
          >
            <ArrowLeft size={16} /> Back to Listing
          </button>

          <div className="mb-10">
            <kbd className="font-mono-feorm text-[10px] border border-[#3C2F1A]/20 bg-[#FEFDFB] px-2 py-1 rounded text-[#787774] mb-6 inline-block">
              ORDER CONFIGURATION
            </kbd>
            <h2 className="font-serif-display text-3xl md:text-4xl mb-4 text-[#1E1A14]">
              {selectedListing.title}
            </h2>
            <p className="text-sm text-[#787774]">
              Configure your {selectedListing.type === "stay" ? "stay" : "rental"}{" "}
              dates and options.
            </p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-[#3C2F1A]/20 bg-[#FEFDFB] p-4 rounded-[4px] focus-within:border-[#1E1A14] transition-colors">
                <label className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-[#787774]">
                  Start Date
                </label>
                <input
                  type="date"
                  value={orderStartDate}
                  onChange={(e) => setOrderStartDate(e.target.value)}
                  className="w-full bg-transparent outline-none text-base text-[#1E1A14]"
                />
              </div>
              <div className="border border-[#3C2F1A]/20 bg-[#FEFDFB] p-4 rounded-[4px] focus-within:border-[#1E1A14] transition-colors">
                <label className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-[#787774]">
                  End Date
                </label>
                <input
                  type="date"
                  value={orderEndDate}
                  onChange={(e) => setOrderEndDate(e.target.value)}
                  className="w-full bg-transparent outline-none text-base text-[#1E1A14]"
                />
              </div>
            </div>

            {selectedListing.type === "equipment" && (
              <label className="flex items-start gap-3 p-4 border border-[#3C2F1A]/10 bg-[#FEFDFB] rounded-[4px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={orderWithOperator}
                  onChange={(e) => setOrderWithOperator(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[#1E1A14]"
                />
                <div>
                  <p className="text-sm font-medium text-[#1E1A14]">
                    Operator Required
                  </p>
                  <p className="text-xs text-[#787774]">
                    Include a trained operator for this equipment (+N$ 500/day)
                  </p>
                </div>
              </label>
            )}
          </div>

          {/* Price Breakdown Preview */}
          {orderStartDate && orderEndDate && (
            <div className="mt-8 border border-[#3C2F1A]/10 bg-[#FEFDFB] rounded-[8px] p-6">
              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-4">
                Price Breakdown
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#787774]">
                    Rental ({formatPrice(selectedListing.price)} x{" "}
                    {Math.max(
                      1,
                      Math.ceil(
                        (new Date(orderEndDate).getTime() -
                          new Date(orderStartDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    )}{" "}
                    days)
                  </span>
                  <span className="font-mono-feorm text-[#1E1A14]">
                    {formatPrice(
                      selectedListing.price *
                        Math.max(
                          1,
                          Math.ceil(
                            (new Date(orderEndDate).getTime() -
                              new Date(orderStartDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        )
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#787774]">Service Fee (10%)</span>
                  <span className="font-mono-feorm text-[#1E1A14]">
                    {formatPrice(
                      Math.round(
                        selectedListing.price *
                          Math.max(
                            1,
                            Math.ceil(
                              (new Date(orderEndDate).getTime() -
                                new Date(orderStartDate).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                          ) *
                          0.1
                      )
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#787774]">Security Escrow</span>
                  <span className="font-mono-feorm text-[#1E1A14]">
                    N$ 1,500
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#3C2F1A]/10 font-medium">
                  <span className="text-[#1E1A14]">Total to Pay</span>
                  <span className="font-mono-feorm text-[#1E1A14] text-lg">
                    {formatPrice(
                      selectedListing.price *
                        Math.max(
                          1,
                          Math.ceil(
                            (new Date(orderEndDate).getTime() -
                              new Date(orderStartDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        ) +
                        Math.round(
                          selectedListing.price *
                            Math.max(
                              1,
                              Math.ceil(
                                (new Date(orderEndDate).getTime() -
                                  new Date(orderStartDate).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )
                            ) *
                            0.1
                        ) +
                        150000
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleCreateBooking}
            disabled={!orderStartDate || !orderEndDate || loading}
            className="w-full mt-8 btn-primary-feorm py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Initialize Contract"}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  };

  // ─── SCREEN: Payment Success ─────────────────────────
  const renderSuccess = () => {
    const latestBooking = bookings[0];
    return (
      <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-[60vh] bg-[#FAF7F2]">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#EDF3EC] flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={32} className="text-[#346538]" />
          </div>

          <h2 className="font-serif-display text-3xl md:text-4xl mb-4 text-[#1E1A14]">
            Contract Initialized
          </h2>
          <p className="text-sm text-[#787774] mb-8">
            Your booking reference has been generated. Connect with the owner to
            finalize details.
          </p>

          {latestBooking && (
            <div className="border border-[#3C2F1A]/10 bg-[#FEFDFB] rounded-[8px] p-6 mb-8">
              <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
                Booking Reference
              </p>
              <p className="font-mono-feorm text-2xl font-medium text-[#1E1A14]">
                {latestBooking.referenceNumber || generateRef()}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => {
                if (selectedListing) {
                  triggerWhatsApp(
                    selectedListing.title,
                    latestBooking?.referenceNumber
                  );
                }
              }}
              className="w-full border border-[#25D366] text-[#25D366] py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 rounded-full hover:bg-[#25D366]/5 transition-colors"
            >
              <MessageCircle size={14} /> Connect via WhatsApp
            </button>
            <button
              onClick={() => navigateTo("home")}
              className="w-full btn-secondary-feorm py-3 text-xs uppercase tracking-widest"
            >
              Return to Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── SCREEN: My Journeys ─────────────────────────────
  const renderJourneys = () => (
    <div className="flex-grow w-full max-w-4xl mx-auto px-6 py-12 md:py-24">
      <div className="mb-12">
        <h2 className="font-serif-display text-4xl md:text-5xl text-[#1E1A14] mb-3">
          My Journeys
        </h2>
        <p className="text-sm text-[#787774]">
          Active, upcoming, and past bookings on the Feorm network.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="border border-dashed border-[#D4C4A0]/50 bg-[#FEFDFB] rounded-[8px] p-12 text-center">
          <Clock size={32} className="text-[#D4C4A0] mx-auto mb-4" />
          <p className="text-sm text-[#787774] mb-6">
            No bookings yet. Explore the marketplace to begin.
          </p>
          <button
            onClick={() => navigateTo("home")}
            className="btn-primary-feorm px-6 py-3 text-xs uppercase tracking-widest inline-flex items-center gap-2"
          >
            Browse Marketplace <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bento-card p-6 flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-[10px] uppercase font-medium px-2.5 py-1 rounded-full ${
                      b.status === "confirmed"
                        ? "tag-verified"
                        : b.status === "pending"
                        ? "tag-pastel"
                        : "tag-alert"
                    }`}
                  >
                    {b.status}
                  </span>
                  <span className="font-mono-feorm text-[10px] text-[#787774]">
                    {b.referenceNumber}
                  </span>
                </div>
                <h3 className="font-serif-display text-xl text-[#1E1A14]">
                  {b.listing?.title || "Listing"}
                </h3>
                <p className="text-xs text-[#787774] mt-1">
                  {b.startDate} → {b.endDate}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono-feorm text-lg font-medium text-[#1E1A14]">
                  {formatPrice(b.totalPrice)}
                </p>
                <p className="text-[10px] text-[#787774] font-mono-feorm uppercase">
                  incl. escrow
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ─── SCREEN: Host Dashboard ──────────────────────────
  const renderDashboard = () => (
    <div className="flex-grow w-full max-w-4xl mx-auto px-6 py-12 md:py-24">
      <div className="mb-12">
        <h2 className="font-serif-display text-4xl md:text-5xl text-[#1E1A14] mb-3">
          Host Dashboard
        </h2>
        <p className="text-sm text-[#787774]">
          Manage your listings, earnings, and pending requests.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bento-card p-6">
          <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
            Active Listings
          </p>
          <p className="font-serif-display text-3xl text-[#1E1A14]">3</p>
        </div>
        <div className="bento-card p-6">
          <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
            Earnings Available
          </p>
          <p className="font-serif-display text-3xl text-[#346538]">N$ 4,200</p>
        </div>
        <div className="bento-card p-6">
          <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-2">
            Pending Requests
          </p>
          <p className="font-serif-display text-3xl text-[#E8C96A]">2</p>
        </div>
      </div>

      <h3 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-6">
        Pending Requests
      </h3>
      <div className="space-y-4">
        <div className="bento-card p-6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-grow">
            <span className="tag-pastel text-[10px] uppercase font-medium px-2.5 py-1 inline-block mb-2">
              Pending
            </span>
            <h4 className="font-serif-display text-lg text-[#1E1A14]">
              John Deere 5075E — Rental Request
            </h4>
            <p className="text-xs text-[#787774] mt-1 font-mono-feorm">
              Requested by Anna K. — 3 days — N$ 4,500
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-xs uppercase tracking-widest bg-[#EDF3EC] text-[#346538] rounded-full hover:bg-[#dde9dd] transition-colors">
              Accept
            </button>
            <button className="px-4 py-2 text-xs uppercase tracking-widest bg-[#FDEBEC] text-[#9F2F2D] rounded-full hover:bg-[#f5d5d6] transition-colors">
              Decline
            </button>
          </div>
        </div>
        <div className="bento-card p-6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-grow">
            <span className="tag-pastel text-[10px] uppercase font-medium px-2.5 py-1 inline-block mb-2">
              Pending
            </span>
            <h4 className="font-serif-display text-lg text-[#1E1A14]">
              Otjozondjupa Cattle Farm — Stay Request
            </h4>
            <p className="text-xs text-[#787774] mt-1 font-mono-feorm">
              Requested by Pieter G. — 5 days — N$ 4,250
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-xs uppercase tracking-widest bg-[#EDF3EC] text-[#346538] rounded-full hover:bg-[#dde9dd] transition-colors">
              Accept
            </button>
            <button className="px-4 py-2 text-xs uppercase tracking-widest bg-[#FDEBEC] text-[#9F2F2D] rounded-full hover:bg-[#f5d5d6] transition-colors">
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── SCREEN: Profile ─────────────────────────────────
  const renderProfile = () => (
    <div className="flex-grow w-full max-w-2xl mx-auto px-6 py-12 md:py-24">
      <div className="mb-12">
        <h2 className="font-serif-display text-4xl md:text-5xl text-[#1E1A14] mb-3">
          Profile
        </h2>
        <p className="text-sm text-[#787774]">
          Manage your identity, verification, and account settings.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bento-card p-6 flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-[#1E1A14] text-[#FEFDFB] flex items-center justify-center text-xl font-medium font-serif-display">
            {userInitials}
          </div>
          <div className="flex-grow">
            <h3 className="font-serif-display text-xl text-[#1E1A14]">
              {user?.name} {user?.surname}
            </h3>
            <p className="text-sm text-[#787774] font-mono-feorm">
              +264{phone}
            </p>
          </div>
          <span
            className={`text-[10px] uppercase font-medium px-2.5 py-1 rounded-full ${
              user?.verified ? "tag-verified" : "tag-pastel"
            }`}
          >
            {user?.verified ? "Verified" : "Unverified"}
          </span>
        </div>

        <div className="bento-card p-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-1">
                Role
              </p>
              <p className="text-[#1E1A14] capitalize">{user?.role || "Explorer"}</p>
            </div>
            <div>
              <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-1">
                Region
              </p>
              <p className="text-[#1E1A14]">{user?.region || "—"}</p>
            </div>
            <div>
              <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-1">
                Trust Score
              </p>
              <p className="text-[#1E1A14] flex items-center gap-1">
                <Star size={14} className="text-[#E8C96A]" /> 4.8
              </p>
            </div>
            <div>
              <p className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-1">
                Member Since
              </p>
              <p className="text-[#1E1A14]">2026</p>
            </div>
          </div>
        </div>

        {!user?.verified && (
          <button
            onClick={() => navigateTo("verify")}
            className="w-full bento-card p-4 flex items-center justify-between hover:border-[#1E1A14] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-[#956400]" />
              <div>
                <p className="text-sm font-medium text-[#1E1A14]">
                  Complete Verification
                </p>
                <p className="text-xs text-[#787774]">
                  Upload ID to unlock full marketplace access
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-[#787774]" />
          </button>
        )}

        <button
          onClick={() => navigateTo("support")}
          className="w-full bento-card p-4 flex items-center justify-between hover:border-[#1E1A14] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Settings size={18} className="text-[#787774]" />
            <p className="text-sm font-medium text-[#1E1A14]">Support Center</p>
          </div>
          <ChevronRight size={16} className="text-[#787774]" />
        </button>

        <button
          onClick={() => {
            setUser(null);
            setPhone("");
            setOtp("");
            navigateTo("auth");
          }}
          className="w-full bento-card p-4 flex items-center justify-between hover:border-[#9F2F2D] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <LogOut size={18} className="text-[#9F2F2D]" />
            <p className="text-sm font-medium text-[#9F2F2D]">Sign Out</p>
          </div>
          <ChevronRight size={16} className="text-[#9F2F2D]" />
        </button>
      </div>
    </div>
  );

  // ─── SCREEN: Support ─────────────────────────────────
  const renderSupport = () => (
    <div className="flex-grow w-full max-w-2xl mx-auto px-6 py-12 md:py-24">
      <div className="mb-12">
        <h2 className="font-serif-display text-4xl md:text-5xl text-[#1E1A14] mb-3">
          Support Center
        </h2>
        <p className="text-sm text-[#787774]">
          Get help with your Feorm experience.
        </p>
      </div>

      <div className="space-y-6">
        <a
          href="https://wa.me/264810000000?text=Hello%2C%20I%20need%20help%20with%20Feorm."
          target="_blank"
          rel="noopener noreferrer"
          className="bento-card p-6 flex items-center gap-4 hover:border-[#25D366] transition-colors block"
        >
          <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center">
            <MessageCircle size={20} className="text-[#25D366]" />
          </div>
          <div className="flex-grow">
            <h3 className="font-serif-display text-lg text-[#1E1A14]">
              WhatsApp Support
            </h3>
            <p className="text-xs text-[#787774]">
              Direct line to the Feorm team. Mon-Fri, 08:00-17:00 CAT.
            </p>
          </div>
          <ChevronRight size={16} className="text-[#787774]" />
        </a>

        <div className="bento-card p-6">
          <h3 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-6">
            Frequently Asked
          </h3>
          <div className="space-y-4 text-sm">
            <div className="pb-4 border-b border-[#3C2F1A]/5">
              <h4 className="font-medium text-[#1E1A14] mb-1">
                How does escrow work?
              </h4>
              <p className="text-[#787774] leading-relaxed">
                A N$1,500 refundable deposit is held for each equipment rental. It&apos;s
                released once the owner confirms the asset&apos;s return condition.
              </p>
            </div>
            <div className="pb-4 border-b border-[#3C2F1A]/5">
              <h4 className="font-medium text-[#1E1A14] mb-1">
                What if equipment is damaged?
              </h4>
              <p className="text-[#787774] leading-relaxed">
                The communal insurance fund covers up to N$10,000 in damage. Both
                parties must submit before/after photos within 48 hours.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-[#1E1A14] mb-1">
                How do I get paid as a host?
              </h4>
              <p className="text-[#787774] leading-relaxed">
                Payouts are processed weekly via bank transfer or MTC Money.
                Minimum payout threshold is N$500.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── Design System Footer ────────────────────────────
  const renderFooter = () => {
    const showFooter =
      screen === "home" ||
      screen === "journeys" ||
      screen === "dashboard" ||
      screen === "profile" ||
      screen === "support";

    if (!showFooter) return null;

    return (
      <footer className="border-t border-[#3C2F1A]/10 mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          {/* Design System Showcase */}
          <div className="grid md:grid-cols-2 gap-16 mb-16">
            {/* Color Palette */}
            <div>
              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-6">
                The Namibian Palette
              </h4>
              <div className="grid grid-cols-5 gap-3">
                {[
                  { name: "Earth", hex: "#1E1A14" },
                  { name: "Soil", hex: "#3C2F1A" },
                  { name: "Harvest", hex: "#E8C96A" },
                  { name: "Sand", hex: "#D4C4A0" },
                  { name: "Fog", hex: "#FAF7F2" },
                ].map((c) => (
                  <div key={c.name}>
                    <div
                      className="h-16 w-full border border-[#3C2F1A]/10 rounded-[4px] mb-2"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="font-mono-feorm text-[9px] font-bold block text-[#1E1A14]">
                      {c.name}
                    </span>
                    <span className="font-mono-feorm text-[8px] text-[#787774]">
                      {c.hex}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography & Components */}
            <div>
              <h4 className="font-mono-feorm text-[10px] uppercase tracking-widest text-[#787774] mb-6">
                Typographic Architecture
              </h4>
              <div className="bg-[#FAF7F2] p-6 rounded-[8px] border border-[#3C2F1A]/5">
                <p className="font-serif-display text-2xl mb-3 italic">
                  The Land Provides.
                </p>
                <p className="text-sm mb-4 text-[#1E1A14]">
                  Premium Utilitarian Minimalism for the agrotourism network.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="tag-pastel text-[10px] uppercase font-medium px-2.5 py-1">
                    Harvest
                  </span>
                  <span className="tag-verified text-[10px] uppercase font-medium px-2.5 py-1">
                    Verified
                  </span>
                  <span className="tag-machinery text-[10px] uppercase font-medium px-2.5 py-1">
                    Machinery
                  </span>
                  <span className="tag-alert text-[10px] uppercase font-medium px-2.5 py-1">
                    Alert
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-[#3C2F1A]/10">
            <div className="font-serif-display text-2xl italic lowercase">
              feorm<span className="text-[#E8C96A]">.</span>
            </div>
            <div className="flex gap-12">
              <div>
                <span className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#787774] mb-2 block">
                  Project Code
                </span>
                <span className="font-mono-feorm text-xs text-[#1E1A14]">
                  FE-N-0.1
                </span>
              </div>
              <div>
                <span className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#787774] mb-2 block">
                  Region
                </span>
                <span className="font-mono-feorm text-xs text-[#1E1A14]">
                  Sub-Saharan Africa
                </span>
              </div>
              <div>
                <span className="font-mono-feorm text-[9px] uppercase tracking-widest text-[#787774] mb-2 block">
                  AIC 2026
                </span>
                <span className="font-mono-feorm text-xs text-[#1E1A14]">
                  Agripreneurial Innovation
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  };

  // ─── Main Render ─────────────────────────────────────
  const contentRef = useReveal();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1E1A14]" ref={contentRef}>
      {renderNav()}

      <main className="flex-grow flex flex-col relative w-full">
        {screen === "auth" && renderAuth()}
        {screen === "otp" && renderOtp()}
        {screen === "identity" && renderIdentity()}
        {screen === "role" && renderRole()}
        {screen === "onboarding" && renderOnboarding()}
        {screen === "terms" && renderTerms()}
        {screen === "verify" && renderVerify()}
        {screen === "home" && renderHome()}
        {screen === "detail" && renderDetail()}
        {screen === "order" && renderOrder()}
        {screen === "success" && renderSuccess()}
        {screen === "journeys" && renderJourneys()}
        {screen === "dashboard" && renderDashboard()}
        {screen === "profile" && renderProfile()}
        {screen === "support" && renderSupport()}
      </main>

      {renderFooter()}
    </div>
  );
}
