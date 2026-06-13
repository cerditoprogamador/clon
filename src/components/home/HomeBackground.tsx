"use client";

import { useEffect, useRef, useState } from "react";
import Grainient from "./Grainient";
import { getHomePalette } from "@/lib/palettes";

export default function HomeBackground() {
  const posRef = useRef<[number, number]>([0, 0]);
  // Random palette, chosen once on the client for this page load.
  const [colors] = useState(getHomePalette);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      posRef.current = [
        (e.clientX / window.innerWidth  - 0.5) * 0.56,
        (e.clientY / window.innerHeight - 0.5) * 0.56,
      ];
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1 }}>
      <Grainient
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
    </div>
  );
}
