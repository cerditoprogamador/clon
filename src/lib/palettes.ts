// Six-stop gradient palettes for the Grainient background.
// Each palette runs dark → light so the shader ramp has depth, and the three
// families are intentionally distinct (warm / cool / vibrant) so a random pick
// always reads as a different mood.

export type Palette = [string, string, string, string, string, string];

export const PALETTES: { name: string; colors: Palette }[] = [
  {
    name: "magma", // warm — black → red → orange → amber (lava)
    colors: ["#0a0204", "#5c0f12", "#b3201a", "#f0501e", "#ff8a2b", "#ffd166"],
  },
  {
    name: "dusk", // twilight — midnight → indigo → violet → lilac → soft pink (morada)
    colors: ["#0a0418", "#2b0f5e", "#5b2bb0", "#9b59e0", "#d98cd9", "#ffd4e6"],
  },
  {
    name: "saigon", // dark olive-gold — black → olive → bronze → gold → cream
    colors: ["#050604", "#1a2310", "#3d3a1c", "#7a6228", "#b89048", "#e6d29a"],
  },
  {
    name: "bloom", // vibrant multicolour — lime → periwinkle → violet → pink → coral
    colors: ["#dce85a", "#aab6ee", "#6e7ce8", "#bd7ee2", "#ff72be", "#ff5f48"],
  },
  {
    name: "daydream", // soft pastel — teal → rose → yellow → orange → coral → blush
    colors: ["#a9c6bd", "#f2c2b4", "#f6cf5a", "#ee8233", "#f0a08d", "#f2ab9d"],
  },
  {
    name: "azure", // cobalt + warm accents — deep blue → sky → cream → orange
    colors: ["#0a3aa0", "#1f6fd8", "#5bbef0", "#eef4ee", "#ff8a3d", "#ffb877"],
  },
];

const rand = (n: number) => Math.floor(Math.random() * n);

// Module-level singleton: chosen once per page load, shared across client-side
// navigation between / and /work. A hard reload re-runs the module → new pick.
let homeIndex: number | null = null;
let workIndex: number | null = null;

function ensureHome() {
  if (homeIndex === null) homeIndex = rand(PALETTES.length);
  return homeIndex;
}

/** Random palette for the home page, fixed for this page load. */
export function getHomePalette(): Palette {
  return PALETTES[ensureHome()].colors;
}

/** A palette guaranteed to differ from the home page's. */
export function getWorkPalette(): Palette {
  const home = ensureHome();
  if (workIndex === null) {
    const others = PALETTES.map((_, i) => i).filter((i) => i !== home);
    workIndex = others[rand(others.length)];
  }
  return PALETTES[workIndex].colors;
}
