export default function MarketplaceLoading() {
  return (
    <div className="flex-grow flex items-center justify-center min-h-[60vh]">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-harvest animate-pulse" />
        <span className="font-mono-feorm text-[10px] text-muted-foreground uppercase tracking-widest">
          Loading...
        </span>
      </div>
    </div>
  );
}
