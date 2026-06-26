"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { Logo, Circles } from "./Marks";

const ITEMS = [
  { label: "Home",     href: "/" },
  { label: "Work",     href: "/work" },
  { label: "About me", href: "/about" },
  { label: "Contact",  href: "/contact" },
];

const ZONES = [
  { tz: "Europe/London",    label: "LDN" },
  { tz: "Asia/Tokyo",       label: "TYO" },
  { tz: "America/New_York", label: "NYC" },
];

function useClock(tz: string) {
  const [t, setT] = useState("--:-- --");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit", minute: "2-digit", hour12: true, timeZone: tz,
    });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [tz]);
  return t;
}

const panel = { hidden: { y: "-100%" }, show: { y: "0%" } };
const ease  = [0.76, 0, 0.24, 1] as const;

export default function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const t0 = useClock(ZONES[0].tz);
  const t1 = useClock(ZONES[1].tz);
  const t2 = useClock(ZONES[2].tz);
  const times = [t0, t1, t2];

  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.nav
          className="w-menu"
          variants={panel}
          initial="hidden"
          animate="show"
          exit="hidden"
          transition={{ duration: 0.8, ease }}
          aria-label="Menu"
        >
          {/* ── Top bar: logo left · close right ── */}
          <div className="w-menu__topbar w-container">
            <motion.span
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
            >
              <Logo wordmarkOnly className="w-menu__topbar-logo" />
            </motion.span>

            <motion.button
              type="button" className="w-menu__close" onClick={onClose} aria-label="Close menu"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
            >
              <span className="w-header__menu-label">Close</span>
              <span className="w-burger" data-open="true"><span /><span /><span /></span>
            </motion.button>
          </div>

          {/* ── Mid: circles mark + timezone clocks ── */}
          <motion.div
            className="w-menu__mid w-container"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Circles className="w-menu__circles" />
            <ul className="w-menu__clocks">
              {times.map((t, i) => (
                <li key={ZONES[i].label}>
                  {i === 0 && <span className="w-clock-tri">▸</span>}
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Nav items ── */}
          <ul className="w-menu__list">
            {ITEMS.map(({ label, href }, i) => {
              const active = pathname === href;
              return (
                <motion.li
                  key={label}
                  className="w-menu__item"
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.28 + i * 0.06, duration: 0.55 }}
                >
                  <a
                    href={href}
                    className={`w-menu__link${active ? " is-active" : ""}`}
                    onClick={onClose}
                  >
                    {active && <span className="w-menu__arrow">▶</span>}
                    {label}
                  </a>
                </motion.li>
              );
            })}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
