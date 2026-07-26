'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  GraduationCap,
  Users,
  Calendar,
  BookOpen,
  DollarSign,
  MapPin,
  ClipboardList,
  Activity,
  Award,
  Sun,
  Moon,
  LogOut,
  User,
  ShieldAlert,
  Bot,
  Package,
  BookMarked
} from 'lucide-react';
import Link from 'next/link';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 1. Bypass checks for login page
  if (pathname === '/portal/login') {
    return <>{children}</>;
  }

  // 2. Loading state check
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-3">
        <GraduationCap className="h-10 w-10 text-gold animate-bounce" />
        <span className="font-poppins text-xs tracking-wider animate-pulse">VERIFYING PORTAL SESSION...</span>
      </div>
    );
  }

  // 3. Unauthenticated redirect
  if (!user) {
    if (typeof window !== 'undefined') {
      router.push('/portal/login');
    }
    return null;
  }

  const role = user.role.toUpperCase();

  // Sidebar Links config based on role
  const getSidebarLinks = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { name: 'Control Panel', href: '/portal/admin', icon: ClipboardList },
          { name: 'Users & Staff', href: '/portal/hr', icon: Users },
          { name: 'Invoices & Finance', href: '/portal/finance', icon: DollarSign },
          { name: 'Academic Seeding', href: '/portal/teacher', icon: BookOpen },
        ];
      case 'PRINCIPAL':
        return [
          { name: 'Performance Analytics', href: '/portal/principal', icon: ClipboardList },
          { name: 'Staff Roster', href: '/portal/hr', icon: Users },
          { name: 'School Fees Ledgers', href: '/portal/finance', icon: DollarSign },
          { name: 'Clinic Ledger', href: '/portal/clinic', icon: Activity },
        ];
      case 'TEACHER':
        return [
          { name: 'Classroom & Grading', href: '/portal/teacher', icon: BookOpen },
          { name: 'AI Planner Tools', href: '/portal/teacher#ai-planner', icon: Bot },
        ];
      case 'STUDENT':
        return [
          { name: 'Student Desk', href: '/portal/student', icon: GraduationCap },
          { name: 'CBT Quiz Center', href: '/portal/student#cbt', icon: Award },
        ];
      case 'PARENT':
        return [
          { name: 'Parent Console', href: '/portal/parent', icon: Users },
          { name: 'Bus GPS Tracker', href: '/portal/parent#bus-tracker', icon: MapPin },
        ];
      case 'FINANCE':
        return [
          { name: 'Finance Ledger', href: '/portal/finance', icon: DollarSign },
        ];
      case 'HR':
        return [
          { name: 'HR Dashboard', href: '/portal/hr', icon: Users },
        ];
      case 'LIBRARIAN':
        return [
          { name: 'Library Center', href: '/portal/library', icon: BookMarked },
        ];
      case 'TRANSPORT':
        return [
          { name: 'Bus Routes Manager', href: '/portal/transport', icon: MapPin },
        ];
      case 'CLINIC':
        return [
          { name: 'Triage & Clinic logs', href: '/portal/clinic', icon: Activity },
        ];
      default:
        return [{ name: 'Portal', href: `/portal/${role.toLowerCase()}`, icon: GraduationCap }];
    }
  };

  const links = getSidebarLinks();

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-dark-bg transition-colors duration-200 font-poppins">
      
      {/* Sidebar Panel */}
      <aside className="w-64 bg-primary text-slate-200 border-r border-slate-800 dark:border-dark-border hidden md:flex flex-col flex-shrink-0">
        
        {/* Brand Header */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-800 dark:border-dark-border">
          <div className="bg-white p-1.5 rounded-lg text-primary">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="font-montserrat font-bold text-sm tracking-tight text-white">HIGH IQ</span>
            <span className="block text-[8px] font-medium tracking-widest text-gold uppercase -mt-1 font-poppins">Montessori ERP</span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-3 mb-4">
            Navigation Menu
          </div>
          {links.map((link) => {
            const Icon = link.icon;
            const isLinkActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isLinkActive
                    ? 'bg-gold text-slate-900 shadow-md scale-102'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info Footing */}
        <div className="p-4 border-t border-slate-800 dark:border-dark-border bg-slate-950/20">
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-gold uppercase">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-xs font-bold text-white truncate">{user.name}</span>
              <span className="block text-[9px] text-gold uppercase font-bold tracking-wider">{user.role}</span>
            </div>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-20 bg-white dark:bg-dark-card border-b border-slate-200 dark:border-dark-border px-6 flex justify-between items-center transition-colors">
          <div className="flex items-center gap-3">
            <span className="font-montserrat font-bold text-base text-primary dark:text-white uppercase hidden md:inline-block">
              {role} Console
            </span>
            <span className="font-montserrat font-bold text-sm tracking-wide text-primary dark:text-white md:hidden">
              HIGH IQ ERP
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-primary dark:text-slate-300"
            >
              {darkMode ? <Sun className="h-5 w-5 text-gold" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Logout button */}
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-rose-500 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Page Children Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50 dark:bg-dark-bg/40">
          {children}
        </main>
      </div>

    </div>
  );
}
