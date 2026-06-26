import SiteShell from "@/components/site/SiteShell";
import ContactHero from "@/components/contact/ContactHero";
import ContactBody from "@/components/contact/ContactBody";

export default function ContactPage() {
  return (
    <SiteShell minimalHeader>
      <ContactHero />
      <ContactBody />
    </SiteShell>
  );
}
