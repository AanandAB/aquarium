import Link from "next/link";
import { Plus, Eye, EyeOff, Pencil, ArrowLeft } from "lucide-react";
import { requireAdmin, listHomepageSectionsAdmin, getHomepageSectionById } from "@/lib/admin";
import { saveHomepageSection, deleteHomepageSection } from "@/app/admin/actions";
import { SECTION_TYPES } from "@/db/schema";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-lg border border-ink/15 bg-[#fffdf8] px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-clay/50 focus:outline-none focus:ring-1 focus:ring-clay/30";

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/55">{label}</span>
      {children}
    </label>
  );
}

export default async function HomepageSectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await requireAdmin("manager");
  const { edit } = await searchParams;
  const sections = await listHomepageSectionsAdmin();
  const section = edit ? await getHomepageSectionById(edit) : null;
  const isEditing = !!section;

  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-clay">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Homepage Sections</h1>
          <p className="mt-1 text-sm text-ink/55">{sections.length} sections. Drag to reorder (coming soon — use sort order numbers).</p>
        </div>
      </div>

      {/* Current sections list */}
      <div className="mt-6 space-y-2">
        {sections.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-2xl border border-ink/10 bg-[#fffdf8] px-4 py-3">
            <div className="min-w-0">
              <p className="font-medium text-ink">{s.title ?? s.sectionType}</p>
              <p className="text-xs text-ink/45">Type: {s.sectionType} · Order: {s.sortOrder} · {s.visible ? "Visible" : "Hidden"}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link href={`/admin/homepage?edit=${s.id}`} className="inline-flex items-center gap-1 rounded-lg bg-ink/[0.06] px-3 py-1.5 text-xs text-ink hover:bg-ink/[0.1]">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <form action={deleteHomepageSection}>
                <input type="hidden" name="id" value={s.id} />
                <button type="submit" className="rounded-lg bg-rose-500/15 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-500/25">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/create form */}
      <form action={saveHomepageSection} className="mt-8 rounded-2xl border border-ink/10 bg-[#fffdf8] p-5">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">
          {isEditing ? `Edit: ${section?.title ?? section?.sectionType}` : "Add new section"}
        </h2>
        {isEditing && <input type="hidden" name="id" value={section!.id} />}
        <div className="grid gap-4 sm:grid-cols-2">
          <F label="Section type">
            <select name="sectionType" required defaultValue={section?.sectionType ?? "custom"} className={inputCls}>
              {SECTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </F>
          <F label="Sort order"><input name="sortOrder" type="number" defaultValue={section?.sortOrder ?? sections.length + 1} className={inputCls} /></F>
          <F label="Title"><input name="title" defaultValue={section?.title ?? ""} className={inputCls} /></F>
          <F label="Subtitle"><input name="subtitle" defaultValue={section?.subtitle ?? ""} className={inputCls} /></F>
          <div className="sm:col-span-2">
            <F label="Config (JSON)"><textarea name="config" rows={4} defaultValue={section?.config ? JSON.stringify(section.config, null, 2) : ""} className={inputCls} /></F>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <input type="checkbox" name="visible" id="vis" defaultChecked={isEditing ? section!.visible : true} className="h-4 w-4 accent-clay" />
          <label htmlFor="vis" className="text-sm text-ink">Visible on homepage</label>
        </div>
        <div className="mt-5 flex justify-end gap-3 border-t border-ink/10 pt-4">
          {isEditing && <Link href="/admin/homepage" className="rounded-full border border-ink/20 px-6 py-3 text-sm text-ink/70 hover:bg-ink/[0.04]">Cancel</Link>}
          <button type="submit" className="rounded-full bg-clay px-8 py-3 text-sm font-semibold text-paper hover:bg-clay-2">
            {isEditing ? "Save changes" : "Add section"}
          </button>
        </div>
      </form>
    </div>
  );
}
