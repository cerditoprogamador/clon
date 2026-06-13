"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Logo } from "./Marks";
import { INTRO_REVEAL } from "@/lib/intro";

export default function PageTransition() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), INTRO_REVEAL * 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="w-transition"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 0.84, 0.44, 1] }}
          >
            <Logo className="w-transition__logo" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
