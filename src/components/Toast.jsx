import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

// Centering is handled through framer-motion's `x` transform rather than a
// Tailwind `-translate-x-1/2` class: framer-motion writes an inline
// `transform` style on the element, which would override the CSS class and
// knock the toast off-centre.
const POSITIONS = {
  "top-center": { offset: "top-24 left-1/2", x: "-50%" },
  "top-right": { offset: "top-6 right-6", x: 0 },
};

/**
 * Toast notifications rendered through a portal into <body>.
 *
 * The portal matters: every route is wrapped in a `relative z-0` container
 * (see App.jsx), and that container forms its own stacking context. A toast
 * rendered inside it can never paint above the fixed `z-20` navbar, no matter
 * how large its own z-index is. Portalling to <body> escapes that context.
 */
const Toast = ({ toast, position = "top-center" }) => {
  if (typeof document === "undefined") return null;

  const { offset, x } = POSITIONS[position] || POSITIONS["top-center"];

  return createPortal(
    <AnimatePresence>
      {toast && (
        <motion.div
          key="toast"
          initial={{ x, y: -20, opacity: 0 }}
          animate={{ x, y: 0, opacity: 1 }}
          exit={{ x, y: -20, opacity: 0 }}
          role="status"
          aria-live="polite"
          className={`fixed ${offset} z-[99999] px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border flex items-center gap-3 ${
            toast.type === "success"
              ? "bg-emerald-500/90 text-white border-emerald-300"
              : "bg-rose-500/90 text-white border-rose-300"
          }`}
        >
          {toast.type === "success" ? (
            <FiCheckCircle size={20} />
          ) : (
            <FiAlertCircle size={20} />
          )}
          <span className="font-medium text-sm">{toast.message}</span>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Toast;
