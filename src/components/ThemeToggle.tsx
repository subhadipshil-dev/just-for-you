"use client";

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="fixed top-8 right-8 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 transition-all hover:border-rose-500/50"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-zinc-600" />
      ) : (
        <Sun className="w-5 h-5 text-amber-400" />
      )}
    </motion.button>
  );
}
