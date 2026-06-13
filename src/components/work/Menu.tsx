"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import GlassSurface from "@/components/ui/GlassSurface";
import { Logo } from "./Marks";

const ITEMS = [
  { label: "Home",        href: "/" },
  { label: "Work",        href: "/work" },
  { label: "Services",    href: "#services" },
  { label: "Team",        href: "#team" },
  { label: "Contact",     href: "#contact" },
  { label: "Press & News",href: "#press" },
];

const panel = {
  hidden: { y: "-100%" },
  show: { y: "0%" },
};

export default function Menu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // Close on Escape — the menu button is hidden while the menu is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="w-menu__bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
          />
          <motion.nav
            className="w-menu"
            variants={panel}
            initial="hidden"
            animate="show"
            exit="hidden"
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            aria-label="Menu"
          >
            {/* Centred "monopo" wordmark — sits in front of the glass */}
            <motion.div
              className="w-menu__wordmark"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.6, ease: [0.16, 0.84, 0.44, 1], delay: 0.25 }}
            >
              <Logo wordmarkOnly className="w-menu__wordmark-svg" />
            </motion.div>

            {/* Close button — in front of the glass, where the menu button was */}
            <motion.button
              type="button"
              className="w-menu__close"
              onClick={onClose}
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 0.84, 0.44, 1], delay: 0.3 }}
            >
              <span className="w-header__menu-label">Close</span>
              <span className="w-burger" data-open="true">
                <span />
                <span />
                <span />
              </span>
            </motion.button>

            {/* Frosted glass background — only on the open menu */}
            <GlassSurface
              width="100%"
              height="100%"
              borderRadius={0}
              backgroundOpacity={0.34}
              saturation={1.7}
              distortionScale={-120}
              blur={10}
              greenOffset={8}
              blueOffset={18}
              mixBlendMode="difference"
              className="w-menu__glass"
              style={{ position: "absolute", inset: 0, zIndex: 0 }}
            />

            <ul className="w-container w-menu__list">
              {ITEMS.map(({ label, href }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.6 }}
                >
                  <a href={href} className="w-menu__link" onClick={onClose}>
                    <span className="w-menu__index">0{i + 1}</span>
                    {label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
