export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-grow flex flex-col min-h-screen">
      <main id="main-content" className="flex-grow flex flex-col">
        {children}
      </main>
    </div>
  );
}
