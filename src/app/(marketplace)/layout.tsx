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
      {/* 
        Mobile: top nav = 96px (2 × 48px), so pt-[96px]
        Desktop: left sidebar = 240px, so lg:ml-[240px] lg:pt-0
      */}
      <main
        id="main-content"
        className="flex-grow flex flex-col page-enter pt-[96px] lg:pt-0 lg:ml-[240px]"
      >
        {children}
      </main>
      <div className="lg:ml-[240px]">
        <FeormFooter />
      </div>
      <LazyTangisonChat />
    </div>
  );
}
