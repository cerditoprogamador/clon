"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getHomePaletteEntry, type Palette } from "@/lib/palettes";

type PaletteEntry = { name: string; colors: Palette };

const PaletteCtx = createContext<PaletteEntry | null>(null);

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [entry, setEntry] = useState<PaletteEntry | null>(null);

  useEffect(() => {
    setEntry(getHomePaletteEntry());
  }, []);

  return <PaletteCtx.Provider value={entry}>{children}</PaletteCtx.Provider>;
}

export function usePalette(): Palette | null {
  return useContext(PaletteCtx)?.colors ?? null;
}

export function usePaletteName(): string | null {
  return useContext(PaletteCtx)?.name ?? null;
}
