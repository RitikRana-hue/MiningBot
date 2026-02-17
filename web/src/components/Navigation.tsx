"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HardHat, Menu, X, ChevronDown, User, LogOut, Coins, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Pricing", href: "/pricing" },
  { name: "India Mines", href: "/india-mines" },
  { name: "Safety", href: "/safety" },
  { name: "Contact", href: "/contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push("/");
  };

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
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <HardHat className="h-10 w-10 text-emerald-500" />
              </motion.div>
              <div>
                <span className="text-2xl font-bold tracking-tight">CoalMine</span>
                <span className="text-2xl font-light text-emerald-400">AI</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                    pathname === item.href
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

            {/* CTA Button / User Menu */}
            <div className="hidden lg:flex items-center gap-4">
              {isLoading ? (
                <div className="w-24 h-10 bg-zinc-800 rounded-full animate-pulse" />
              ) : user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-3 px-4 py-2 bg-zinc-800/80 border border-zinc-700/50 rounded-full hover:bg-zinc-800 transition-colors"
                  >
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <span className="text-emerald-400 font-medium text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left hidden xl:block">
                      <div className="text-sm font-medium text-white">{user.name.split(' ')[0]}</div>
                      <div className="text-xs text-zinc-500 flex items-center gap-1">
                        <Coins className="h-3 w-3" />
                        {user.plan === 'enterprise' ? '∞' : user.tokens} tokens
                      </div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden"
                      >
                        <div className="p-4 border-b border-zinc-800">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-zinc-500">{user.email}</div>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-lg">
                              <Coins className="h-4 w-4 text-emerald-400" />
                              <span className="text-sm font-medium text-emerald-400">
                                {user.plan === 'enterprise' ? 'Unlimited' : `${user.tokens} tokens`}
                              </span>
                            </div>
                            <span className="text-xs px-2 py-1 bg-zinc-800 rounded-lg text-zinc-400 capitalize">
                              {user.plan} plan
                            </span>
                          </div>
                        </div>
                        <div className="p-2">
                          <Link
                            href="/chat"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Open Chat
                          </Link>
                          <Link
                            href="/pricing"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
                          >
                            <Coins className="h-4 w-4" />
                            Buy Tokens
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="group relative px-6 py-3 bg-emerald-600 text-white font-semibold rounded-full overflow-hidden"
                >
                  <span className="relative z-10">Login</span>
                  <motion.div
                    className="absolute inset-0 bg-emerald-400"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              )}
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
                    className={`text-2xl font-medium ${
                      pathname === item.href ? "text-emerald-400" : "text-zinc-300"
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col items-center gap-4"
              >
                {user ? (
                  <>
                    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-full">
                      <Coins className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">
                        {user.plan === 'enterprise' ? 'Unlimited' : `${user.tokens} tokens`}
                      </span>
                    </div>
                    <Link
                      href="/chat"
                      onClick={() => setMobileOpen(false)}
                      className="px-8 py-4 bg-emerald-600 text-white font-semibold rounded-full"
                    >
                      Open Chat
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setMobileOpen(false); }}
                      className="text-red-400 font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="px-8 py-4 bg-emerald-600 text-white font-semibold rounded-full"
                  >
                    Login
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
