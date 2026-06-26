import SiteShell from "@/components/site/SiteShell";
import AboutReveal from "@/components/about/AboutReveal";
import AboutContent from "@/components/about/AboutContent";

export default function AboutPage() {
  return (
    <SiteShell minimalHeader>
      <AboutReveal />
      <AboutContent />
    </SiteShell>
  );
}
