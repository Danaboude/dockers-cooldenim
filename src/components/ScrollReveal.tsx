'use client';
import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'left' | 'right';
}

export default function ScrollReveal({ children, delay = 0, className, direction = 'up' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const reduced = useReducedMotion();

  const initial = reduced
    ? {}
    : {
        opacity: 0,
        y: direction === 'up' ? 32 : 0,
        x: direction === 'left' ? -32 : direction === 'right' ? 32 : 0,
      };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
