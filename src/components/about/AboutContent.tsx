"use client";

import { motion } from "motion/react";

const SKILLS = [
  {
    num: "01",
    label: "Brand Identity",
    desc: "Visual systems and storytelling that make brands instantly recognisable.",
  },
  {
    num: "02",
    label: "Web Development",
    desc: "Fast, accessible, pixel-perfect interfaces built for the long term.",
  },
  {
    num: "03",
    label: "Motion Design",
    desc: "Purposeful animation that guides attention and brings interfaces to life.",
  },
  {
    num: "04",
    label: "Creative Direction",
    desc: "Concept to execution — from the first sketch to the final pixel.",
  },
];

const ease = [0.16, 0.84, 0.44, 1] as const;

export default function AboutContent() {
  return (
    <section className="w-about">
      <div className="w-container">

        <motion.p
          className="w-about__statement"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1, ease }}
        >
          "I believe great products start with a clear vision — then obsessive
          attention to detail."
        </motion.p>

        <div className="w-about__skills">
          {SKILLS.map((s, i) => (
            <motion.div
              key={s.num}
              className="w-skill"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.8, delay: i * 0.07, ease }}
            >
              <p className="w-skill__num">{s.num}</p>
              <h3 className="w-skill__label">{s.label}</h3>
              <p className="w-skill__desc">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="w-about__bio"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
        >
          Based in Buenos Aires, Argentina. Available worldwide. I design and
          build digital products for brands that care about craft — from brand
          identity systems to interactive web experiences. Currently open to new
          projects.
        </motion.p>

      </div>
    </section>
  );
}
