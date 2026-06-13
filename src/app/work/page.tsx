import SiteShell from "@/components/site/SiteShell";
import WorkHero from "@/components/work/WorkHero";
import WorkGrid from "@/components/work/WorkGrid";

export default function WorkPage() {
  return (
    <SiteShell minimalHeader>
      <WorkHero />
      <WorkGrid />
    </SiteShell>
  );
}
