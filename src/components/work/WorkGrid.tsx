"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { filters, projects, type Category } from "@/lib/projects";
type Filter = Category | "All";

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  return (
    <motion.a
      href={`#${project.slug}`}
      className="w-card"
      data-size={project.size}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.8,
        delay: (index % 3) * 0.06,
        ease: [0.16, 0.84, 0.44, 1],
      }}
    >
      <div className="w-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.cover}
          alt={project.title}
          loading="lazy"
          draggable={false}
          className="w-card__img"
        />
        <span className="w-card__year">{project.year}</span>
      </div>
      <div className="w-card__meta">
        <h3 className="w-card__title">{project.title}</h3>
        <ul className="w-card__cats">
          {project.categories.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </motion.a>
  );
}

export default function WorkGrid() {
  const [active, setActive] = useState<Filter>("All");

  const filtered = useMemo(
    () =>
      active === "All"
        ? projects
        : projects.filter((p) => p.categories.includes(active as Category)),
    [active]
  );

  return (
    <section id="work" className="w-work">
      <div className="w-container w-work__inner">
        <aside className="w-filters">
          <div className="w-ruler" aria-hidden>
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={i} className="w-ruler__tick" />
            ))}
            <span
              className="w-ruler__cursor"
              style={{
                transform: `translateY(${
                  filters.findIndex((f) => f.value === active) * 44
                }px)`,
              }}
            />
          </div>
          <ul className="w-filters__list">
            {filters.map((f) => (
              <li key={f.value}>
                <button
                  type="button"
                  className="w-filter"
                  data-active={active === f.value}
                  onClick={() => setActive(f.value)}
                >
                  <span className="w-filter__tri">▸</span>
                  <span className="w-filter__label">{f.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="w-grid">
          <AnimatePresence>
            {filtered.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
