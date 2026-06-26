"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Circles } from "@/components/work/Marks";
import { INTRO_REVEAL } from "@/lib/intro";
import { useMenuOpen } from "@/lib/MenuContext";

const LINES = ["We are a brand", "of collective", "creativity"];

// Frosted inverse glass effect — apply as `style` on motion.span to invert
// the animated canvas behind it. Requires .h-hero__center with no z-index.
// const GLASS_INVERT: React.CSSProperties = {
//   backdropFilter: "invert(1) blur(5px)",
//   WebkitBackdropFilter: "invert(1) blur(5px)",
//   color: "rgba(255, 255, 255, 0.92)",
// };

const GLITCH = '!#$%^&[]|/░▒▓@*><_~';
const ASCII_SWAP: Record<string, string> = { ' ': '_', a: '4', e: '3', i: '1', o: '0' };
const toAscii = (ch: string) => ASCII_SWAP[ch.toLowerCase()] ?? ch.toUpperCase();
const ASCII_LINES = LINES.map(l => [...l].map(toAscii).join(''));

const FOOT = [
  ["Based in London", "Born in Tokyo"],
  ["Design-driven", "creative agency"],
  ["Branding, digital", "and communications"],
];

const ease = [0.16, 0.84, 0.44, 1] as const;

export default function HomeHero() {
  const menuOpen = useMenuOpen();
  const [display, setDisplay] = useState(LINES);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const STAGGER = 28;   // ms between each char starting its scramble
    const SCRAMBLE = 3;   // glitch frames per char
    const FRAME = 38;     // ms per frame

    const from = menuOpen ? LINES : ASCII_LINES;
    const to   = menuOpen ? ASCII_LINES : LINES;
    const buf  = from.map(l => [...l]);

    let idx = 0;
    LINES.forEach((line, li) => {
      [...line].forEach((_, ci) => {
        const t0 = idx++ * STAGGER;

        for (let f = 0; f < SCRAMBLE; f++) {
          timers.push(setTimeout(() => {
            buf[li][ci] = GLITCH[Math.floor(Math.random() * GLITCH.length)];
            setDisplay(buf.map(l => l.join('')));
          }, t0 + f * FRAME));
        }

        timers.push(setTimeout(() => {
          buf[li][ci] = to[li][ci];
          setDisplay(buf.map(l => l.join('')));
        }, t0 + SCRAMBLE * FRAME));
      });
    });

    return () => timers.forEach(clearTimeout);
  }, [menuOpen]);

  return (
    <section className="h-hero">
      <div className="h-hero__center">
        <motion.h1
          className="h-hero__title"
          animate={{ opacity: menuOpen ? 0.22 : 1 }}
          transition={{ duration: 0.5, ease: [0.16, 0.84, 0.44, 1] }}
        >
          {display.map((line, i) => (
            <div key={i} className="h-hero__line-wrap">
              <motion.span
                className={`h-hero__line h-hero__line--${i}`}
                initial={{ clipPath: "inset(0 0 110% 0)", y: 18, opacity: 0 }}
                animate={{ clipPath: "inset(0 0 0% 0)",   y: 0,  opacity: 1 }}
                transition={{ duration: 1.05, ease, delay: INTRO_REVEAL + 0.15 + i * 0.14 }}
              >
                {line}
              </motion.span>
            </div>
          ))}
        </motion.h1>
      </div>

      <motion.div
        className="w-container h-hero__foot"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: INTRO_REVEAL + 0.7 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.4, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease, delay: INTRO_REVEAL + 0.85 }}
          style={{ transformOrigin: "left bottom" }}
        >
          <Circles className="h-hero__foot-circles" />
        </motion.div>

        <div className="h-hero__foot-items">
          {FOOT.map(([a, b], i) => (
            <motion.div
              className="h-hero__foot-item"
              key={a}
              initial={{ opacity: 0, filter: "blur(6px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 0.8, ease, delay: INTRO_REVEAL + 0.75 + i * 0.1 }}
            >
              <strong>{a}</strong>
              <span>{b}</span>
            </motion.div>
          ))}
        </div>

        <motion.button
          type="button"
          className="h-hero__scroll"
          aria-label="Scroll down"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: INTRO_REVEAL + 1.1 }}
          onClick={() =>
            document.getElementById("recent")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <span className="h-hero__scroll-line" />
          <span className="h-hero__scroll-arrow">↓</span>
        </motion.button>
      </motion.div>
    </section>
  );
}
