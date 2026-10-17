import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

import { styles } from "../styles";
import { navLinks } from "../constants";
import resume from "/src/AlexanderMaiso_ComputerEngineer_Resume.pdf";
import { logo_white } from "../assets";

// GradientButton for "Download CV"
const GradientButton = ({ onClick, iconPath, label, downloadLink }) => {
  const buttonContent = (
    <span className="flex items-center animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent font-black">
      <svg
        className="fill-current w-4 h-4 mr-2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path d={iconPath} />
      </svg>
      {label}
    </span>
  );

  return downloadLink ? (
    <a href={downloadLink} download>
      <button
        className="abhishek-btn font-medium cursor-pointer border-[1px] animate-[pulseGlow_2.5s_ease-in-out_infinite]"
        onClick={onClick}
      >
        {buttonContent}
      </button>
    </a>
  ) : (
    <button
      onClick={onClick}
      className="abhishek-btn font-medium cursor-pointer border-[1px] animate-[pulseGlow_2.5s_ease-in-out_infinite]"
    >
      {buttonContent}
    </button>
  );
};

// 🔥 Super Saiyan Fire-Like CRUD Button
const CrudButton = ({ onClick }) => (
  <Link to="/login" onClick={onClick}>
    <button className="fire-button">CRUD</button>
  </Link>
);

// 🔥 Matching Blog Button
const BlogsButton = ({ onClick }) => (
  <Link to="/blog" onClick={onClick}>
    <button className="fire-button">Blog</button>
  </Link>
);

// Modern animated burger trigger
const MenuButton = ({ open, onClick }) => (
  <button
    type="button"
    aria-label={open ? "Close menu" : "Open menu"}
    aria-expanded={open}
    onClick={onClick}
    className="relative flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:bg-white/10 active:scale-95"
  >
    <span className="h-[2px] w-5 rounded-full bg-white" />
    <span className="h-[2px] w-5 rounded-full bg-white" />
    <span className="h-[2px] w-3.5 rounded-full bg-gradient-to-r from-teal-400 via-purple-400 to-orange-400" />
  </button>
);

// Modern slide-in drawer menu (portal avoids backdrop-filter containing-block issues)
const MobileMenu = ({ open, onClose, active, setActive }) => {
  useEffect(() => {
    if (!open) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  return createPortal(
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="nav-backdrop"
            className="fixed inset-0 z-[9990] bg-black/75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside
            key="nav-drawer"
            className="fixed right-0 top-0 z-[9991] flex h-screen w-[86%] max-w-sm flex-col overflow-hidden border-l border-white/10 bg-gradient-to-b from-[#111827]/95 via-[#0b1220]/95 to-[#0f172a]/95 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Gradient accent edge */}
            <span className="pointer-events-none absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-teal-500 via-purple-500 to-orange-500" />

            {/* Header + aesthetic close button */}
            <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <img src={logo_white} alt="logo" className="h-10 w-10 object-contain" />
                <span className="text-sm font-bold tracking-wide text-white">
                  Alexander Maiso
                </span>
              </div>
              <button
                type="button"
                aria-label="Close menu"
                onClick={onClose}
                className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 transition-all duration-300 hover:rotate-90 hover:border-teal-400/60 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(45,212,191,0.25)] active:scale-90"
              >
                <span className="absolute h-[2px] w-5 rounded-full bg-white rotate-45" />
                <span className="absolute h-[2px] w-5 rounded-full bg-white -rotate-45" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto px-4 py-5 flex flex-col">
              <p className="px-3 pb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
                Menu
              </p>
              <ul className="flex flex-col gap-1 pb-6">
                {navLinks.map((nav, index) => (
                  <motion.li
                    key={nav.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + index * 0.04, duration: 0.25 }}
                    onClick={() => {
                      setActive(nav.title);
                      onClose();
                    }}
                    className={`group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-white/5 ${
                      active === nav.title ? "bg-white/10" : ""
                    }`}
                  >
                    <span
                      className={`text-[11px] font-bold tabular-nums ${
                        active === nav.title ? "text-teal-400" : "text-secondary"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <a
                      href={`#${nav.id}`}
                      className={`text-[16px] font-medium transition-all duration-200 group-hover:translate-x-1 ${
                        active === nav.title
                          ? "text-white"
                          : "text-secondary group-hover:text-white"
                      }`}
                    >
                      {nav.title}
                    </a>
                    {active === nav.title && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-gradient-to-r from-teal-400 to-orange-400" />
                    )}
                  </motion.li>
                ))}
              </ul>

              {/* Actions — highlighted CTAs */}
              <div className="mt-auto border-t border-white/10 pt-5">
                <p className="pb-3 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
                  Hire me &amp; explore
                </p>

                {/* Resume CTA — glowing gradient pill */}
                <a href={resume} download onClick={() => setActive("")} className="group block">
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 px-4 py-3.5 text-white shadow-lg transition-transform duration-300 group-hover:scale-[1.02] animate-[pulseGlow_2.5s_ease-in-out_infinite]">
                    <svg
                      className="h-4 w-4 fill-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                    </svg>
                    <span className="font-bold tracking-wide">View My Resume</span>
                    <span className="rounded bg-white/25 px-1.5 py-0.5 text-[10px] font-bold">
                      PDF
                    </span>
                  </div>
                  <p className="pt-1.5 text-center text-[11px] text-secondary">
                    See my experience, skills &amp; achievements
                  </p>
                </a>

                {/* CRUD demo + Blog */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:border-white/25">
                    <CrudButton onClick={onClose} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                      Live demo
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:border-white/25">
                    <BlogsButton onClick={onClose} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                      Insights
                    </span>
                  </div>
                </div>
              </div>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
};

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrolled(scrollTop > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 ${
          scrolled ? "backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
          <Link
            to="/"
            className="flex items-center"
            onClick={() => {
              setActive("");
              window.scrollTo(0, 0);
            }}
          >
            <img src={logo_white} alt="logo" className="w-24 h-24 object-contain" />
            <p className="text-white text-[18px] font-bold cursor-pointer flex">
              Alexander Maiso
            </p>
          </Link>

          {/* Desktop Menu */}
          <ul className="list-none hidden lg:flex flex-row items-center gap-10">
            <GradientButton
              downloadLink={resume}
              iconPath="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"
              label="View My Resume"
              onClick={() => setActive("")}
            />

            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`${
                  active === nav.title ? "text-white" : "text-secondary"
                } hover:text-white text-[18px] font-medium cursor-pointer`}
                onClick={() => setActive(nav.title)}
              >
                <a href={`#${nav.id}`}>{nav.title}</a>
              </li>
            ))}

            <CrudButton />
            <BlogsButton />
          </ul>

          {/* Mobile / Tablet trigger */}
          <div className="lg:hidden flex flex-1 justify-end items-center">
            <MenuButton open={toggle} onClick={() => setToggle(!toggle)} />
          </div>
        </div>
      </nav>

      <MobileMenu
        open={toggle}
        onClose={() => setToggle(false)}
        active={active}
        setActive={setActive}
      />
    </>
  );
};

export default Navbar;
