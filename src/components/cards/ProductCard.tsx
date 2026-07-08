import Image from "next/image";
import Link from "next/link";
import { Package, MessageCircle } from "lucide-react";
import type { ProductCard as ProductCardType } from "@/lib/queries";
import { formatPrice, discountPct, whatsappHref } from "@/lib/utils";
import { SITE } from "@/lib/site";

export function ProductCard({
  product,
  whatsapp = SITE.whatsapp,
}: {
  product: ProductCardType;
  whatsapp?: string;
}) {
  const off = discountPct(product.price, product.offerPrice);
  const price = product.offerPrice ?? product.price;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-[#fffdf8] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(34,29,22,0.5)]">
      <Link href={`/accessories/${product.slug}`} className="relative block aspect-square overflow-hidden">
        {product.heroImage ? (
          <Image
            src={product.heroImage}
            alt={product.name}
            fill
            sizes="(max-width:768px) 45vw, 300px"
            className="object-cover transition-transform duration-[1.3s] ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-paper-2">
            <Package className="h-10 w-10 text-teal/30" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {off > 0 && (
            <span className="rounded-full bg-clay px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-paper">
              -{off}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="rounded-full bg-teal px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-paper">
              New
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {product.brand && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-clay">
            {product.brand}
          </span>
        )}
        <Link href={`/accessories/${product.slug}`}>
          <h3 className="line-clamp-2 font-display text-[15px] font-medium leading-snug text-ink transition-colors group-hover:text-teal">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between border-t border-ink/10 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-num text-base font-semibold text-ink">
              {formatPrice(price, product.currency)}
            </span>
            {off > 0 && (
              <span className="font-num text-xs text-ink/40 line-through">
                {formatPrice(product.price, product.currency)}
              </span>
            )}
          </div>
          <a
            href={whatsappHref(whatsapp, `Hi Happy Aquarium! I'm interested in the *${product.name}*.`)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Enquire about ${product.name} on WhatsApp`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink/[0.06] text-teal transition-all hover:bg-teal hover:text-paper"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
