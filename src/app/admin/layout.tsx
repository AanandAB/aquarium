export const dynamic = "force-dynamic";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="relative z-10 min-h-screen">{children}</div>;
}
