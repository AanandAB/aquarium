import { requireAdmin, listEnquiriesAdmin } from "@/lib/admin";
import { updateEnquiryStatus } from "@/app/admin/actions";
import { ENQUIRY_STATUS } from "@/db/schema";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusTone: Record<string, string> = {
  new: "bg-coral/20 text-coral-soft",
  contacted: "bg-sky-400/20 text-sky-300",
  confirmed: "bg-amber-400/20 text-amber-300",
  completed: "bg-emerald-400/20 text-emerald-300",
  cancelled: "bg-white/10 text-slate-400",
};

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin("staff");
  const { status } = await searchParams;
  const enquiries = await listEnquiriesAdmin(status);

  const filters = ["all", ...ENQUIRY_STATUS];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-softwhite">Enquiries</h1>
      <p className="mt-1 text-sm text-slate-400">
        Reservations, messages, call requests and newsletter sign-ups.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f}
            href={f === "all" ? "/admin/enquiries" : `/admin/enquiries?status=${f}`}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
              (status ?? "all") === f
                ? "bg-aqua text-navy"
                : "bg-white/8 text-slate-300 hover:bg-white/15"
            }`}
          >
            {f}
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {enquiries.length === 0 ? (
          <p className="rounded-2xl glass p-8 text-center text-slate-400">
            No enquiries found.
          </p>
        ) : (
          enquiries.map((e) => (
            <div key={e.id} className="rounded-2xl glass p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-softwhite">
                      {e.name ?? "Anonymous"}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${statusTone[e.status]}`}>
                      {e.status}
                    </span>
                    <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] uppercase text-slate-400">
                      {e.type}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">
                    {e.itemName && <span className="text-aqua">{e.itemName} · </span>}
                    {e.message}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {e.phone && <a href={`tel:${e.phone}`} className="hover:text-aqua">{e.phone}</a>}
                    {e.phone && e.email && " · "}
                    {e.email && <a href={`mailto:${e.email}`} className="hover:text-aqua">{e.email}</a>}
                    {e.createdAt && ` · ${new Date(e.createdAt).toLocaleString("en-IN")}`}
                  </p>
                </div>

                <form action={updateEnquiryStatus} className="flex shrink-0 items-center gap-2">
                  <input type="hidden" name="id" value={e.id} />
                  <select
                    name="status"
                    defaultValue={e.status}
                    className="rounded-lg border border-white/15 bg-navy px-2 py-1.5 text-xs text-softwhite focus:outline-none"
                  >
                    {ENQUIRY_STATUS.map((sv) => (
                      <option key={sv} value={sv}>{sv}</option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-lg bg-aqua px-3 py-1.5 text-xs font-medium text-navy hover:opacity-90"
                  >
                    Update
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
