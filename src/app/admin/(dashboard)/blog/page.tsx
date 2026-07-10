import Link from "next/link";
import { ChevronLeft, Plus, Pencil, Eye, EyeOff, Star } from "lucide-react";
import { requireAdmin, listBlogAdmin, getPostByIdAdmin, getBlogCategoriesAdmin } from "@/lib/admin";
import { savePost, deletePost, togglePostPublished } from "@/app/admin/actions";
import ImageField from "@/components/admin/ImageField";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-[#fffdf8] px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-clay/50 focus:outline-none focus:ring-1 focus:ring-clay/30";

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">{label}</span>
      {children}
    </label>
  );
}

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await requireAdmin("staff");
  const { edit } = await searchParams;
  const [posts, categories] = await Promise.all([listBlogAdmin(), getBlogCategoriesAdmin()]);
  const post = edit ? await getPostByIdAdmin(edit) : null;
  const isEditing = !!post;

  return (
    <div>
      {/* Back link */}
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-clay">
        <ChevronLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      {/* Header */}
      <div className="mt-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Blog</h1>
          <p className="mt-1 text-sm text-ink/55">{posts.length} posts</p>
        </div>
        {!isEditing && (
          <Link href="/admin/blog?edit=new" className="inline-flex items-center gap-2 rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-paper hover:bg-clay-2">
            <Plus className="h-4 w-4" /> New Post
          </Link>
        )}
      </div>

      {/* Posts list */}
      <div className="mt-6 space-y-2">
        {posts.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-2xl border border-ink/10 bg-[#fffdf8] px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">{p.title}</p>
              <p className="truncate text-xs text-ink/45">
                /blog/{p.slug}
                {p.categoryName ? ` · ${p.categoryName}` : ""}
                {p.status === "draft" ? " · Draft" : ""}
                {p.status === "scheduled" ? " · Scheduled" : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {p.featured && (
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              )}
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] uppercase ${
                p.status === "published" ? "bg-emerald-400/20 text-emerald-600" : "bg-ink/10 text-ink/45"
              }`}>
                {p.status}
              </span>
              {/* Published toggle */}
              <form action={togglePostPublished}>
                <input type="hidden" name="id" value={p.id} />
                <button type="submit" className="rounded-lg p-1.5 text-ink/50 hover:bg-ink/[0.06] hover:text-ink" title={p.status === "published" ? "Unpublish" : "Publish"}>
                  {p.status === "published" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </form>
              <Link href={`/admin/blog?edit=${p.id}`} className="inline-flex items-center gap-1 rounded-lg bg-ink/[0.06] px-3 py-1.5 text-xs text-ink hover:bg-ink/[0.1]">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <form action={deletePost}>
                <input type="hidden" name="id" value={p.id} />
                <button type="submit" className="rounded-lg bg-rose-500/15 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-500/25">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="rounded-2xl border border-ink/10 bg-[#fffdf8] p-8 text-center text-sm text-ink/45">No posts yet. Create your first one below.</p>
        )}
      </div>

      {/* Create / Edit form */}
      <form action={savePost} className="mt-8">
        <section className="rounded-2xl border border-ink/10 bg-[#fffdf8] p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-clay">
            {isEditing ? `EDIT: ${post!.title}` : "NEW POST"}
          </h2>
          {isEditing && <input type="hidden" name="id" value={post!.id} />}

          <div className="grid gap-4 sm:grid-cols-2">
            <F label="Title *">
              <input name="title" required defaultValue={post?.title ?? ""} className={inputCls} placeholder="Post title" />
            </F>
            <F label="Slug">
              <input name="slug" defaultValue={post?.slug ?? ""} className={inputCls} placeholder="auto-generated-from-title" />
            </F>
            <div className="sm:col-span-2">
              <F label="Excerpt">
                <textarea name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} className={inputCls} placeholder="Short summary for cards/SEO" />
              </F>
            </div>
            <div className="sm:col-span-2">
              <F label="Content (Markdown)">
                <textarea name="content" rows={8} defaultValue={post?.content ?? ""} className={inputCls} placeholder="Write your article in Markdown…" />
              </F>
            </div>
            <div className="sm:col-span-2">
              <ImageField name="image" label="Cover Image" defaultValue={post?.coverImage ?? ""} hint="Paste a URL, or upload from device" />
            </div>
            <F label="Author">
              <input name="author" defaultValue={post?.author ?? "Happy Aquarium"} className={inputCls} />
            </F>
            <F label="Category">
              <input name="categoryId" defaultValue={post?.categoryId ?? ""} className={inputCls} placeholder="e.g. Care Guides" />
            </F>
            <div className="sm:col-span-2">
              <F label="Tags (one per line)">
                <textarea name="tags" rows={3} defaultValue={(post?.tags ?? []).join("\n")} className={inputCls} placeholder="care-guide&#10;water-quality&#10;beginners" />
              </F>
            </div>
            <F label="Meta Title">
              <input name="metaTitle" defaultValue={post?.metaTitle ?? ""} className={inputCls} placeholder="SEO title" />
            </F>
            <F label="Meta Description">
              <input name="metaDescription" defaultValue={post?.metaDescription ?? ""} className={inputCls} placeholder="SEO description" />
            </F>
          </div>

          {/* Flags */}
          <div className="mt-4 flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="featured" defaultChecked={isEditing ? post!.featured : false} className="h-4 w-4 accent-clay" />
              <span className="text-sm text-ink">Featured</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="published" defaultChecked={isEditing ? post!.status !== "draft" : false} className="h-4 w-4 accent-clay" />
              <span className="text-sm text-ink">Published</span>
            </label>
          </div>

          {/* Actions */}
          <div className="mt-5 flex justify-end gap-3 border-t border-ink/10 pt-4">
            {isEditing && (
              <Link href="/admin/blog" className="rounded-full border border-ink/20 px-6 py-3 text-sm text-ink/70 hover:bg-ink/[0.04]">
                Cancel
              </Link>
            )}
            <button type="submit" className="rounded-full bg-clay px-8 py-3 text-sm font-semibold text-paper hover:bg-clay-2">
              {isEditing ? "Save changes" : "Create post"}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}
