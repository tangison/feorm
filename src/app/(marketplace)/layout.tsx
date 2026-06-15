import FeormNav from "@/components/feorm/nav";
import FeormFooter from "@/components/feorm/footer";
import LazyTangisonChat from "@/components/feorm/lazy-tangison-chat";
import DemoBanner from "@/components/feorm/demo-banner";
import PersonaSwitcher from "@/components/feorm/persona-switcher";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-grow flex flex-col min-h-screen">
      <DemoBanner />
      <FeormNav />
      {/*
        Mobile: top header = 56px + demo banner offset, bottom tab bar = 64px + safe area
        Desktop: left sidebar = 260px + demo banner offset
      */}
      <main
        id="main-content"
        className="flex-grow flex flex-col page-enter pt-14 pb-24 lg:pt-0 lg:pb-0 lg:ml-[260px] demo-banner-offset"
      >
        {children}
      </main>
      <div className="lg:ml-[260px]">
        <FeormFooter />
      </div>
      <LazyTangisonChat />
      <PersonaSwitcher />
    </div>
  );
}
