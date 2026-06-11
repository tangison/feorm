"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFeormAuth } from "@/context/feorm-context";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { NAMIBIAN_REGIONS } from "@/lib/regions";
import { toast } from "@/hooks/use-toast";

export default function NewListingPage() {
  const { user } = useFeormAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"stay">("stay");
  const [region, setRegion] = useState("Khomas");
  const [priceCents, setPriceCents] = useState("");
  const [hostPhone, setHostPhone] = useState(user?.phone || "");
  const [amenities, setAmenities] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !priceCents) {
      toast({ title: "Title and price are required" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          region,
          price: Math.round(parseFloat(priceCents) * 100), // Convert N$ to cents
          hostId: user?.id,
          hostName: user?.name || "",
          hostPhone: hostPhone ? `+264${hostPhone.replace(/\s/g, "")}` : "",
          features: amenities,
          lat: lat ? parseFloat(lat) : null,
          lng: lng ? parseFloat(lng) : null,
        }),
      });

      if (!res.ok) throw new Error("Could not create listing");

      toast({ title: "Listing created successfully" });
      router.push("/marketplace");
    } catch {
      toast({ title: "Could not create listing", description: "Something went wrong. Please try again." });
    }
    setLoading(false);
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 min-h-[60vh] bg-fog">
      <div className="max-w-lg w-full">
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-earth transition-colors min-h-[44px] rounded-full hover:bg-earth/5"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="mb-10">
          <kbd className="font-mono-feorm text-[10px] border border-soil/20 bg-white-feorm px-2 py-1 rounded text-muted-foreground mb-6 inline-block">
            NEW LISTING
          </kbd>
          <h1 className="font-serif-display text-3xl md:text-4xl mb-4 text-earth tracking-tight">
            Add a listing
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Create a new farm stay listing on Feorm.
          </p>
        </div>

        <div className="space-y-5">
          {/* Category: Farm Stay */}
          <div className="flex gap-3">
            <div
              className="flex-1 p-4 text-center border-2 border-harvest bg-accent/30 rounded-[8px]"
            >
              <span className="text-sm font-medium text-earth">Farm Stay</span>
            </div>
          </div>

          {/* Title */}
          <div className="border border-soil/20 bg-white-feorm p-4 rounded-[4px] focus-within:border-earth transition-colors">
            <label htmlFor="title" className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-muted-foreground">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Erongo Granite Lodge"
              className="w-full bg-transparent outline-none text-lg text-earth placeholder-sand min-h-[44px]"
            />
          </div>

          {/* Description */}
          <div className="border border-soil/20 bg-white-feorm p-4 rounded-[4px] focus-within:border-earth transition-colors">
            <label htmlFor="description" className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-muted-foreground">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your listing..."
              rows={3}
              className="w-full bg-transparent outline-none text-base text-earth placeholder-sand resize-none min-h-[80px]"
            />
          </div>

          {/* Price */}
          <div className="border border-soil/20 bg-white-feorm p-4 rounded-[4px] focus-within:border-earth transition-colors">
            <label htmlFor="price" className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-muted-foreground">
              Price per Day (N$)
            </label>
            <div className="flex items-center">
              <span className="font-mono-feorm text-lg mr-3 text-soil" aria-hidden="true">N$</span>
              <input
                id="price"
                type="number"
                value={priceCents}
                onChange={(e) => setPriceCents(e.target.value)}
                placeholder="150"
                min="0"
                className="w-full bg-transparent outline-none text-lg text-earth placeholder-sand font-mono-feorm min-h-[44px]"
              />
            </div>
          </div>

          {/* Region */}
          <div className="border border-soil/20 bg-white-feorm p-4 rounded-[4px] focus-within:border-earth transition-colors">
            <label htmlFor="region" className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-muted-foreground">
              Region
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-transparent outline-none text-lg text-earth min-h-[44px]"
            >
              {NAMIBIAN_REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <div className="border border-soil/20 bg-white-feorm p-4 rounded-[4px] focus-within:border-earth transition-colors">
            <label htmlFor="host-phone" className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-muted-foreground">
              Contact Phone
            </label>
            <div className="flex items-center">
              <span className="font-mono-feorm text-lg mr-3 text-soil" aria-hidden="true">+264</span>
              <input
                id="host-phone"
                type="tel"
                value={hostPhone}
                onChange={(e) => setHostPhone(e.target.value)}
                placeholder="81 000 0000"
                className="w-full bg-transparent outline-none text-lg text-earth placeholder-sand font-mono-feorm min-h-[44px]"
              />
            </div>
          </div>

          {/* Amenities / Features */}
          <div className="border border-soil/20 bg-white-feorm p-4 rounded-[4px] focus-within:border-earth transition-colors">
            <label htmlFor="amenities" className="block text-[10px] font-medium uppercase tracking-widest mb-2 text-muted-foreground">
              Amenities
            </label>
            <input
              id="amenities"
              type="text"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              placeholder="WiFi, Hot Water, Braai Area"
              className="w-full bg-transparent outline-none text-lg text-earth placeholder-sand min-h-[44px]"
            />
            <p className="text-[10px] text-muted-foreground mt-2">Separate with commas</p>
          </div>

          {/* GPS Coordinates */}
          <div className="border border-soil/20 bg-white-feorm p-4 rounded-[4px] focus-within:border-earth transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={14} className="text-earth" />
              <label className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Farm Location (GPS Coordinates)
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="lat" className="block text-[9px] uppercase tracking-widest text-muted-foreground mb-1">
                  Latitude
                </label>
                <input
                  id="lat"
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="-22.5597"
                  className="w-full bg-transparent outline-none text-base text-earth placeholder-sand font-mono-feorm min-h-[44px]"
                />
              </div>
              <div>
                <label htmlFor="lng" className="block text-[9px] uppercase tracking-widest text-muted-foreground mb-1">
                  Longitude
                </label>
                <input
                  id="lng"
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  placeholder="17.0832"
                  className="w-full bg-transparent outline-none text-base text-earth placeholder-sand font-mono-feorm min-h-[44px]"
                />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              Find your coordinates at maps.google.com — right click your farm → copy coordinates
            </p>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!title || !priceCents || loading}
            className="w-full btn-harvest px-5 py-4 text-xs uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {loading ? "Creating..." : "Create Listing"}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
