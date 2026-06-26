"use client";

import { useEffect, useRef } from "react";
import { usePalette } from "./PaletteProvider";

const SZ_MIN   = 10;
const SZ_MAX   = 20;
const INTERVAL = 550; // ms between drops

export default function FooterReveal() {
  const colors      = usePalette();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !colors?.length) return;

    const footer = container.closest("footer") as HTMLElement;

    // Y distance from footer top to first content element (Circles / head)
    function getFloor(): number {
      const el =
        (footer.querySelector(".w-footer__circles") ??
         footer.querySelector(".w-footer__head")) as HTMLElement | null;
      if (!el) return 80;
      return el.getBoundingClientRect().top - footer.getBoundingClientRect().top;
    }

    function spawn() {
      const sz    = SZ_MIN + Math.random() * (SZ_MAX - SZ_MIN);
      const r     = sz / 2;
      const x     = 4 + Math.random() * 92;           // % across footer
      const color = colors![Math.floor(Math.random() * colors!.length)];
      const floor = getFloor();

      // Duration scales with distance so all drops arrive at similar speed
      const dur = 700 + (floor / 60) * 300 + Math.random() * 250;

      const el = document.createElement("div");
      el.style.cssText =
        `position:absolute;width:${sz}px;height:${sz}px;border-radius:50%;` +
        `background:${color};left:${x}%;top:0;pointer-events:none;` +
        `transform:translateY(${-sz}px) scaleY(.7) scaleX(1.2);`;
      container.appendChild(el);

      // ── Fall ──────────────────────────────────────────────────────────────
      // Stretch downward as speed builds, squish just before impact
      const fall = el.animate(
        [
          { transform: `translateY(${-sz}px) scaleY(.7) scaleX(1.2)`,       offset: 0    },
          { transform: `translateY(${floor * .6}px) scaleY(1.4) scaleX(.8)`, offset: 0.7  },
          { transform: `translateY(${floor - r}px) scaleY(1.7) scaleX(.7)`,  offset: 0.88 },
          { transform: `translateY(${floor - r}px) scaleY(.5) scaleX(1.4)`,  offset: 0.96 },
          { transform: `translateY(${floor - r}px) scaleY(.5) scaleX(1.4)`,  offset: 1    },
        ],
        { duration: dur, easing: "cubic-bezier(.4,0,.8,.6)", fill: "forwards" }
      );

      // ── Splash ────────────────────────────────────────────────────────────
      // Flatten sideways then fade — drop vanishes on contact
      fall.onfinish = () => {
        el.animate(
          [
            { transform: `translateY(${floor - r}px) scaleX(1.4) scaleY(.5)`, opacity: 1   },
            { transform: `translateY(${floor - r}px) scaleX(4)   scaleY(.15)`, opacity: .5  },
            { transform: `translateY(${floor - r}px) scaleX(6)   scaleY(.05)`, opacity: 0   },
          ],
          { duration: 320, easing: "cubic-bezier(.16,.84,.44,1)", fill: "forwards" }
        ).onfinish = () => el.remove();
      };
    }

    spawn();
    const id = setInterval(spawn, INTERVAL);

    const ro = new ResizeObserver(spawn);
    ro.observe(footer);

    return () => {
      clearInterval(id);
      ro.disconnect();
      [...container.children].forEach(c => (c as HTMLElement).remove());
    };
  }, [colors]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "calc(9vh + 60px)", // tall enough for splash to play out
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
      }}
    />
  );
}
