"use client";

import { motion } from "motion/react";
import { Circles } from "@/components/work/Marks";
import { INTRO_REVEAL } from "@/lib/intro";

const LINES = ["We are a brand", "of collective", "creativity"];

const FOOT = [
  ["Based in London", "Born in Tokyo"],
  ["Design-driven", "creative agency"],
  ["Branding, digital", "and communications"],
];

const ease = [0.16, 0.84, 0.44, 1] as const;

export default function HomeHero() {
  return (
    <section className="h-hero">
      <div className="h-hero__center">
        <h1 className="h-hero__title">
          {LINES.map((line, i) => (
            <div key={line} className="h-hero__line-wrap">
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
        </h1>
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
