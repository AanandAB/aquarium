import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Returns, Refunds & Cancellation · Happy Aquarium",
  description: "Our policy on returns, refunds, cancellations, and delivery for aquarium fish and products.",
};

const h2Cls = "mt-10 mb-4 font-display text-xl font-semibold text-ink";
const h3Cls = "mt-6 mb-2 font-display text-lg font-semibold text-ink";
const pCls = "mb-3 leading-relaxed text-ink/75";

export default function ReturnsPage() {
  return (
    <>
      <PageHero
        eyebrow="Policies"
        title="Returns, Refunds & Cancellation"
        subtitle="Our commitment to fair and transparent transactions."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Returns & Refunds" }]}
      />
      <Container className="prose-custom pb-20">
        <p className={pCls}>
          <strong>Last updated:</strong> July 2026
        </p>

        <p className={pCls}>
          At <strong>Happy Aquarium</strong>, we take pride in the health and quality of our fish and
          products. This policy outlines your rights and our responsibilities regarding returns, refunds,
          cancellations, and delivery.
        </p>

        <h2 className={h2Cls}>1. Live Fish — Return & Refund Policy</h2>
        <p className={pCls}>
          Due to the nature of live animals, we have a specific policy for fish purchases:
        </p>

        <h3 className={h3Cls}>1.1 In-Store Purchase</h3>
        <ul className="mb-4 ml-5 list-disc space-y-1 text-ink/75">
          <li>All fish are visually inspected by you at the time of purchase. We encourage you to observe the fish carefully before buying.</li>
          <li>Once a fish leaves our store, we <strong>cannot accept returns or offer refunds</strong> for live fish, as we cannot guarantee the water conditions, tank compatibility, or care they receive after sale.</li>
        </ul>

        <h3 className={h3Cls}>1.2 Reserved / Pre-ordered Fish</h3>
        <ul className="mb-4 ml-5 list-disc space-y-1 text-ink/75">
          <li>Fish reserved via WhatsApp, phone, or our website must be collected within <strong>48 hours</strong> of the agreed pickup date unless otherwise arranged.</li>
          <li>If you are unable to collect, please contact us — we may extend the hold at our discretion.</li>
          <li>If a reserved fish falls ill or dies while in our care before pickup, we will offer a full refund or a replacement of equal value.</li>
        </ul>

        <h3 className={h3Cls}>1.3 Fish Health Guarantee</h3>
        <ul className="mb-4 ml-5 list-disc space-y-1 text-ink/75">
          <li>We guarantee that all fish sold are healthy and active at the time of sale.</li>
          <li>If a fish shows signs of illness within <strong>24 hours</strong> of purchase (and has been kept in appropriate conditions), contact us immediately. We will assess the situation and may offer a replacement or store credit at our discretion.</li>
          <li>This guarantee does not cover fish that die due to incompatible tank mates, improper water parameters, overfeeding, or lack of acclimatisation.</li>
        </ul>

        <h2 className={h2Cls}>2. Products & Accessories — Return Policy</h2>
        <ul className="mb-4 ml-5 list-disc space-y-1 text-ink/75">
          <li>Non-live products (tanks, filters, food, decor, etc.) may be returned within <strong>7 days</strong> of purchase if they are <strong>unused, undamaged, and in original packaging</strong>.</li>
          <li>Returns require the original purchase receipt or proof of purchase.</li>
          <li>Refunds for eligible returns will be processed to the original payment method within 7 working days.</li>
          <li>Items that have been used, installed, or are missing packaging/components are not eligible for return.</li>
        </ul>

        <h2 className={h2Cls}>3. Damaged or Defective Products</h2>
        <ul className="mb-4 ml-5 list-disc space-y-1 text-ink/75">
          <li>If you receive a damaged or defective product (e.g., a cracked tank, non-functioning filter), please inform us <strong>immediately</strong> — ideally at the time of pickup or within 24 hours of delivery.</li>
          <li>We will replace the item at no additional cost or offer a full refund.</li>
          <li>Please retain the damaged item and packaging for inspection.</li>
        </ul>

        <h2 className={h2Cls}>4. Order Cancellation</h2>
        <ul className="mb-4 ml-5 list-disc space-y-1 text-ink/75">
          <li>Orders for products/accessories can be cancelled <strong>before dispatch or pickup</strong> for a full refund.</li>
          <li>Once an order has been dispatched or collected, the standard return policy (Section 2) applies.</li>
          <li>For reserved fish, cancellations made at least 24 hours before the agreed pickup date will receive a full refund. Late cancellations may be subject to a partial deduction at our discretion.</li>
        </ul>

        <h2 className={h2Cls}>5. Delivery & Shipping</h2>
        <ul className="mb-4 ml-5 list-disc space-y-1 text-ink/75">
          <li>We are primarily an <strong>in-store pickup</strong> business. Most customers visit our Kuthuparamba store to select and collect their fish and products in person.</li>
          <li>For nearby areas (Kuthuparamba, Kannur, Thalassery, Mattannur and surrounding regions), we may arrange <strong>local delivery</strong> at an additional charge. Delivery feasibility and cost will be confirmed when you place your order.</li>
          <li>We currently <strong>do not ship live fish</strong> via courier or postal services.</li>
          <li>Non-live products may be shipped within Kerala on a case-by-case basis. Please enquire via WhatsApp or phone.</li>
        </ul>

        <h2 className={h2Cls}>6. Contact for Returns & Refunds</h2>
        <p className={pCls}>
          For any return, refund, or cancellation request, please contact us:
        </p>
        <p className={`${pCls} mt-2`}>
          <strong>Happy Aquarium</strong><br />
          Near Eye Hospital, Kuthuparamba, Kannur &mdash; Kerala 670643<br />
          Phone / WhatsApp:{' '}
          <a href="tel:+919****0808" className="text-clay underline">+91 99477 70808</a><br />
          Email:{' '}
          <a href="mailto:hello@happyaquarium.in" className="text-clay underline">hello@happyaquarium.in</a>
        </p>
      </Container>
    </>
  );
}
