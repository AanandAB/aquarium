import LenisProvider from "@/components/providers/LenisProvider";
import OceanBackground from "@/components/effects/OceanBackground";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import CookieBanner from "@/components/layout/CookieBanner";
import { getSiteSettings, getNav } from "@/lib/queries";
import { SITE } from "@/lib/site";

const FALLBACK_NAV = [
  { label: "Fish", url: "/fish" },
  { label: "Accessories", url: "/accessories" },
  { label: "Planner", url: "/planner" },
  { label: "Compatibility", url: "/compatibility" },
  { label: "Gallery", url: "/gallery" },
  { label: "Blog", url: "/blog" },
  { label: "Contact", url: "/contact" },
];

async function loadChrome() {
  try {
    const [settings, headerNav, footerNav] = await Promise.all([
      getSiteSettings(),
      getNav("header"),
      getNav("footer"),
    ]);
    return { settings, headerNav, footerNav };
  } catch {
    return { settings: null, headerNav: [], footerNav: [] };
  }
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings, headerNav, footerNav } = await loadChrome();
  const storeName = settings?.storeName ?? SITE.name;
  const phone = settings?.phone ?? SITE.phone;
  const whatsapp = settings?.whatsapp ?? SITE.whatsapp;
  const headerLinks =
    headerNav.length > 0
      ? headerNav.map((n) => ({ label: n.label, url: n.url }))
      : FALLBACK_NAV;
  const footerLinks =
    footerNav.length > 0
      ? footerNav.map((n) => ({ label: n.label, url: n.url }))
      : FALLBACK_NAV;

  return (
    <>
      <OceanBackground />
      <LenisProvider>
        <Header nav={headerLinks} storeName={storeName} phone={phone} />
        <main className="min-h-screen">{children}</main>
        <Footer
          storeName={storeName}
          tagline={settings?.tagline ?? SITE.tagline}
          phone={phone}
          whatsapp={whatsapp}
          email={settings?.email ?? SITE.email}
          addressLine={settings?.addressLine ?? SITE.addressLine}
          area={settings?.area ?? SITE.area}
          city={settings?.city ?? SITE.city}
          state={settings?.state ?? SITE.state}
          socials={settings?.socials ?? null}
          nav={footerLinks}
        />
      </LenisProvider>
      <FloatingActions phone={phone} whatsapp={whatsapp} />
      <CookieBanner />
    </>
  );
}
