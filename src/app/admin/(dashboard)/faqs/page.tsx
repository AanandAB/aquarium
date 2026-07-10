import Link from "next/link";
import { Plus, Pencil, ArrowLeft } from "lucide-react";
import { requireAdmin, listFaqsAdmin, getFaqByIdAdmin } from "@/lib/admin";
import { saveFaq, deleteFaq } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-[#fffdf8] px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-clay/50 focus:outline-none focus:ring-1 focus:ring-clay/30";

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">
        {label}
      </span>
      {children}
    </label>
  );
}

export default async function FaqsPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await requireAdmin("staff");
  const { edit } = await searchParams;
  const faqs = await listFaqsAdmin();
  const f = edit && edit !== "new" ? await getFaqByIdAdmin(edit) : null;
  const isEditing = !!f;
  const showForm = !!edit;

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-clay"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">FAQs</h1>
          <p className="mt-1 text-sm text-ink/55">
            {faqs.length} frequently asked questions.
          </p>
        </div>
        {!showForm && (
          <Link
            href="/admin/faqs?edit=new"
            className="inline-flex items-center gap-2 rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-paper hover:bg-clay-2"
          >
            <Plus className="h-4 w-4" /> New FAQ
          </Link>
        )}
      </div>

      {/* FAQs table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-[#fffdf8]">
        <table className="w-full text-sm">
          <thead className="border-b border-ink/10 bg-ink/[0.03] text-left text-xs uppercase tracking-wide text-ink/55">
            <tr>
              <th className="px-4 py-3">Question</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr
                key={faq.id}
                className="border-t border-ink/[0.07] hover:bg-ink/[0.02]"
              >
                <td className="max-w-md px-4 py-3">
                  <p className="truncate font-medium text-ink">
                    {faq.question}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-medium capitalize text-teal">
                    {faq.category || "general"}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink/70">{faq.sortOrder}</td>
                <td className="px-4 py-3">
                  {faq.published ? (
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      Published
                    </span>
                  ) : (
                    <span className="rounded-full bg-ink/[0.06] px-2.5 py-0.5 text-xs font-medium text-ink/50">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/faqs?edit=${faq.id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-ink/[0.06] px-3 py-1.5 text-xs text-ink hover:bg-ink/[0.1]"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <form action={deleteFaq}>
                      <input type="hidden" name="id" value={faq.id} />
                      <button
                        type="submit"
                        className="rounded-lg bg-rose-500/15 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-500/25"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {faqs.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-ink/45"
                >
                  No FAQs yet. Create one below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create / edit form */}
      {showForm && (
        <section className="mt-8 rounded-2xl border border-ink/10 bg-[#fffdf8] p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-clay">
            {isEditing ? "Edit FAQ" : "New FAQ"}
          </h2>
          <form action={saveFaq}>
            {isEditing && <input type="hidden" name="id" value={f!.id} />}
            <div className="grid gap-4">
              <F label="Question">
                <input
                  name="question"
                  required
                  defaultValue={f?.question ?? ""}
                  className={inputCls}
                />
              </F>
              <F label="Answer">
                <textarea
                  name="answer"
                  rows={5}
                  defaultValue={f?.answer ?? ""}
                  className={inputCls}
                />
              </F>
              <div className="grid gap-4 sm:grid-cols-2">
                <F label="Category">
                  <input
                    name="category"
                    defaultValue={f?.category ?? "general"}
                    placeholder="general"
                    className={inputCls}
                  />
                </F>
                <F label="Sort order">
                  <input
                    name="sortOrder"
                    type="number"
                    defaultValue={f?.sortOrder ?? 0}
                    className={inputCls}
                  />
                </F>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                name="published"
                id="faq-published"
                defaultChecked={isEditing ? f!.published : true}
                className="h-4 w-4 accent-clay"
              />
              <label htmlFor="faq-published" className="text-sm text-ink">
                Published
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-3 border-t border-ink/10 pt-4">
              <Link
                href="/admin/faqs"
                className="rounded-full border border-ink/20 px-6 py-3 text-sm text-ink/70 hover:bg-ink/[0.04]"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-full bg-clay px-8 py-3 text-sm font-semibold text-paper hover:bg-clay-2"
              >
                {isEditing ? "Save changes" : "Create FAQ"}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
