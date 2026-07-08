import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/primitives";
import PlannerTool from "@/components/tools/PlannerTool";
import { getPlannerPresets, getAllFishLite } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Aquarium Planner",
  description:
    "Tell us your tank size, budget and experience level — our aquarium planner suggests a thriving, compatible community of fish that fits your setup.",
};

export default async function PlannerPage() {
  const [presets, fish] = await Promise.all([
    getPlannerPresets(),
    getAllFishLite(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Tool"
        title="Aquarium Planner"
        subtitle="Tell us your tank size, budget and experience — we’ll suggest a thriving community."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Planner" }]}
      />
      <Container className="pb-20">
        <PlannerTool presets={presets} fish={fish} />
      </Container>
    </>
  );
}
