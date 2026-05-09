import FeormNav from "@/components/feorm/nav";
import FeormFooter from "@/components/feorm/footer";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-grow flex flex-col min-h-screen">
      <FeormNav />
      <main id="main-content" className="flex-grow flex flex-col page-enter">{children}</main>
      <FeormFooter />
    </div>
  );
}
