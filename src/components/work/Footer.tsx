"use client";

import { Circles } from "./Marks";

const SOCIALS = [
  ["Fb", "https://facebook.com"],
  ["Tw", "https://twitter.com"],
  ["Ig", "https://instagram.com"],
  ["Li", "https://linkedin.com"],
];

const NAV = [
  "Home",
  "Work",
  "Services",
  "Team",
  "Contact",
  "Press & News",
  "Privacy policy",
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
              Feel free to reach out if you want to collaborate with us, or
              simply have a chat.
            </p>
            <a href="mailto:contact@monopo.london" className="w-footer__email">
              contact@monopo.london <span className="w-footer__email-arrow">→</span>
            </a>
          </div>

          <div className="w-footer__col">
            <h4 className="w-footer__sub">Our Address</h4>
            <address className="w-footer__gray w-footer__address">
              Unit D104
              <br />
              116 Commercial Street
              <br />
              London, E1 6NF
              <br />
              United Kingdom
              <br />
              <br />
              VAT: 319656475
              <br />
              Company no. 11843590
              <br />
              Registered in England &amp; Wales
            </address>
          </div>

          <div className="w-footer__col">
            <h4 className="w-footer__sub">Follow us</h4>
            <ul className="w-footer__socials">
              {SOCIALS.map(([label, href]) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="w-footer__externals">
              <li>
                <a href="#">↗ Monopo TKY</a>
              </li>
              <li>
                <a href="#">↗ Monopo NYC</a>
              </li>
              <li>
                <a href="#">↗ Powered by Tokyo</a>
              </li>
            </ul>
          </div>

          <div className="w-footer__col">
            <ul className="w-footer__nav">
              {NAV.map((label) => (
                <li key={label}>
                  <a href="#" className="w-footer__navlink">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-footer__foot">
          <span className="w-footer__copy">
            © MONOPO LONDON LTD {new Date().getFullYear()} — Clone study. All
            rights reserved.
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
