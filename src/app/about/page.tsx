import SiteShell from "@/components/site/SiteShell";
import AboutHero from "@/components/about/AboutHero";
import AboutContent from "@/components/about/AboutContent";

export default function AboutPage() {
  return (
    <SiteShell minimalHeader>
      <AboutHero />
      <AboutContent />
    </SiteShell>
  );
}
