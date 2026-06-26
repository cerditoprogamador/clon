import SiteShell from "@/components/site/SiteShell";
import HomeBackground from "@/components/home/HomeBackground";
import HomeHero from "@/components/home/HomeHero";
import HomeProjects from "@/components/home/HomeProjects";

export default function HomePage() {
  return (
    <SiteShell dark>
      <HomeBackground />
      <HomeHero />
      <HomeProjects />
    </SiteShell>
  );
}
