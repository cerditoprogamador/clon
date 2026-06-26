"use client";

import { useState } from "react";
import { motion } from "motion/react";

const ease = [0.16, 0.84, 0.44, 1] as const;

export default function ContactBody() {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent]       = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Project inquiry from ${name}`);
    const body    = encodeURIComponent(
      `Hi,\n\nMy name is ${name} (${email}).\n\n${message}`
    );
    window.location.href =
      `mailto:ginolocate983@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <section className="w-contact">
      <div className="w-container w-contact__inner">

        <motion.a
          href="mailto:ginolocate983@gmail.com"
          className="w-contact__email"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease }}
        >
          ginolocate983@gmail.com <span>→</span>
        </motion.a>

        <div className="w-contact__grid">

          <motion.form
            className="w-contact__form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
          >
            <div className="w-contact__field">
              <label className="w-contact__label" htmlFor="c-name">Name</label>
              <input
                id="c-name"
                type="text"
                className="w-contact__input"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="w-contact__field">
              <label className="w-contact__label" htmlFor="c-email">Email</label>
              <input
                id="c-email"
                type="email"
                className="w-contact__input"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="w-contact__field">
              <label className="w-contact__label" htmlFor="c-message">Message</label>
              <textarea
                id="c-message"
                className="w-contact__input w-contact__textarea"
                placeholder="Tell me about your project..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="w-contact__submit">
              {sent ? "Opening mail client ✓" : "Send message →"}
            </button>
          </motion.form>

          <motion.div
            className="w-contact__info"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
          >
            <div className="w-contact__info-block">
              <h4 className="w-contact__sub">Based in</h4>
              <p className="w-contact__gray">
                Buenos Aires<br />Argentina
              </p>
            </div>
            <div className="w-contact__info-block">
              <h4 className="w-contact__sub">Availability</h4>
              <p className="w-contact__gray">
                Open to new projects<br />Worldwide
              </p>
            </div>
            <div className="w-contact__info-block">
              <h4 className="w-contact__sub">Response time</h4>
              <p className="w-contact__gray">Within 24–48 hours</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
