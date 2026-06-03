"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, CheckCircle, Star, ArrowRight } from "lucide-react";

const onboardingSlides = [
  {
    icon: <Shield size={32} className="text-accent-foreground" />,
    title: "Your N$1,500 Deposit, Held in Trust",
    desc: "Every equipment rental includes a refundable N$1,500 escrow deposit. The money is held until both you and the owner confirm the asset came back in good condition.",
  },
  {
    icon: <CheckCircle size={32} className="text-verified" />,
    title: "N$10,000 Damage Cover",
    desc: "If something goes wrong, the Feorm communal insurance covers up to N$10,000 in damage. Only available for verified members.",
  },
  {
    icon: <Star size={32} className="text-harvest" />,
    title: "Your Farm, Your Terms",
    desc: "Idle tractors, empty guest rooms, unused pasture — they can all earn income. Feorm connects your assets with people who need them.",
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-fog">
      <div className="max-w-lg w-full text-center">
        <div className="mb-12">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-8">
            {onboardingSlides[step].icon}
          </div>
          <h1 className="font-serif-display text-3xl md:text-4xl mb-6 text-earth">
            {onboardingSlides[step].title}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            {onboardingSlides[step].desc}
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-10">
          {onboardingSlides.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === step ? "bg-earth" : "bg-sand"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-4">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 btn-secondary-feorm px-5 py-3 text-xs uppercase tracking-widest"
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (step < 2) {
                setStep((s) => s + 1);
              } else {
                router.push("/auth/terms");
              }
            }}
            className="flex-1 btn-primary-feorm px-5 py-3 text-xs uppercase tracking-widest flex justify-center items-center gap-2"
          >
            {step < 2 ? "Next" : "Continue"}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
