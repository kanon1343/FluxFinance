import { Header } from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  lastUpdate?: Date | null;
}

export function DashboardLayout({
  children,
  lastUpdate,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header lastUpdate={lastUpdate} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
