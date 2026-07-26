'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X, GraduationCap, LayoutDashboard, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  // If path starts with /portal, we don't render the public navbar
  if (pathname?.startsWith('/portal')) {
    return null;
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Academics', href: '/academics' },
    { name: 'Admissions', href: '/admissions' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'News & Events', href: '/news' },
    { name: 'Contact', href: '/contact' },
  ];

  const getDashboardLink = () => {
    if (!user) return '/portal/login';
    return `/portal/${user.role.toLowerCase()}`;
  };

  return (
    <header className="sticky top-0 z-50 glass shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & School Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary p-2.5 rounded-xl text-gold group-hover:rotate-6 transition-transform">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <span className="font-montserrat font-bold text-lg sm:text-xl tracking-tight text-primary dark:text-white">
                HIGH IQ
              </span>
              <span className="block text-[11px] font-medium tracking-widest text-gold uppercase -mt-1.5 font-poppins">
                Montessori School
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-poppins text-[14px] font-medium transition-colors hover:text-gold ${
                    isActive
                      ? 'text-gold underline underline-offset-8 decoration-2'
                      : 'text-primary dark:text-slate-300'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-primary dark:text-slate-300 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5 text-gold" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Portal CTA */}
            <Link
              href={getDashboardLink()}
              className="flex items-center gap-2 bg-primary hover:bg-primary-light dark:bg-gold dark:hover:bg-gold-dark text-white dark:text-slate-900 px-5 py-2.5 rounded-xl font-poppins text-sm font-semibold transition-all shadow-md hover:scale-105"
            >
              {user ? (
                <>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </>
              ) : (
                <>
                  <User className="h-4 w-4" />
                  Portal Login
                </>
              )}
            </Link>
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-primary dark:text-slate-300"
            >
              {darkMode ? <Sun className="h-5 w-5 text-gold" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-primary dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-cream dark:bg-dark-bg border-b border-slate-200 dark:border-slate-800 px-4 py-6 shadow-xl transition-all duration-200">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-poppins text-base font-semibold px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-gold font-bold'
                      : 'text-primary dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <hr className="border-slate-200 dark:border-slate-800 my-2" />
            <Link
              href={getDashboardLink()}
              onClick={() => setIsOpen(false)}
              className="flex justify-center items-center gap-2 bg-primary dark:bg-gold text-white dark:text-slate-900 py-3 rounded-xl font-poppins text-base font-semibold shadow-md"
            >
              {user ? (
                <>
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard ({user.role})
                </>
              ) : (
                <>
                  <User className="h-5 w-5" />
                  Portal Login
                </>
              )}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
export default Navbar;
