import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Terms of Use · Happy Aquarium",
  description: "Terms and conditions for using the Happy Aquarium website.",
};

const h2Cls = "mt-10 mb-4 font-display text-xl font-semibold text-ink";
const pCls = "mb-3 leading-relaxed text-ink/75";

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        subtitle="Please read these terms carefully before using our website."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Terms of Use" }]}
      />
      <Container className="prose-custom pb-20">
        <p className={pCls}>
          <strong>Last updated:</strong> July 2026
        </p>

        <p className={pCls}>
          Welcome to <strong>Happy Aquarium</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;).
          By accessing or using our website <strong>happyaquarium.in</strong> and any related services
          (collectively, the &ldquo;Site&rdquo;), you agree to be bound by these Terms of Use
          (&ldquo;Terms&rdquo;). If you do not agree, please do not use the Site.
        </p>

        <h2 className={h2Cls}>1. About Happy Aquarium</h2>
        <p className={pCls}>
          Happy Aquarium is a premium aquarium and fish store located in Kuthuparamba, Kerala, India. We
          sell live aquarium fish, imported species, tanks, plants, accessories, and offer aquarium setup
          and maintenance services. All transactions are fulfilled in-store or via phone/WhatsApp
          coordination — our website serves as a catalogue and enquiry platform.
        </p>

        <h2 className={h2Cls}>2. Use of the Site</h2>
        <p className={pCls}>
          You agree to use the Site only for lawful purposes and in a manner that does not infringe the
          rights of, restrict, or inhibit anyone else&apos;s use of the Site. Prohibited behaviour includes:
        </p>
        <ul className="mb-4 ml-5 list-disc space-y-1 text-ink/75">
          <li>Using the Site to transmit any unlawful, harassing, defamatory, or obscene material</li>
          <li>Attempting to gain unauthorized access to our systems or data</li>
          <li>Using automated scripts, bots, or scrapers to extract data from the Site without permission</li>
          <li>Misrepresenting your identity or affiliation</li>
        </ul>

        <h2 className={h2Cls}>3. Intellectual Property</h2>
        <p className={pCls}>
          All content on this Site — including text, images, photographs, fish descriptions, logos, design
          elements, and the website layout — is owned by or licensed to Happy Aquarium and is protected by
          Indian copyright and intellectual property laws.
        </p>
        <p className={pCls}>
          You may view and print pages from the Site for your personal, non-commercial use. You may not:
        </p>
        <ul className="mb-4 ml-5 list-disc space-y-1 text-ink/75">
          <li>Reproduce, duplicate, copy, or republish any material without our prior written consent</li>
          <li>Use our images or descriptions for any commercial purpose, including listing on other marketplaces</li>
          <li>Modify or create derivative works from any content on the Site</li>
        </ul>

        <h2 className={h2Cls}>4. Product Information & Pricing</h2>
        <p className={pCls}>
          We make every effort to display accurate and up-to-date information about our fish, products, and
          prices. However:
        </p>
        <ul className="mb-4 ml-5 list-disc space-y-1 text-ink/75">
          <li>Live fish prices and availability may change frequently based on stock, season, and supplier costs.</li>
          <li>Images are for illustration purposes — actual fish colouration, size, and markings may vary.</li>
          <li>Prices displayed are in Indian Rupees (₹) and may not include delivery charges.</li>
          <li>We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice.</li>
        </ul>

        <h2 className={h2Cls}>5. Orders & Reservations</h2>
        <p className={pCls}>
          Our website allows you to browse our collection and initiate contact via WhatsApp, phone, or enquiry
          form. Placing a reservation or enquiry does not constitute a binding sale contract. All sales are
          finalized in-store or through direct communication with our staff. We reserve the right to refuse
          or cancel any order at our discretion.
        </p>

        <h2 className={h2Cls}>6. Third-Party Links & Services</h2>
        <p className={pCls}>
          The Site may contain links to third-party websites or services (e.g., WhatsApp, Google Maps,
          Instagram, payment providers). These links are provided for your convenience. We do not endorse or
          assume responsibility for the content, privacy policies, or practices of any third-party sites.
        </p>

        <h2 className={h2Cls}>7. Disclaimer of Warranties</h2>
        <p className={pCls}>
          The Site is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. To the
          fullest extent permitted by law, Happy Aquarium disclaims all warranties, express or implied,
          including but not limited to:
        </p>
        <ul className="mb-4 ml-5 list-disc space-y-1 text-ink/75">
          <li>The accuracy, completeness, or reliability of any content</li>
          <li>That the Site will be available uninterrupted, secure, or error-free</li>
          <li>That any defects or errors will be corrected</li>
        </ul>

        <h2 className={h2Cls}>8. Limitation of Liability</h2>
        <p className={pCls}>
          To the maximum extent permitted by applicable law, Happy Aquarium, its owners, employees, and
          affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive
          damages arising out of your use of, or inability to use, the Site. This includes, without
          limitation, damages for loss of profits, data, or goodwill.
        </p>
        <p className={pCls}>
          Because live animals are involved, we also cannot be held liable for any loss of fish after sale
          due to improper care, water conditions, or incompatible tank mates once the fish leaves our store.
          We provide care guidance for every species — please follow it.
        </p>

        <h2 className={h2Cls}>9. Indemnification</h2>
        <p className={pCls}>
          You agree to indemnify and hold harmless Happy Aquarium, its owners, and employees from any claims,
          damages, or expenses (including legal fees) arising from your use of the Site or violation of these
          Terms.
        </p>

        <h2 className={h2Cls}>10. Governing Law</h2>
        <p className={pCls}>
          These Terms shall be governed by and construed in accordance with the laws of India. Any disputes
          arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the
          courts in Kannur, Kerala.
        </p>

        <h2 className={h2Cls}>11. Changes to These Terms</h2>
        <p className={pCls}>
          We reserve the right to modify these Terms at any time. Changes will be effective immediately upon
          posting to this page. Your continued use of the Site after any changes constitutes acceptance of
          the new Terms.
        </p>

        <h2 className={h2Cls}>12. Contact Information</h2>
        <p className={pCls}>
          For any questions about these Terms, please contact us:
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
