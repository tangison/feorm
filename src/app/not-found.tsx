import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Asset Not Found | Feorm",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-fog px-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* MapPin Icon — inline SVG (server component, no Lucide import) */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center bg-earth/6">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-earth)"
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
        <h1 className="font-serif-display text-4xl tracking-tight text-earth">
          Asset Not Found
        </h1>

        {/* Body Copy */}
        <p className="text-base leading-relaxed text-muted-foreground">
          The requested coordinate in the Feorm network is currently unavailable.
        </p>

        {/* Return Link */}
        <div className="pt-4">
          <Link
            href="/marketplace"
            className="btn-primary-feorm inline-block px-6 py-3 text-xs uppercase tracking-widest font-medium no-underline"
          >
            Return to Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
