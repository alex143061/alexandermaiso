import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGithub, FiLinkedin, FiInstagram, FiMail, FiChevronDown,
  FiMapPin,
} from "react-icons/fi";
import { logo_white } from "../assets";

const faqs = [
  { q: "Who is Alexander Maiso?", a: "Alexander Maiso, also known as Alex, is a Computer Engineer and Full-Stack Developer from the Philippines specializing in React, Next.js, Laravel, WordPress, IoT, and AI." },
  { q: "What tech stack does Alex use?", a: "React, Next.js, JavaScript, TypeScript, Tailwind CSS, Node.js, Laravel, PHP, Python, MySQL, PostgreSQL, WordPress, WooCommerce, Flutter, ESP32, Arduino, and more." },
  { q: "What projects has Alexander built?", a: "ROADWATCH (IoT pothole detection), an e-commerce platform, Lex Karaoke, WP Leads, multiple WordPress client sites, and a Flutter mobile app thesis." },
  { q: "Is Alexander available for freelance work?", a: "Yes! Alex takes on freelance web development, WordPress, IoT, and mobile app projects. Reach out via email or the contact form." },
  { q: "How can I contact Alexander Maiso?", a: "Email: alexandermaiso99@gmail.com, GitHub: github.com/alex143061, or LinkedIn: linkedin.com/in/alexander-maiso." },
];

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
  { name: "Login", path: "/login" },
  { name: "Register", path: "/register" },
];

const socialLinks = [
  { name: "GitHub", icon: FiGithub, url: "https://github.com/alex143061" },
  { name: "LinkedIn", icon: FiLinkedin, url: "https://www.linkedin.com/in/alexander-maiso/" },
  { name: "Instagram", icon: FiInstagram, url: "https://www.instagram.com/iamaleaxs" },
  { name: "Email", icon: FiMail, url: "mailto:alexandermaiso99@gmail.com" },
];

const Footer = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => setActiveFaq(activeFaq === index ? null : index);
  const scrollToTop = () => {
    const root = document.getElementById("root");
    if (root) {
      root.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <Link to="/" onClick={scrollToTop} className="inline-block mb-5">
              <img
                src={logo_white}
                alt="Alexander Maiso logo"
                className="w-16 h-16 object-contain"
                loading="lazy"
                decoding="async"
                width="64"
                height="64"
              />
            </Link>
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 mb-3">
              Alexander Maiso
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Computer Engineer & Full-Stack Developer building modern web apps, IoT systems, and WordPress solutions from the Philippines.
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
              <FiMapPin size={14} className="text-teal-400" />
              Philippines
            </div>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-teal-500/40 hover:bg-teal-500/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={scrollToTop}
                    className="text-gray-400 text-sm hover:text-teal-400 transition-colors duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-teal-400 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: FAQ */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Frequently Asked Questions</h4>
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div key={index} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    type="button"
                    aria-expanded={activeFaq === index}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-button-${index}`}
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-400"
                  >
                    <span>{faq.q}</span>
                    <FiChevronDown
                      size={16}
                      aria-hidden="true"
                      className={`text-gray-500 transition-transform duration-300 flex-shrink-0 ml-3 ${activeFaq === index ? "rotate-180 text-teal-400" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div
                        id={`faq-panel-${index}`}
                        role="region"
                        aria-labelledby={`faq-button-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="px-4 pb-3 text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
          <p className="text-gray-500 text-sm text-center">
            &copy; {new Date().getFullYear()} <span className="text-white font-semibold">Alexander Maiso</span>. All rights reserved. Built with <span className="text-rose-400">&#9829;</span> and lots of coffee.
          </p>
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-teal-400 hover:border-teal-500/40 hover:bg-teal-500/10 hover:-translate-y-1 transition-all duration-300"
            aria-label="Back to top"
          >
            <FiChevronDown size={18} className="rotate-180" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;