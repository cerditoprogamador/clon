import SiteShell from "@/components/site/SiteShell";
import { PaletteProvider } from "@/components/home/PaletteProvider";
import HomeBackground from "@/components/home/HomeBackground";
import HomeHero from "@/components/home/HomeHero";
import HomeProjects from "@/components/home/HomeProjects";

export default function HomePage() {
  return (
    <PaletteProvider>
      <SiteShell dark>
        <HomeBackground />
        <HomeHero />
        <HomeProjects />
      </SiteShell>
    </PaletteProvider>
  );
}
