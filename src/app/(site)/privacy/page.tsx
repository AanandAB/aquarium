import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Privacy Policy · Happy Aquarium",
  description: "How Happy Aquarium collects, uses and protects your personal information.",
};

const h2Cls = "mt-10 mb-4 font-display text-xl font-semibold text-ink";
const pCls = "mb-3 leading-relaxed text-ink/75";

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="How we collect, use and protect your personal information."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />
      <Container className="prose-custom pb-20">
        <p className={pCls}>
          <strong>Last updated:</strong> July 2026
        </p>

        <p className={pCls}>
          Happy Aquarium (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates the website{' '}
          <strong>happyaquarium.in</strong> and its associated services. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you visit our website or contact us
          through WhatsApp, phone, or our enquiry forms.
        </p>

        <p className={pCls}>
          By using our website, you consent to the data practices described in this policy. If you do not
          agree, please discontinue use of our site.
        </p>

        <h2 className={h2Cls}>1. Information We Collect</h2>

        <p className={pCls}>
          <strong>Personal Information:</strong> When you fill out our enquiry or contact form, place a
          WhatsApp order, or email us, we may collect:
        </p>
        <ul className="mb-4 ml-5 list-disc space-y-1 text-ink/75">
          <li>Your name</li>
          <li>Phone number / WhatsApp number</li>
          <li>Email address</li>
          <li>Any other information you voluntarily provide in your message (e.g., fish preferences, tank specifications, delivery address)</li>
        </ul>

        <p className={pCls}>
          <strong>Automatically Collected Information:</strong> Like most websites, we may automatically
          collect certain information when you visit, including:
        </p>
        <ul className="mb-4 ml-5 list-disc space-y-1 text-ink/75">
          <li>IP address and browser type</li>
          <li>Pages visited and time spent on the site</li>
          <li>Referring website or search term</li>
        </ul>
        <p className={pCls}>
          This information is anonymized and helps us understand how visitors use our site.
        </p>

        <h2 className={h2Cls}>2. How We Use Your Information</h2>
        <p className={pCls}>We use the information we collect for the following purposes:</p>
        <ul className="mb-4 ml-5 list-disc space-y-1 text-ink/75">
          <li>To respond to your enquiries, orders, and requests</li>
          <li>To provide quotes, product availability, and pricing information via WhatsApp or phone</li>
          <li>To improve our website, product listings, and customer experience</li>
          <li>To communicate with you about your orders, new arrivals, or offers (only if you have opted in)</li>
        </ul>

        <h2 className={h2Cls}>3. How We Share Your Information</h2>
        <p className={pCls}>
          We do <strong>not</strong> sell, trade, or rent your personal information to third parties.
          We may share information only in the following circumstances:
        </p>
        <ul className="mb-4 ml-5 list-disc space-y-1 text-ink/75">
          <li><strong>WhatsApp / messaging:</strong> When you message us, your conversation and phone number are processed by WhatsApp (Meta Platforms, Inc.). Please refer to{' '}
            <a href="https://www.whatsapp.com/legal/privacy-policy" className="text-clay underline" target="_blank" rel="noopener noreferrer">
              WhatsApp&apos;s Privacy Policy
            </a>.
          </li>
          <li><strong>Service providers:</strong> We may use third-party services to host our website (Cloudflare), analyze traffic (Google Analytics), or display maps (Google Maps). These providers have their own privacy policies.</li>
          <li><strong>Legal requirements:</strong> If required by law, court order, or governmental regulation.</li>
        </ul>

        <h2 className={h2Cls}>4. Cookies</h2>
        <p className={pCls}>
          Our website may use cookies — small text files placed on your device — to enhance your browsing
          experience and collect analytics. You can disable cookies in your browser settings, though some
          features of the site may not function properly.
        </p>

        <h2 className={h2Cls}>5. Data Security</h2>
        <p className={pCls}>
          We take reasonable security measures to protect your personal information from unauthorized access,
          alteration, or disclosure. However, no method of transmission over the Internet or electronic
          storage is 100% secure. We cannot guarantee absolute security.
        </p>

        <h2 className={h2Cls}>6. Third-Party Links</h2>
        <p className={pCls}>
          Our website may contain links to third-party websites (e.g., Instagram, Google Maps, suppliers).
          We are not responsible for the privacy practices or content of those sites. Please review their
          respective privacy policies.
        </p>

        <h2 className={h2Cls}>7. Your Rights</h2>
        <p className={pCls}>
          Under Indian law, you have the right to:
        </p>
        <ul className="mb-4 ml-5 list-disc space-y-1 text-ink/75">
          <li>Request access to the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data (subject to any legal obligations we may have to retain it)</li>
          <li>Withdraw consent for marketing communications</li>
        </ul>
        <p className={pCls}>
          To exercise any of these rights, please contact us using the details below.
        </p>

        <h2 className={h2Cls}>8. Grievance Officer</h2>
        <p className={pCls}>
          In accordance with the Information Technology Act 2000 and the Digital Personal Data
          Protection Act 2023, any grievances, complaints, or concerns regarding the processing of
          your personal data may be addressed to our designated Grievance Officer:
        </p>
        <p className={`${pCls} mt-2`}>
          <strong>Name:</strong> Aanand AB<br />
          <strong>Phone:</strong>{' '}
          <a href="tel:+919****0808" className="text-clay underline">+91 99477 70808</a><br />
          <strong>Email:</strong>{' '}
          <a href="mailto:hello@happyaquarium.in" className="text-clay underline">hello@happyaquarium.in</a><br />
          <strong>Address:</strong> Happy Aquarium, Near Eye Hospital, Kuthuparamba, Kannur, Kerala — 670643
        </p>
        <p className={pCls}>
          We will acknowledge your complaint within 48 hours and aim to resolve it within 15 working days.
        </p>

        <h2 className={h2Cls}>9. Children&apos;s Privacy</h2>
        <p className={pCls}>
          Our website is not directed at children under the age of 13. We do not knowingly collect personal
          information from children. If you believe we have inadvertently collected such information, please
          contact us so we can delete it.
        </p>

        <h2 className={h2Cls}>10. Changes to This Policy</h2>
        <p className={pCls}>
          We may update this Privacy Policy from time to time. Changes will be posted on this page with an
          updated &ldquo;Last updated&rdquo; date. We encourage you to review this policy periodically.
        </p>

        <h2 className={h2Cls}>11. Contact Us</h2>
        <p className={pCls}>
          If you have any questions about this Privacy Policy or our data practices, please contact us:
        </p>
        <p className={`${pCls} mt-2`}>
          <strong>Happy Aquarium</strong><br />
          Near Eye Hospital, Kuthuparamba, Kannur &mdash; Kerala 670643<br />
          Phone / WhatsApp:{' '}
          <a href="tel:+919947770808" className="text-clay underline">+91 99477 70808</a><br />
          Email:{' '}
          <a href="mailto:hello@happyaquarium.in" className="text-clay underline">hello@happyaquarium.in</a>
        </p>
      </Container>
    </>
  );
}
