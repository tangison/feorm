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
        Mobile: top header = 48px, bottom tab bar = 56px + safe area
        Desktop: left sidebar = 240px
      */}
      <main
        id="main-content"
        className="flex-grow flex flex-col page-enter pt-12 pb-16 lg:pt-0 lg:pb-0 lg:ml-[240px]"
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
