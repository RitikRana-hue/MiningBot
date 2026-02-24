"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HardHat, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Chat", href: "/chat" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/chat" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <HardHat className="h-10 w-10 text-emerald-500" />
              </motion.div>
              <div>
                <span className="text-2xl font-bold tracking-tight">Mine</span>
                <span className="text-2xl font-light text-emerald-400">GPT</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors ${pathname === item.href
                    ? "text-emerald-400"
                    : "text-zinc-400 hover:text-white"
                    }`}
                >
                  {item.name}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-zinc-400"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-zinc-950 pt-24 lg:hidden"
          >
            <div className="flex flex-col items-center gap-6 p-8">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-2xl font-medium ${pathname === item.href ? "text-emerald-400" : "text-zinc-300"
                      }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
