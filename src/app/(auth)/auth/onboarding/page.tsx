"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, CheckCircle, Star, ArrowRight } from "lucide-react";

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

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-lg w-full text-center">
        <div className="mb-12">
          <div className="w-16 h-16 rounded-full bg-[#FBF3DB] flex items-center justify-center mx-auto mb-8">
            {onboardingSlides[step].icon}
          </div>
          <h2 className="font-serif-display text-3xl md:text-4xl mb-6 text-[#1E1A14]">
            {onboardingSlides[step].title}
          </h2>
          <p className="text-sm text-[#787774] leading-relaxed max-w-md mx-auto">
            {onboardingSlides[step].desc}
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-10">
          {onboardingSlides.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === step ? "bg-[#1E1A14]" : "bg-[#D4C4A0]"
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
