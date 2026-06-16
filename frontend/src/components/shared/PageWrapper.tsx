"use client";

import { motion } from "framer-motion";

interface PageWrapperProps {
  children: React.ReactNode;
}

/**
 * Wraps page content with a subtle fade + slide-up enter animation.
 * Applied at the page level, not layout level, because Next.js 15
 * App Router doesn't support exit animations cleanly before navigation.
 *
 * Enter: fade in + 16px slide up over 0.35s
 * Exit:  none (hard cut — correct behaviour for App Router)
 */
export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}