"use client";

import { Circles } from "./Marks";

const SOCIALS = [
  ["Fb", "https://facebook.com"],
  ["Tw", "https://twitter.com"],
  ["Ig", "https://instagram.com"],
  ["Li", "https://linkedin.com"],
];

const NAV = [
  { label: "Home",           href: "/" },
  { label: "Work",           href: "/work" },
  { label: "About me",       href: "/about" },
  { label: "Contact",        href: "/contact" },
  { label: "Privacy policy", href: "#" },
];

export default function Footer() {
  return (
    <footer id="footer" className="w-footer">
      <div className="w-container w-footer__inner">
        <div className="w-footer__head">
          <Circles className="w-footer__circles" />
          <h2 className="w-footer__title">We would love to hear from you.</h2>
        </div>

        <div className="w-footer__grid">
          <div className="w-footer__col w-footer__col--contact">
            <p className="w-footer__gray">
              Feel free to reach out if you want to collaborate, or simply have a chat.
            </p>
            <a href="mailto:ginolocate983@gmail.com" className="w-footer__email">
              ginolocate983@gmail.com <span className="w-footer__email-arrow">→</span>
            </a>
          </div>

          <div className="w-footer__col">
            <h4 className="w-footer__sub">Based in</h4>
            <address className="w-footer__gray w-footer__address">
              Buenos Aires
              <br />
              Argentina
              <br />
              <br />
              Available worldwide
            </address>
          </div>

          <div className="w-footer__col">
            <h4 className="w-footer__sub">Follow</h4>
            <ul className="w-footer__socials">
              {SOCIALS.map(([label, href]) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-footer__col">
            <ul className="w-footer__nav">
              {NAV.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="w-footer__navlink">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-footer__foot">
          <span className="w-footer__copy">
            © Gino {new Date().getFullYear()} — All rights reserved.
          </span>
          <button
            type="button"
            className="w-footer__top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
