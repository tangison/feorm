import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Asset Not Found | Feorm",
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: "#FAF7F2" }}
    >
      <div className="max-w-md w-full text-center space-y-8">
        {/* MapPin Icon — inline SVG (server component, no Lucide import) */}
        <div className="flex justify-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(30, 26, 20, 0.06)" }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1E1A14"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1
          className="font-serif-display text-4xl tracking-tight"
          style={{ color: "#1E1A14" }}
        >
          Asset Not Found
        </h1>

        {/* Body Copy */}
        <p
          className="text-base leading-relaxed"
          style={{ color: "#787774" }}
        >
          The requested coordinate in the Feorm network is currently unavailable.
        </p>

        {/* Return Link */}
        <div className="pt-4">
          <Link
            href="/marketplace"
            className="inline-block text-xs uppercase tracking-widest font-medium transition-all duration-200 no-underline"
            style={{
              backgroundColor: "#1E1A14",
              color: "#FEFDFB",
              borderRadius: "9999px",
              padding: "12px 24px",
            }}
          >
            Return to Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
