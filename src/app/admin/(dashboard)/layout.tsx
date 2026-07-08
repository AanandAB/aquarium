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
    <div className="flex">
      <AdminSidebar name={session.name ?? session.email} role={session.role} />
      <div className="min-w-0 flex-1 p-6 sm:p-8">{children}</div>
    </div>
  );
}
