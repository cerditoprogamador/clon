"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";

const ease = [0.16, 0.84, 0.44, 1] as const;
import { projects } from "@/lib/projects";
const recent = projects.slice(0, 4);

export default function HomeProjects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const idx = Math.min(recent.length - 1, Math.floor(p * recent.length));
    setActive(idx < 0 ? 0 : idx);
  });

  return (
    <section
      id="recent"
      ref={sectionRef}
      className="h-recent"
      style={{ height: `${recent.length * 100}vh` }}
    >
      <div className="h-recent__sticky">
        <div className="w-container h-recent__inner">
          {/* ruler */}
          <div className="h-recent__ruler" aria-hidden>
            {recent.map((_, i) => (
              <span
                key={i}
                className="h-recent__tick"
                data-active={i === active}
              />
            ))}
          </div>

          {/* text column */}
          <div className="h-recent__text">
            <motion.span
              className="h-recent__label"
              initial={{ x: -24, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease }}
            >
              Recent work
            </motion.span>
            <div className="h-recent__titles">
              {recent.map((p, i) => (
                <div
                  key={p.slug}
                  className="h-recent__title-item"
                  data-state={
                    i === active ? "active" : i < active ? "prev" : "next"
                  }
                >
                  <h3 className="h-recent__title">{p.title}</h3>
                  <ul className="h-recent__cats">
                    {p.categories.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* image stage */}
          <a
            href="/work"
            className="h-recent__stage"
            aria-label={recent[active].title}
          >
            {recent.map((p, i) => (
              <motion.div
                key={p.slug}
                className="h-recent__media"
                animate={{
                  opacity: i === active ? 1 : 0,
                  scale: i === active ? 1 : 1.06,
                }}
                transition={{ duration: 0.8, ease: [0.16, 0.84, 0.44, 1] }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover} alt={p.title} draggable={false} />
              </motion.div>
            ))}
          </a>
        </div>

        <a href="/work" className="h-recent__btn t-btn-primary">
          <span>Discover all projects</span>
          <span className="t-btn-primary-arrow">→</span>
        </a>
      </div>
    </section>
  );
}
