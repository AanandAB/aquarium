import Image from "next/image";
import { requireAdmin } from "@/lib/admin";
import { getGallery } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminGallery() {
  await requireAdmin("viewer");
  const items = await getGallery();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-softwhite">Gallery</h1>
      <p className="mt-1 text-sm text-slate-400">{items.length} items.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((g) => (
          <div key={g.id} className="overflow-hidden rounded-2xl glass">
            <div className="relative aspect-square">
              <Image src={g.thumbnailUrl ?? g.url} alt={g.title ?? ""} fill className="object-cover" />
            </div>
            <p className="truncate px-2 py-2 text-xs text-slate-300">{g.title ?? g.kind}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
