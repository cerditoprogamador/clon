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

export default function ContactHero() {
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
        warpStrength={0.9}
        warpFrequency={3.5}
        warpSpeed={1.2}
        warpAmplitude={50}
        contrast={1.45}
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
              Let's work
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
              together <span className="w-hero__arrow">→</span>
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="w-hero__lede"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.9 }}
        >
          Always open to new projects, collaborations, and interesting
          conversations.
        </motion.p>
      </div>
    </section>
  );
}
