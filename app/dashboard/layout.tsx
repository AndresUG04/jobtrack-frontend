import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar, MobileNav } from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex w-full flex-1">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <MobileNav />
            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 sm:py-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
