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
  const navigate = useNavigate();
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
            className="fixed right-0 top-0 z-[9991] flex h-screen w-[86%] max-w-sm flex-col overflow-hidden border-l border-white/10 bg-[#0c1323]/95 text-white shadow-2xl backdrop-blur-2xl"
            style={{ pointerEvents: open ? "auto" : "none", willChange: "transform" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  navigate("/");
                  const root = document.getElementById("root");
                  if (root) {
                    root.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                aria-label="Alexander Maiso — home"
              >
                <img
                  src={logo_white}
                  alt=""
                  aria-hidden="true"
                  className="h-8 w-8 object-contain"
                  width="32"
                  height="32"
                />
                <span className="text-sm font-semibold text-white">
                  Alexander Maiso
                </span>
              </div>
              <button
                type="button"
                aria-label="Close menu"
                onClick={onClose}
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/5 hover:text-white active:scale-95 touch-manipulation"
              >
                <span className="absolute h-[2px] w-5 rounded-full bg-white rotate-45" />
                <span className="absolute h-[2px] w-5 rounded-full bg-white -rotate-45" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col overflow-y-auto overscroll-contain px-5 py-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05, duration: 0.2 }}
              >
                <a
                  href={resume}
                  download
                  onClick={() => {
                    setActive("");
                    onClose();
                  }}
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 transition-colors hover:border-white/20 hover:bg-white/[0.07]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] text-white/75">
                      <svg
                        className="h-4 w-4 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                      </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-white">View my resume</span>
                    <span className="mt-0.5 block text-xs text-white/45">PDF document</span>
                  </span>
                  <span className="text-xs font-medium tracking-wide text-white/40">PDF</span>
                </a>
              </motion.div>

              <p className="px-1 pb-2 pt-8 text-xs font-medium text-white/40">
                Explore
              </p>
              <ul className="flex flex-col">
                {navLinks.map((nav, index) => (
                  <motion.li
                    key={nav.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 + index * 0.04, duration: 0.18 }}
                    onClick={() => onNavClick(nav)}
                    className="group flex cursor-pointer items-center border-b border-white/[0.06] py-3.5"
                  >
                    <a
                      href={`#${nav.id}`}
                      onClick={(e) => e.preventDefault()}
                      aria-current={active === nav.title ? "true" : undefined}
                      className={`text-sm font-medium transition-colors group-hover:text-white ${
                        active === nav.title
                          ? "text-white"
                          : "text-white/60"
                      }`}
                    >
                      {nav.title}
                    </a>
                    {active === nav.title && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-teal-400" />
                    )}
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto flex items-center gap-5 pt-8 text-sm">
                <Link
                  to="/blog"
                  onClick={onClose}
                  className="text-white/55 transition-colors hover:text-white"
                >
                  Blog
                </Link>
                <Link
                  to="/login"
                  onClick={onClose}
                  className="text-white/55 transition-colors hover:text-white"
                >
                  Live demo
                </Link>
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
          <div
            className="flex items-center cursor-pointer"
            onClick={() => {
              setActive("");
              navigate("/");
              const root = document.getElementById("root");
              if (root) {
                root.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            aria-label="Alexander Maiso — home"
          >
            <img
              src={logo_white}
              alt="Alexander Maiso logo"
              aria-hidden="true"
              className="w-12 h-12 sm:w-24 sm:h-24 object-contain"
              width="96"
              height="96"
              loading="lazy"
            />
            <p className="text-white text-[18px] font-bold flex">
              Alexander Maiso
            </p>
          </div>

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
