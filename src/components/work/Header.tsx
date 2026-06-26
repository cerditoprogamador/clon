"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Logo } from "./Marks";
import { INTRO_REVEAL } from "@/lib/intro";

function useClock(timeZone: string) {
  const [time, setTime] = useState("--:-- --");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000 * 15);
    return () => clearInterval(id);
  }, [timeZone]);
  return time;
}

const NAV_MAIN = [
  { label: "Home",     href: "/" },
  { label: "Work",     href: "/work" },
  { label: "About me", href: "/about" },
];
const NAV_ALT = [
  { label: "Contact", href: "/contact" },
];

const ease = [0.16, 0.84, 0.44, 1] as const;

export default function Header({
  onMenu,
  menuOpen,
  minimal = false,
}: {
  onMenu: () => void;
  menuOpen: boolean;
  minimal?: boolean;
}) {
  const pathname = usePathname();
  const london = useClock("Europe/London");
  const tokyo  = useClock("Asia/Tokyo");
  const nyc    = useClock("America/New_York");

  return (
    <header className="w--header" data-minimal={minimal}>
      <motion.div
        className="w-container w-header__bar"
        animate={{ opacity: menuOpen ? 0 : 1 }}
        transition={{ duration: 0.35, ease }}
        style={{ pointerEvents: menuOpen ? "none" : "auto" }}
      >
        <motion.a
          href="/"
          className="w-header__logo"
          aria-label="monopo london"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: INTRO_REVEAL + 0.15 }}
        >
          <Logo className="w-header__logo-svg" />
        </motion.a>

        <nav className="w-header__nav" aria-label="Primary">
          <ul>
            {NAV_MAIN.map((l, i) => (
              <motion.li
                key={l.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: INTRO_REVEAL + 0.3 + i * 0.06 }}
              >
                <a
                  href={l.href}
                  className="w-navlink"
                  data-active={pathname === l.href || undefined}
                >
                  {l.label}
                </a>
              </motion.li>
            ))}
          </ul>
          <ul>
            {NAV_ALT.map((l, i) => (
              <motion.li
                key={l.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: INTRO_REVEAL + 0.42 + i * 0.06 }}
              >
                <a href={l.href} className="w-navlink">
                  {l.label}
                </a>
              </motion.li>
            ))}
          </ul>
          <motion.ul
            className="w-header__clocks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: INTRO_REVEAL + 0.6 }}
          >
            <li><span className="w-clock-tri">▸</span> {london}</li>
            <li>{tokyo}</li>
            <li>{nyc}</li>
          </motion.ul>
        </nav>

        <motion.button
          type="button"
          className="w-header__menu"
          onClick={onMenu}
          aria-expanded={menuOpen}
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: INTRO_REVEAL + 0.2 }}
        >
          <span className="w-header__menu-label">
            {menuOpen ? "Close" : "Menu"}
          </span>
          <span className="w-burger" data-open={menuOpen}>
            <span />
            <span />
            <span />
          </span>
        </motion.button>
      </motion.div>
    </header>
  );
}
