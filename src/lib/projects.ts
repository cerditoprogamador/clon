export type Category =
  | "Brand design"
  | "Spatial"
  | "Campaign"
  | "Digital"
  | "Video"
  | "Photography";

export type Project = {
  slug: string;
  title: string;
  client: string;
  categories: Category[];
  /** Tall/short controls the masonry rhythm. */
  size: "tall" | "wide" | "regular";
  cover: string;
  /** Optional looping video shown on hover. */
  video?: string;
  year: string;
};

// The four real monopo.london covers are served from their public Prismic CDN.
// The rest are art-directed stand-ins so the grid reads as a full studio index.
export const projects: Project[] = [
  {
    slug: "nkora-coffee",
    title: "Nkora Coffee — Brand Identity",
    client: "Nkora",
    categories: ["Brand design"],
    size: "wide",
    year: "2025",
    cover:
      "https://images.prismic.io/monopolondon/aNJt_p5xUNkB1Amn_Nkora_Coffee_Branding_Homepage-Cover.jpg?auto=format,compress&rect=0,0,1900,1188&w=1400&h=875",
  },
  {
    slug: "yonex-players-lounge-paris",
    title: "Paris World Championships — Yonex Players Lounge",
    client: "Yonex",
    categories: ["Spatial", "Video", "Photography"],
    size: "tall",
    year: "2025",
    cover:
      "https://images.prismic.io/monopolondon/aMwJU2GNHVfTPXa0_Yonex_Paris-Lounge_pop-up_Homepage_Cover_1900px.jpg?auto=format,compress&rect=0,0,1900,1188&w=1200&h=750",
  },
  {
    slug: "onitsuka-tiger-finish-line-cafe",
    title: "Onitsuka Tiger — Finish Line Cafe Pop-up",
    client: "Onitsuka Tiger",
    categories: ["Spatial"],
    size: "regular",
    year: "2024",
    cover:
      "https://images.prismic.io/monopolondon/aLckPWGNHVfTOiDn_Onitsuka_Tiger_Finish-Line-Cafe_London_pop-up_Homepage_Cover.jpg?auto=format,compress&rect=0,0,1900,1188&w=1200&h=750",
  },
  {
    slug: "outfry-korean-fried-chicken",
    title: "Outfry — Korean Fried Chicken Branding",
    client: "Taster",
    categories: ["Brand design", "Digital"],
    size: "regular",
    year: "2024",
    cover:
      "https://images.prismic.io/monopolondon/Zw7EpYF3NbkBXeiv_OUTFRY_Brand-identity_Homepage_Cover_1900px.jpg?auto=format,compress&rect=0,0,1900,1188&w=1200&h=750",
  },
  {
    slug: "caution-pro-tour",
    title: "Caution — Pro Tour Game Play",
    client: "Caution",
    categories: ["Campaign", "Digital"],
    size: "wide",
    year: "2024",
    cover:
      "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=1400&auto=format&fit=crop",
  },
  {
    slug: "mono-sound-system",
    title: "Mono — Sound System Identity",
    client: "Mono",
    categories: ["Brand design", "Video"],
    size: "tall",
    year: "2023",
    cover:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "atlas-spatial-exhibition",
    title: "Atlas — Spatial Exhibition",
    client: "Atlas",
    categories: ["Spatial", "Photography"],
    size: "regular",
    year: "2023",
    cover:
      "https://images.unsplash.com/photo-1545987796-200677ee1011?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "kaiju-campaign",
    title: "Kaiju — Launch Campaign",
    client: "Kaiju",
    categories: ["Campaign", "Photography"],
    size: "regular",
    year: "2023",
    cover:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop",
  },
];

export const filters: { label: string; value: Category | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Spatial", value: "Spatial" },
  { label: "Campaign", value: "Campaign" },
  { label: "Brand design", value: "Brand design" },
  { label: "Digital", value: "Digital" },
  { label: "Video", value: "Video" },
  { label: "Photography", value: "Photography" },
];
