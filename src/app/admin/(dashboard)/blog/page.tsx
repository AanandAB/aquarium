import { requireAdmin, listBlogAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminBlog() {
  await requireAdmin("viewer");
  const posts = await listBlogAdmin();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-softwhite">Blog</h1>
      <p className="mt-1 text-sm text-slate-400">{posts.length} posts.</p>
      <div className="mt-6 space-y-2">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-2xl glass px-4 py-3">
            <div className="min-w-0">
              <p className="truncate font-medium text-softwhite">{p.title}</p>
              <p className="truncate text-xs text-slate-500">/blog/{p.slug}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] uppercase ${
              p.status === "published" ? "bg-emerald-400/20 text-emerald-300" : "bg-white/10 text-slate-400"
            }`}>
              {p.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
