"use client";

import { useRef, useEffect } from "react";
import { motion } from "motion/react";
import Grainient from "@/components/home/Grainient";
import { usePalette } from "@/components/home/PaletteProvider";
import { getHomePalette } from "@/lib/palettes";

type Hole = {
  xr: number; yr: number;
  r: number;
  vx: number; vy: number;
  phase: number; spd: number;
};

const HOLES: Hole[] = [
  { xr: 0.22, yr: 0.30, r: 230, vx:  0.00025, vy:  0.00015, phase: 0,             spd: 0.007 },
  { xr: 0.75, yr: 0.62, r: 210, vx: -0.00018, vy:  0.00022, phase: Math.PI,       spd: 0.006 },
  { xr: 0.55, yr: 0.22, r: 140, vx:  0.00032, vy: -0.00025, phase: Math.PI / 3,   spd: 0.009 },
  { xr: 0.12, yr: 0.72, r: 120, vx: -0.00027, vy:  0.00018, phase: Math.PI * 1.5, spd: 0.010 },
  { xr: 0.88, yr: 0.38, r: 160, vx:  0.00020, vy:  0.00035, phase: Math.PI * 0.7, spd: 0.008 },
  { xr: 0.42, yr: 0.82, r: 75,  vx: -0.00040, vy: -0.00028, phase: Math.PI * 1.2, spd: 0.013 },
  { xr: 0.92, yr: 0.14, r: 85,  vx:  0.00028, vy:  0.00042, phase: Math.PI * 0.4, spd: 0.011 },
  { xr: 0.62, yr: 0.50, r: 100, vx: -0.00015, vy: -0.00032, phase: Math.PI * 1.8, spd: 0.009 },
];

export default function AboutReveal() {
  const mousePosRef = useRef<[number, number]>([0, 0]);
  const paletteColors = usePalette();
  // Use the home palette immediately so the section mounts on the first render
  // (usePalette() is null for one tick while PaletteProvider's useEffect runs)
  const colors = paletteColors ?? getHomePalette();

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const holesRef   = useRef<Hole[]>(HOLES.map(h => ({ ...h })));

  useEffect(() => {
    const section = sectionRef.current;
    const canvas  = canvasRef.current;
    if (!section || !canvas) return;

    const dpr = window.devicePixelRatio || 1;
    let stopped = false;
    let rafId   = 0;

    function resize() {
      if (!canvas || !section) return;
      const w = section.offsetWidth;
      const h = section.offsetHeight;
      if (!w || !h) return;
      canvas.width  = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }

    function draw() {
      if (stopped || !canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = canvas.width;
      const H = canvas.height;
      if (!W || !H) { rafId = requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = "destination-out";

      for (const h of holesRef.current) {
        h.xr    += h.vx;
        h.yr    += h.vy;
        h.phase += h.spd;

        if (h.xr < -0.25) h.xr = 1.25;
        if (h.xr >  1.25) h.xr = -0.25;
        if (h.yr < -0.25) h.yr = 1.25;
        if (h.yr >  1.25) h.yr = -0.25;

        const cx = h.xr * W;
        const cy = h.yr * H;
        const radius = h.r * dpr * (1 + Math.sin(h.phase) * 0.15);

        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        g.addColorStop(0,    "rgba(0,0,0,1)");
        g.addColorStop(0.55, "rgba(0,0,0,0.97)");
        g.addColorStop(0.80, "rgba(0,0,0,0.55)");
        g.addColorStop(1,    "rgba(0,0,0,0)");

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      rafId = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (!rafId) rafId = requestAnimationFrame(draw);
    });
    ro.observe(section);

    return () => {
      stopped = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []); // runs once — colors is stable (same module singleton)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mousePosRef.current = [
      ((e.clientX - r.left) / r.width  - 0.5) * 0.56,
      ((e.clientY - r.top)  / r.height - 0.5) * 0.56,
    ];
  };

  return (
    <section
      ref={sectionRef}
      className="about-reveal"
      onMouseMove={handleMouseMove}
    >
      {/* Layer 0 — gradient (home palette) */}
      <Grainient
        className="about-reveal__bg"
        posRef={mousePosRef}
        colors={colors}
        warpStrength={1.1}
        warpFrequency={4.0}
        warpSpeed={1.5}
        warpAmplitude={60}
        contrast={1.55}
        grainAmount={0.08}
        zoom={0.88}
      />

      {/* Layer 1 — white canvas, holes reveal gradient */}
      <canvas ref={canvasRef} className="about-reveal__mask" aria-hidden />

      {/* Layer 2 — scroll hint */}
      <motion.div
        className="about-reveal__hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
      >
        <span className="about-reveal__hint-line" />
        <span className="about-reveal__hint-arrow">↓</span>
      </motion.div>
    </section>
  );
}
