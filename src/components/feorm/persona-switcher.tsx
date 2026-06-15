"use client";

import { useState } from "react";
import { useFeormAuth } from "@/context/feorm-context";
import { X, User, Sprout } from "lucide-react";

export default function PersonaSwitcher() {
  const { persona, setPersona } = useFeormAuth();
  const [open, setOpen] = useState(false);

  const handleSwitch = (p: "farmer" | "guest") => {
    setPersona(p);
    setOpen(false);
    // Reload to refresh all components with new persona
    window.location.reload();
  };

  return (
    <>
      {/* Floating Pill Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-earth text-white-feorm px-5 py-3 rounded-full shadow-lg shadow-earth/20 hover:bg-soil transition-all duration-200 active:scale-[0.97] min-h-[48px] text-sm font-medium"
        aria-label="Switch view persona"
      >
        <User size={16} />
        <span>Switch View</span>
      </button>

      {/* Modal */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-[70] bg-earth/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="bg-white-feorm rounded-2xl shadow-2xl border border-earth/10 max-w-sm w-full overflow-hidden animate-slide-up">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-earth/5">
                <h3 className="font-serif-display text-xl text-earth">Switch View</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-fog flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>

              {/* Options */}
              <div className="p-4 space-y-3">
                <button
                  onClick={() => handleSwitch("farmer")}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 min-h-[72px] ${
                    persona === "farmer"
                      ? "border-harvest bg-accent/30"
                      : "border-earth/8 hover:border-earth/20 hover:bg-fog"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-verified-bg flex items-center justify-center shrink-0">
                    <Sprout size={22} className="text-verified" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-earth text-sm">I am a Farmer</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      View your host dashboard, listings, and bookings
                    </p>
                  </div>
                  {persona === "farmer" && (
                    <span className="ml-auto tag-verified text-[9px] uppercase font-semibold px-2.5 py-1">
                      Active
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleSwitch("guest")}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 min-h-[72px] ${
                    persona === "guest"
                      ? "border-harvest bg-accent/30"
                      : "border-earth/8 hover:border-earth/20 hover:bg-fog"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <User size={22} className="text-accent-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-earth text-sm">I am a Guest</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Explore farm stays and book your next adventure
                    </p>
                  </div>
                  {persona === "guest" && (
                    <span className="ml-auto tag-pastel text-[9px] uppercase font-semibold px-2.5 py-1">
                      Active
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
