import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/primitives";
import CompatibilityTool from "@/components/tools/CompatibilityTool";
import { getAllFishLite, getCompatibilityPairs } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fish Compatibility Checker",
  description:
    "Select two or more fish to instantly see if they can live together. Our compatibility checker uses expert-curated pairings and smart trait analysis.",
};

export default async function CompatibilityPage() {
  const [fish, pairs] = await Promise.all([
    getAllFishLite(),
    getCompatibilityPairs(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Tool"
        title="Fish Compatibility Checker"
        subtitle="Select two or more fish to see if they can live together."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Compatibility" }]}
      />
      <Container className="pb-20">
        <CompatibilityTool fish={fish} pairs={pairs} />
      </Container>
    </>
  );
}
