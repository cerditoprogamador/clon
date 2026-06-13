import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";

// Closest freely-available match to monopo's Roobert: a geometric grotesque.
const hanken = Hanken_Grotesk({
  variable: "--font-roobert",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "monopo london — Work (clone study)",
  description:
    "Front-end clone study of monopo.london/work — WebGL grain gradient, smooth scroll, custom cursor and project index.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={hanken.variable}>
      <body>{children}</body>
    </html>
  );
}
