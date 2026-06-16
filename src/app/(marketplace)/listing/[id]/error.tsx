"use client";

export default function ListingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex-grow flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md px-4">
        <p className="text-sm text-muted-foreground mb-4">
          Something went wrong loading this listing.
        </p>
        <button
          onClick={reset}
          className="btn-primary-feorm px-6 py-3 text-xs uppercase tracking-widest"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
