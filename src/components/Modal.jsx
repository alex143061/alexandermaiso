import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

/**
 * A modal dialog rendered through a portal into <body>.
 *
 * Like Toast, this must escape the route's `relative z-0` wrapper (App.jsx),
 * which forms a stacking context and would otherwise paint the modal
 * backdrop *below* the fixed `z-20` navbar.
 */
const Modal = ({ open, onClose, children, maxWidth = "max-w-md" }) => {
  // Callers typically pass an inline arrow (`() => setOpen(false)`), which is
  // a new function on every render. Keeping it in a ref means the scroll-lock
  // effect below is not torn down and re-applied on every parent render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Lock background scroll and close on Escape while the modal is open.
  useEffect(() => {
    if (!open) return;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKey = (e) => {
      if (e.key === "Escape") onCloseRef.current?.();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onCloseRef.current?.()}
          className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            key="modal-content"
            role="dialog"
            aria-modal="true"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full ${maxWidth} bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8`}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
