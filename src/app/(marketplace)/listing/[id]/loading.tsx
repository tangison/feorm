export default function ListingLoading() {
  return (
    <div className="flex-grow flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-harvest animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-harvest animate-pulse delay-1" />
          <div className="w-2 h-2 rounded-full bg-harvest animate-pulse delay-2" />
        </div>
        <p className="text-sm text-muted-foreground font-mono-feorm">
          Loading listing...
        </p>
      </div>
    </div>
  );
}
