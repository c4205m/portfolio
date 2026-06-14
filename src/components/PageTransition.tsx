import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { useModal } from "../context/ModalContext";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

interface PageTransitionProps {
  children: ReactNode;
  /** Wrapper class: "template-content" for most pages, "content" for resume. */
  className?: string;
}

/** Animated page wrapper. Doubles as the modal-hiding container on mobile. */
export function PageTransition({ children, className = "template-content" }: PageTransitionProps) {
  const { activeKey } = useModal();
  const reduced = usePrefersReducedMotion();

  const cls = `${className}${activeKey ? " modal-active" : ""}`;

  if (reduced) return <div className={cls}>{children}</div>;

  return (
    <motion.div
      className={cls}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
