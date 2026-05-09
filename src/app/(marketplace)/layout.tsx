import FeormNav from "@/components/feorm/nav";
import FeormFooter from "@/components/feorm/footer";
import LazyTangisonChat from "@/components/feorm/lazy-tangison-chat";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-grow flex flex-col min-h-screen">
      <FeormNav />
      {/* Desktop: offset for 260px sidebar | Mobile: offset for 72px bottom nav */}
      <main
        id="main-content"
        className="flex-grow flex flex-col page-enter lg:ml-[260px] pb-[88px] lg:pb-0"
      >
        {children}
      </main>
      <div className="lg:ml-[260px]">
        <FeormFooter />
      </div>
      <LazyTangisonChat />
    </div>
  );
}
