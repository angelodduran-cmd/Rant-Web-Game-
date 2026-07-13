import React from "react";
import { motion } from "motion/react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-amber-950/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="relative w-full max-w-lg bg-amber-900/40 backdrop-blur-3xl border-2 border-amber-900 rounded-[30px] shadow-2xl shadow-amber-950/50 p-8 flex flex-col gap-6 text-amber-100 z-10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-amber-100 transition-all font-bold"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="w-full">{children}</div>
      </motion.div>
    </div>
  );
};

export default Modal;
