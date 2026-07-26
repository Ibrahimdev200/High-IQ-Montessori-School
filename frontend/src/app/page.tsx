'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Trophy,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Tv,
  Users,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';

export default function Home() {
  const [stats, setStats] = useState({ students: 0, teachers: 0, success: 0, awards: 0 });

  useEffect(() => {
    // Animate statistics counting up
    const duration = 2000;
    const steps = 50;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setStats({
        students: Math.min(Math.floor((520 / steps) * step), 520),
        teachers: Math.min(Math.floor((48 / steps) * step), 48),
        success: Math.min(Math.floor((100 / steps) * step), 100),
        awards: Math.min(Math.floor((32 / steps) * step), 32)
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Emergency Alert Banner */}
      <div className="bg-amber-500 text-slate-900 text-center py-2 px-4 text-xs sm:text-sm font-semibold tracking-wider flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4 animate-spin text-slate-900" />
        <span>ADMISSIONS OPEN FOR THE 2025/2026 ACADEMIC SESSION. CHAT WITH OUR AI ASSISTANT OR APPLY ONLINE NOW!</span>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center text-white overflow-hidden bg-slate-950">
        {/* Simulated Video Loop Background / Dynamic Particle Mesh Overlay */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary via-slate-900 to-black z-10" />
          <div className="absolute inset-0 flex items-center justify-center animate-pulse duration-[8000ms]">
            <div className="w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/50 via-transparent to-transparent blur-3xl" />
          </div>
        </div>

        {/* Floating Montessori Geometry Ribbons */}
        <div className="absolute top-20 left-10 w-48 h-48 bg-gold/10 rounded-full blur-3xl animate-bounce duration-[6000ms]" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-primary-light/15 rounded-full blur-3xl animate-pulse duration-[5000ms]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-4 py-1.5 rounded-full text-gold font-poppins text-xs font-semibold uppercase tracking-widest mb-6"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Nurturing Minds, Building Future Leaders
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-montserrat font-extrabold text-4xl sm:text-5xl lg:text-7xl tracking-tight leading-tight max-w-5xl"
          >
            Where Excellence Meets <span className="text-gold">Montessori Innovation</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-poppins text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mt-6 leading-relaxed"
          >
            Empowering children in Ikorodu with a customized Montessori foundation, world-class British & Nigerian curriculum, Coding, Robotics, and values for life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto"
          >
            <Link
              href="/admissions"
              className="bg-gold hover:bg-gold-dark text-slate-900 px-8 py-4 rounded-xl font-poppins font-bold text-base shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              Apply Online Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-white px-8 py-4 rounded-xl font-poppins font-semibold text-base flex items-center justify-center gap-2 transition-all hover:bg-slate-700 hover:scale-105"
            >
              Book Campus Tour
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="bg-white dark:bg-dark-card border-y border-slate-200 dark:border-dark-border py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <span className="font-montserrat font-extrabold text-4xl sm:text-5xl text-primary dark:text-gold">
              {stats.students}+
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-poppins text-xs sm:text-sm font-medium mt-1">
              Active Enrolled Students
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-montserrat font-extrabold text-4xl sm:text-5xl text-primary dark:text-gold">
              {stats.teachers}+
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-poppins text-xs sm:text-sm font-medium mt-1">
              Certified Educators
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-montserrat font-extrabold text-4xl sm:text-5xl text-primary dark:text-gold">
              {stats.success}%
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-poppins text-xs sm:text-sm font-medium mt-1">
              National Examination Success
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-montserrat font-extrabold text-4xl sm:text-5xl text-primary dark:text-gold">
              {stats.awards}+
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-poppins text-xs sm:text-sm font-medium mt-1">
              STEM & Robotics Laurels
            </span>
          </div>
        </div>
      </section>

      {/* Core Highlights Pillars */}
      <section className="py-20 bg-cream dark:bg-dark-bg transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-montserrat font-extrabold text-3xl sm:text-4xl text-primary dark:text-white">
              The High IQ Educational Ecosystem
            </h2>
            <p className="text-slate-600 dark:text-slate-400 font-poppins text-sm mt-4">
              We provide a robust learning trajectory tailored to develop sensory perception, critical logic, and character.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border flex flex-col gap-4 hover:border-gold dark:hover:border-gold transition-all duration-300">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-primary dark:text-gold w-fit">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="font-montserrat font-bold text-xl text-primary dark:text-white">Montessori Philosophy</h3>
              <p className="text-slate-600 dark:text-slate-400 font-poppins text-xs leading-relaxed">
                Utilizing concrete sensory apparatuses to build abstract intelligence. Children learn math, vocabulary, and practical life skills through tactile, self-directed play.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border flex flex-col gap-4 hover:border-gold dark:hover:border-gold transition-all duration-300">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-primary dark:text-gold w-fit">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="font-montserrat font-bold text-xl text-primary dark:text-white">Dual-Curriculum Core</h3>
              <p className="text-slate-600 dark:text-slate-400 font-poppins text-xs leading-relaxed">
                Seamless blend of the British National Curriculum and the Nigerian NERDC framework, ensuring our graduates excel in both national entries (WAEC, NECO) and international assessments.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border flex flex-col gap-4 hover:border-gold dark:hover:border-gold transition-all duration-300">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-primary dark:text-gold w-fit">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-montserrat font-bold text-xl text-primary dark:text-white">Advanced STEM & Coding</h3>
              <p className="text-slate-600 dark:text-slate-400 font-poppins text-xs leading-relaxed">
                Equipped with active labs for coding (Scratch, Python), robotics assembly, and logic builders. Our students construct autonomous robots and code mobile mini-games.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Message Card */}
      <section className="py-16 bg-white dark:bg-dark-card transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 items-center">
          <div className="relative w-full lg:w-1/3 aspect-[4/5] bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border-2 border-gold/40">
            {/* Fallback pattern simulating photo */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-slate-900/90 flex flex-col justify-end p-6 text-white text-center">
              <h4 className="font-bold text-lg">Mrs. Edu</h4>
              <p className="text-gold text-xs">School Principal</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <span className="text-gold uppercase font-bold text-xs tracking-widest font-poppins">LEADER. MENTOR. EDUCATOR.</span>
            <h2 className="font-montserrat font-extrabold text-3xl sm:text-4xl text-primary dark:text-white mt-2">
              Principal's Welcome Message
            </h2>
            <p className="text-slate-600 dark:text-slate-400 font-poppins text-sm leading-relaxed mt-6">
              "Every child is unique, every child is capable, and together, we build a brighter future."
            </p>
            <p className="text-slate-600 dark:text-slate-400 font-poppins text-sm leading-relaxed mt-4">
              With passion, dedication and a heart for children, Mrs. Edu provides visionary leadership and a nurturing environment where every child is encouraged to explore, learn and excel.
            </p>
            <Link
              href="/about"
              className="mt-8 text-primary dark:text-gold font-poppins text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all w-fit"
            >
              Read Our History and Leadership Profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Boxed Banner */}
      <section className="bg-primary py-16 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-primary-light/20 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 relative z-10 flex flex-col items-center">
          <h2 className="font-montserrat font-bold text-2xl sm:text-4xl">Experience High IQ Montessori Live</h2>
          <p className="text-slate-300 font-poppins text-xs sm:text-sm max-w-2xl mt-4 leading-relaxed">
            We invite you to experience our vibrant classrooms, meet our dedicated facilitators, and inspect our robotics labs. Book a physical tour or schedule a video call today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
            <Link
              href="/contact"
              className="bg-gold hover:bg-gold-dark text-slate-900 font-poppins font-bold px-8 py-3.5 rounded-xl text-sm shadow-md"
            >
              Book Physical Tour
            </Link>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert('Please use our Live WhatsApp widget or Contact enquiries to book a call'); }}
              className="border border-white/40 hover:bg-white/10 font-poppins font-semibold px-8 py-3.5 rounded-xl text-sm transition-colors"
            >
              Schedule Video Call
            </a>
          </div>
        </div>
      </section>

      <AIChatbot />
      <Footer />
    </div>
  );
}
