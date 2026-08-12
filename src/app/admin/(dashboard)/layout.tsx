import { requireAdmin } from "@/lib/admin";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin("viewer");
  return (
    <div className="lg:flex">
      <AdminSidebar name={session.name ?? session.email} role={session.role} />
      <div className="min-w-0 flex-1">
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
