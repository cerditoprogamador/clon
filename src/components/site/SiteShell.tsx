"use client";

import { useState } from "react";
import { CursorProvider } from "@/components/work/Cursor";
import SmoothScroll from "@/components/work/SmoothScroll";
import PageTransition from "@/components/work/PageTransition";
import Header from "@/components/work/Header";
import Menu from "@/components/work/Menu";
import Footer from "@/components/work/Footer";
import { MenuContext } from "@/lib/MenuContext";
import { PaletteProvider } from "@/components/home/PaletteProvider";

export default function SiteShell({
  children,
  minimalHeader = false,
  dark = false,
}: {
  children: React.ReactNode;
  minimalHeader?: boolean;
  dark?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <CursorProvider>
      <SmoothScroll />
      <PageTransition />
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <MenuContext.Provider value={menuOpen}>
        <PaletteProvider>
          <div id="top" className={`w-root${dark ? " w-root--dark" : ""}`}>
            <Header
              minimal={minimalHeader}
              onMenu={() => setMenuOpen((v) => !v)}
              menuOpen={menuOpen}
            />
            <main>{children}</main>
            <Footer />
          </div>
        </PaletteProvider>
      </MenuContext.Provider>
    </CursorProvider>
  );
}
