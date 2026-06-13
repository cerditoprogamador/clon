"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import Grainient from "@/components/home/Grainient";
import { getWorkPalette } from "@/lib/palettes";

const lineVariants = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: "0%",
    transition: {
      duration: 1,
      delay: 0.25 + i * 0.09,
      ease: [0.16, 0.84, 0.44, 1] as [number, number, number, number],
    },
  }),
};

export default function WorkHero() {
  const posRef = useRef<[number, number]>([0, 0]);
  // Palette guaranteed to differ from the home page's pick.
  const [colors] = useState(getWorkPalette);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    posRef.current = [
      ((e.clientX - rect.left) / rect.width  - 0.5) * 0.56,
      ((e.clientY - rect.top)  / rect.height - 0.5) * 0.56,
    ];
  };

  return (
    <section className="w-hero" onMouseMove={handleMouseMove}>
      <Grainient
        className="w-hero__bg"
        posRef={posRef}
        colors={colors}
        warpStrength={1.1}
        warpFrequency={4.2}
        warpSpeed={1.6}
        warpAmplitude={60}
        contrast={1.55}
        grainAmount={0.08}
        zoom={0.88}
      />

      <div className="w-container w-hero__inner">
        <h1 className="w-hero__title">
          <span className="w-line">
            <motion.span
              className="w-line__in"
              custom={0}
              variants={lineVariants}
              initial="hidden"
              animate="show"
            >
              We choose a
            </motion.span>
          </span>
          <span className="w-line">
            <motion.span
              className="w-line__in"
              custom={1}
              variants={lineVariants}
              initial="hidden"
              animate="show"
            >
              d<em>i</em>fferent <span className="w-hero__arrow">→</span>
            </motion.span>
          </span>
          <span className="w-line">
            <motion.span
              className="w-line__in"
              custom={2}
              variants={lineVariants}
              initial="hidden"
              animate="show"
            >
              start<em>i</em>ng point
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="w-hero__lede"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.9 }}
        >
          Every project is a chance to try something new. Look at something with
          a fresh perspective. Do something for the first time.
        </motion.p>
      </div>

      <motion.button
        type="button"
        className="w-hero__scroll"
        aria-label="Scroll to work"
        onClick={() =>
          document
            .getElementById("work")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.1 }}
      >
        <span className="w-hero__scroll-line" />
        <span className="w-hero__scroll-arrow">↓</span>
      </motion.button>
    </section>
  );
}
