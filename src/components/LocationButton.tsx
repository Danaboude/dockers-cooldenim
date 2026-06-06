'use client';
import { MapPin } from '@phosphor-icons/react';
import { motion } from 'motion/react';

export default function LocationButton() {
  return (
    <motion.a
      href="https://share.google/i4TAEq6qU6UZEZRzM"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-navy text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      aria-label="Find our store on Google Maps"
    >
      <MapPin size={20} weight="fill" className="text-gold shrink-0" />
      <span className="text-sm font-semibold whitespace-nowrap">Find Our Store</span>
    </motion.a>
  );
}
