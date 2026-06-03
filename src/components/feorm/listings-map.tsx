"use client";

import { useEffect, useRef, useState } from "react";
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

// MapLibre uses [lng, lat] order (longitude first)
const DEFAULT_CENTER: [number, number] = [17.0832, -22.5597]; // Windhoek, Namibia
const DEFAULT_ZOOM = 5.5;

// Restrict panning to southern Africa
const MAP_BOUNDS: [[number, number], [number, number]] = [
  [11.5, -29.5], // SW corner [lng, lat]
  [25.5, -16.5], // NE corner [lng, lat]
];

// Custom marker colors
const STAY_COLOR = "#5C8A5C";   // earth green
const EQUIP_COLOR = "#8B6914";  // harvest brown

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
                attribution: "© OpenStreetMap contributors",
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
          maxBounds: MAP_BOUNDS,
        });

        // Zoom controls (+ / - buttons)
        map.addControl(new maplibregl.NavigationControl(), "top-right");

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

    // Filter listings with valid coordinates (skip silently if missing)
    const geoListings = listings.filter(
      (l) =>
        l.lat != null &&
        l.lng != null &&
        !isNaN(l.lat as number) &&
        !isNaN(l.lng as number)
    );

    if (geoListings.length === 0) return;

    const maplibregl = require("maplibre-gl") as any;
    const bounds = new maplibregl.LngLatBounds();

    geoListings.forEach((listing) => {
      const isStay = listing.category === "stay";
      const priceLabel = isStay
        ? `${formatPrice(listing.price)}/night`
        : `${formatPrice(listing.price)}/day`;

      // Create popup using DOM elements (prevents XSS via setHTML)
      const container = document.createElement("div");
      container.className = "map-popup";
      container.style.cssText =
        "font-family: system-ui; padding: 4px;";

      const title = document.createElement("p");
      title.className = "popup-title";
      title.style.cssText =
        "font-size: 14px; font-weight: 600; margin: 0 0 4px 0; color: #3D2914;";
      title.textContent = listing.title;

      const region = document.createElement("p");
      region.style.cssText =
        "font-size: 12px; color: #6B5735; margin: 0 0 6px 0;";
      region.textContent = `${isStay ? "Farm Stay" : "Equipment"} · ${listing.region}`;

      const price = document.createElement("p");
      price.style.cssText =
        "font-size: 14px; font-weight: 600; color: #3D2914; margin: 0;";
      price.textContent = priceLabel;

      const link = document.createElement("a");
      link.href = `/listing/${listing.id}`;
      link.textContent = "View Details →";
      link.style.cssText =
        "display: inline-block; margin-top: 8px; padding: 4px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; background: #C4933A; color: white; border-radius: 9999px; text-decoration: none;";

      container.append(title, region, price, link);

      const popup = new maplibregl.Popup({ offset: 25 }).setDOMContent(container);

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
        background: ${isStay ? STAY_COLOR : EQUIP_COLOR};
      `;
      el.textContent = isStay ? "S" : "E";

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([listing.lng, listing.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);

      bounds.extend([listing.lng, listing.lat]);
    });

    // Fit bounds if we have markers (don't override default view too aggressively)
    if (geoListings.length > 0) {
      map.fitBounds(bounds, { padding: 50, maxZoom: 10 });
    }
  }, [listings, mapLoaded]);

  return (
    <div className="relative w-full h-[60vh] md:h-[calc(100vh-120px)] rounded-xl overflow-hidden border border-earth/10">
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
            <div className="w-3 h-3 rounded-full border border-white" style={{ background: STAY_COLOR }} />
            <span className="text-[10px] text-earth">Farm Stay</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full border border-white" style={{ background: EQUIP_COLOR }} />
            <span className="text-[10px] text-earth">Equipment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
