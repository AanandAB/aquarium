import Image from "next/image";
import Link from "next/link";
import { Fish as FishIcon, MessageCircle, Thermometer } from "lucide-react";
import type { FishCard as FishCardType } from "@/lib/queries";
import {
  cn, formatPrice, discountPct, whatsappHref,
  AVAILABILITY_LABELS, DIFFICULTY_LABELS,
} from "@/lib/utils";
import { reserveMsg, SITE } from "@/lib/site";

const availTone: Record<string, string> = {
  available: "bg-emerald-600",
  low_stock: "bg-amber-600",
  out_of_stock: "bg-rose-600",
  reserved: "bg-sky-600",
};

export function FishCard({
  fish,
  whatsapp = SITE.whatsapp,
}: {
  fish: FishCardType;
  whatsapp?: string;
}) {
  const off = discountPct(fish.price, fish.offerPrice);
  const price = fish.offerPrice ?? fish.price;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-[#fffdf8] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(34,29,22,0.5)]">
      <Link href={`/fish/${fish.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        {fish.heroImage ? (
          <Image
            src={fish.heroImage}
            alt={fish.name}
            fill
            sizes="(max-width:768px) 90vw, 320px"
            className="object-cover transition-transform duration-[1.3s] ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-paper-2">
            <FishIcon className="h-10 w-10 text-teal/30" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {off > 0 && (
            <span className="rounded-full bg-clay px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-paper">
              -{off}%
            </span>
          )}
          {fish.isImported && (
            <span className="rounded-full bg-paper/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink backdrop-blur">
              Imported
            </span>
          )}
          {fish.isNewArrival && (
            <span className="rounded-full bg-teal px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-paper">
              New
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {fish.categoryName && (
          <span className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-clay">
            {fish.categoryName}
          </span>
        )}
        <Link href={`/fish/${fish.slug}`}>
          <h3 className="font-display text-lg font-medium leading-tight text-ink transition-colors group-hover:text-teal">
            {fish.name}
          </h3>
          {fish.scientificName && (
            <p className="truncate text-xs italic text-ink/45">
              {fish.scientificName}
            </p>
          )}
        </Link>

        <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-ink/55">
          <span>{DIFFICULTY_LABELS[fish.difficulty ?? "beginner"]}</span>
          {(fish.temperatureMin || fish.temperatureMax) && (
            <span className="inline-flex items-center gap-1">
              <Thermometer className="h-3 w-3 text-teal" />
              {fish.temperatureMin}–{fish.temperatureMax}°C
            </span>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-ink/10 pt-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-num text-lg font-semibold text-ink">
                {formatPrice(price, fish.currency)}
              </span>
              {off > 0 && (
                <span className="font-num text-xs text-ink/40 line-through">
                  {formatPrice(fish.price, fish.currency)}
                </span>
              )}
            </div>
            <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-ink/50">
              <span className={cn("h-1.5 w-1.5 rounded-full", availTone[fish.availability ?? "available"])} />
              {AVAILABILITY_LABELS[fish.availability ?? "available"]}
            </span>
          </div>
          <a
            href={whatsappHref(whatsapp, reserveMsg(fish.name))}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Reserve ${fish.name} on WhatsApp`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal text-paper transition-all hover:bg-teal-2 hover:scale-105"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
