"use client";

import { createContext, useContext } from "react";

export const MenuContext = createContext(false);
export const useMenuOpen = () => useContext(MenuContext);
