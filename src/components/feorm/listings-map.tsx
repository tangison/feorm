"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

interface MapListing {
  id: string;
  title: string;
  price: number;
  type: string;
  category: string;
  lat: number | null | undefined;
  lng: number | null | undefined;
  region: string;
}

interface ListingsMapProps {
  listings: MapListing[];
}

// Default center: Windhoek, Namibia
const DEFAULT_CENTER: [number, number] = [-22.5597, 17.0832];
const DEFAULT_ZOOM = 6;

export default function ListingsMap({ listings }: ListingsMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    let cancelled = false;

    async function initMap() {
      try {
        const maplibregl = (await import("maplibre-gl")).default;

        // Import MapLibre CSS
        if (!document.querySelector('link[href*="maplibre"]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css";
          document.head.appendChild(link);
        }

        if (cancelled || !mapContainer.current) return;

        const map = new maplibregl.Map({
          container: mapContainer.current,
          style: {
            version: 8,
            sources: {
              osm: {
                type: "raster",
                tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                tileSize: 256,
                attribution: "&copy; OpenStreetMap contributors",
              },
            },
            layers: [
              {
                id: "osm-tiles",
                type: "raster",
                source: "osm",
                minzoom: 0,
                maxzoom: 19,
              },
            ],
          },
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
        });

        map.addControl(new maplibregl.NavigationControl(), "top-right");
        map.addControl(new maplibregl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
        }), "top-right");

        map.on("load", () => {
          if (!cancelled) {
            setMapLoaded(true);
          }
        });

        mapRef.current = map;
      } catch (error) {
        console.error("MapLibre initialization failed:", error);
      }
    }

    initMap();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Add/update markers when listings change
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const map = mapRef.current;

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Filter listings with valid coordinates
    const geoListings = listings.filter(
      (l) => l.lat != null && l.lng != null && !isNaN(l.lat) && !isNaN(l.lng)
    );

    if (geoListings.length === 0) return;

    const bounds = new (require("maplibre-gl") as any).LngLatBounds();

    geoListings.forEach((listing) => {
      // Create popup
      const popup = new (require("maplibre-gl") as any).Popup({ offset: 25 }).setHTML(`
        <div style="font-family: system-ui; padding: 4px;">
          <h3 style="font-size: 14px; font-weight: 600; margin: 0 0 4px 0; color: #3D2914;">
            ${listing.title}
          </h3>
          <p style="font-size: 12px; color: #6B5735; margin: 0 0 6px 0;">
            ${listing.category === "stay" ? "Farm Stay" : "Equipment"} · ${listing.region}
          </p>
          <p style="font-size: 14px; font-weight: 600; color: #3D2914; margin: 0;">
            ${formatPrice(listing.price)} / day
          </p>
          <a href="/listing/${listing.id}" style="
            display: inline-block;
            margin-top: 8px;
            padding: 4px 12px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            background: #C4933A;
            color: white;
            border-radius: 9999px;
            text-decoration: none;
          ">View Details</a>
        </div>
      `);

      // Create marker with category color
      const el = document.createElement("div");
      el.style.cssText = `
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        background: ${listing.category === "stay" ? "#5A7A50" : "#7A6530"};
      `;
      el.textContent = listing.category === "stay" ? "S" : "E";

      const marker = new (require("maplibre-gl") as any).Marker({ element: el })
        .setLngLat([listing.lng, listing.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);

      bounds.extend([listing.lng, listing.lat]);
    });

    // Fit bounds if we have markers
    if (geoListings.length > 0) {
      map.fitBounds(bounds, { padding: 50, maxZoom: 12 });
    }
  }, [listings, mapLoaded]);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden border border-earth/10">
      <div ref={mapContainer} className="w-full h-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 bg-fog flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-harvest animate-pulse" />
            <span className="font-mono-feorm text-[9px] text-muted-foreground uppercase tracking-widest">
              Loading map
            </span>
          </div>
        </div>
      )}
      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-white-feorm/90 backdrop-blur-sm border border-earth/10 rounded-lg p-3 z-10">
        <p className="font-mono-feorm text-[8px] uppercase tracking-widest text-muted-foreground mb-2">
          Legend
        </p>
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#5A7A50] border border-white" />
            <span className="text-[10px] text-earth">Farm Stay</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#7A6530] border border-white" />
            <span className="text-[10px] text-earth">Equipment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
