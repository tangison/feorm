export default function AuthLoading() {
  return (
    <div className="flex-grow flex items-center justify-center min-h-screen bg-[#FAF7F2]">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#E8C96A] animate-pulse" />
        <span className="font-mono-feorm text-[10px] text-[#787774] uppercase tracking-widest">
          Loading...
        </span>
      </div>
    </div>
  );
}
