import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/primitives";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { getGallery } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Aquarium Gallery",
  description:
    "Browse our gallery of stunning aquascapes, healthy fish and customer tanks set up by Happy Aquarium in Kuthuparamba, Kannur.",
};

export default async function GalleryPage() {
  const items = await getGallery();

  return (
    <>
      <PageHero
        eyebrow="Inspiration"
        title="Aquarium Gallery"
        subtitle="A showcase of vibrant fish, lush aquascapes and customer tanks — get inspired for your own underwater world."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />

      <Container className="pb-20">
        {items.length === 0 ? (
          <div className="rounded-3xl glass p-12 text-center text-ink/75">
            Our gallery is being set up — check back soon.
          </div>
        ) : (
          <GalleryLightbox items={items} />
        )}
      </Container>
    </>
  );
}
