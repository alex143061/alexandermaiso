import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
        className="abhishek-btn font-medium cursor-pointer border-[1px]"
        onClick={onClick}
      >
        {buttonContent}
      </button>
    </a>
  ) : (
    <button
      onClick={onClick}
      className="abhishek-btn font-medium cursor-pointer border-[1px]"
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
    className="relative flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-white/25 hover:bg-white/10 active:scale-95 touch-manipulation"
  >
    <span className="h-[2px] w-5 rounded-full bg-white" />
    <span className="h-[2px] w-5 rounded-full bg-white" />
    <span className="h-[2px] w-3.5 rounded-full bg-gradient-to-r from-teal-400 via-purple-400 to-orange-400" />
  </button>
);

// Modern slide-in drawer menu (portal avoids backdrop-filter containing-block issues)
const MobileMenu = ({ open, onClose, active, setActive, onNavClick }) => {
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
            style={{ pointerEvents: open ? "auto" : "none", touchAction: "none" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside
            key="nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed right-0 top-0 z-[9991] flex h-screen w-[86%] max-w-sm flex-col overflow-hidden border-l border-white/10 bg-gradient-to-b from-[#111827] via-[#0b1220] to-[#0f172a]"
            style={{ pointerEvents: open ? "auto" : "none", willChange: "transform" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Gradient accent edge */}
            <span className="pointer-events-none absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-teal-500 via-purple-500 to-orange-500" />

            {/* Header + aesthetic close button */}
            <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <img
                  src={logo_white}
                  alt=""
                  aria-hidden="true"
                  className="h-10 w-10 object-contain"
                  width="40"
                  height="40"
                />
                <span className="text-sm font-bold tracking-wide text-white">
                  Alexander Maiso
                </span>
              </div>
              <button
                type="button"
                aria-label="Close menu"
                onClick={onClose}
                className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 transition-all duration-300 hover:rotate-90 hover:border-teal-400/60 hover:bg-white/10 active:scale-90 touch-manipulation"
              >
                <span className="absolute h-[2px] w-5 rounded-full bg-white rotate-45" />
                <span className="absolute h-[2px] w-5 rounded-full bg-white -rotate-45" />
              </button>
            </div>

            {/* Drawer content */}
            <nav className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 flex flex-col">
              {/* Showcase CTAs — top of menu so they're visible immediately */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05, duration: 0.2 }}
              >
                <a href={resume} download onClick={() => setActive("")} className="group block">
                  <div className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 text-[#0f172a] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_16px_32px_-12px_rgba(255,255,255,0.3)] active:translate-y-0">
                    <span className="flex items-center gap-2.5">
                      <svg
                        className="h-4 w-4 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                      </svg>
                      <span className="text-sm font-bold tracking-wide">View My Resume</span>
                    </span>
                    <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      PDF
                    </span>
                  </div>
                </a>

                {/* CRUD demo + Blog */}
                <div className="mt-3 grid grid-cols-2 gap-3">
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
              </motion.div>

              {/* Links */}
              <p className="px-3 pb-3 pt-6 text-[11px] font-bold uppercase tracking-[0.3em] text-secondary">
                Menu
              </p>
              <ul className="flex flex-col gap-1 pb-4">
                {navLinks.map((nav, index) => (
                  <motion.li
                    key={nav.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 + index * 0.04, duration: 0.18 }}
                    onClick={() => onNavClick(nav)}
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
                      onClick={(e) => e.preventDefault()}
                      aria-current={active === nav.title ? "true" : undefined}
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

  const closeMenu = useCallback(() => setToggle(false), []);

  const navigate = useNavigate();
  const location = useLocation();

  // Nav links must work from any route: on home we smooth-scroll,
  // from other pages (CRUD / Blog) we return home first, then scroll.
  const goToSection = (nav) => {
    setActive(nav.title);
    closeMenu();
    if (location.pathname === "/") {
      document.getElementById(nav.id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById(nav.id)?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  };

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
          scrolled && !toggle ? "backdrop-blur-sm" : "bg-transparent"
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
            aria-label="Alexander Maiso — home"
          >
            <img
              src={logo_white}
              alt=""
              aria-hidden="true"
              className="w-24 h-24 object-contain"
              width="96"
              height="96"
            />
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
                onClick={() => goToSection(nav)}
              >
                <a
                  href={`#${nav.id}`}
                  onClick={(e) => e.preventDefault()}
                  aria-current={active === nav.title ? "true" : undefined}
                  className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                >
                  {nav.title}
                </a>
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
        onClose={closeMenu}
        active={active}
        setActive={setActive}
        onNavClick={goToSection}
      />
    </>
  );
};

export default Navbar;
