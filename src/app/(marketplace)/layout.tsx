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
      <main className="flex-grow flex flex-col">{children}</main>
      <FeormFooter />
    </div>
  );
}
