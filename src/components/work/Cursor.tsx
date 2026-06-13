"use client";

import { createContext, useContext } from "react";

type CursorMode = "default" | "project" | "discover" | "prev" | "next";

const Ctx = createContext({ setCursor: (_m: CursorMode, _l?: string) => {} });

export function useCursor() {
  return useContext(Ctx);
}

export function useCursorHover(_mode: CursorMode, _label?: string) {
  return {};
}

export function CursorProvider({ children }: { children: React.ReactNode }) {
  return <Ctx.Provider value={{ setCursor: () => {} }}>{children}</Ctx.Provider>;
}
