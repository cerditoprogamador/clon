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

export default function AboutHero() {
  const posRef = useRef<[number, number]>([0, 0]);
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
        warpStrength={1.0}
        warpFrequency={3.8}
        warpSpeed={1.4}
        warpAmplitude={55}
        contrast={1.5}
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
              Cre<em>a</em>tive
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
              developer <span className="w-hero__arrow">→</span>
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
              & des<em>i</em>gner
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="w-hero__lede"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.9 }}
        >
          I work at the intersection of aesthetics and engineering — crafting
          digital experiences that feel as good as they look.
        </motion.p>
      </div>
    </section>
  );
}
