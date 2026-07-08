import { requireAdmin, listTestimonialsAdmin } from "@/lib/admin";
import { Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminTestimonials() {
  await requireAdmin("viewer");
  const items = await listTestimonialsAdmin();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-softwhite">Testimonials</h1>
      <p className="mt-1 text-sm text-slate-400">{items.length} reviews.</p>
      <div className="mt-6 space-y-3">
        {items.map((t) => (
          <div key={t.id} className="rounded-2xl glass p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-softwhite">
                {t.customerName}
                {t.location ? <span className="text-slate-500"> · {t.location}</span> : null}
              </p>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} />
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-300">{t.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
