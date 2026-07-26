'use client';

import React from 'react';
import { BookOpen, Cpu, Globe, Music, Award, Activity } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Academics() {
  const sections = [
    { title: 'Creche & Playgroup', age: '3 Months – 2 Years', desc: 'Focus on sensory development, language familiarity, physical coordination, and caring environmental exploration.' },
    { title: 'Nursery & Kindergarten', age: '3 – 5 Years', desc: 'Core Montessori training in practical life, sensory materials, language mechanics, mathematical bead blocks, and social values.' },
    { title: 'Primary School', age: '6 – 10 Years', desc: 'Integrative British & Nigerian modules. Introduction of coding logics, arithmetic drills, reading comprehension, and physical science.' },
    { title: 'Secondary College', age: '11 – 17 Years', desc: 'Comprehensive prep for NECO, WAEC, and IGCSE. Advanced laboratory work in science, algebra, computing, and creative arts.' },
  ];

  const pillars = [
    { name: 'Montessori Methods', desc: 'Adhering to concrete sensory learning cycles to build strong cognitive skills.', icon: BookOpen },
    { name: 'STEM Labs & Coding', desc: 'Learning Scratch, Python, and hardware circuits to code projects and program logic.', icon: Cpu },
    { name: 'Bilingual & Global Studies', desc: 'Exploring French, social studies, global geography, and cultural dynamics.', icon: Globe },
    { name: 'Creative Arts & Music', desc: 'Tactile arts, clay sculpting, violin lessons, choir, and cultural dances.', icon: Music },
    { name: 'Track & Sports Activities', desc: 'Weekly physical training, inter-house athletics, swimming, and soccer teams.', icon: Activity },
    { name: 'Debate & Leadership', desc: 'Public speaking workshops, mock trials, and student council governance.', icon: Award },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Subpage Header Banner */}
      <section className="bg-primary text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-primary-light/10 to-transparent pointer-events-none" />
        <h1 className="font-montserrat font-bold text-3xl sm:text-5xl">Academics & Curriculum</h1>
        <p className="text-slate-300 font-poppins text-xs sm:text-sm mt-3 uppercase tracking-widest text-gold font-semibold">
          High IQ Academic Pillars
        </p>
      </section>

      {/* Section Divisions */}
      <section className="py-20 bg-cream dark:bg-dark-bg transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-montserrat font-extrabold text-3xl text-primary dark:text-white">Academic Divisions</h2>
            <p className="text-slate-600 dark:text-slate-400 font-poppins text-sm mt-3">
              We offer structured pathways designed to support the child’s cognitive development at every development milestone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((sec, idx) => (
              <div key={idx} className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-gold text-xs font-semibold uppercase tracking-widest font-poppins">{sec.age}</span>
                  <h3 className="font-montserrat font-bold text-xl text-primary dark:text-white mt-1">{sec.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-poppins text-sm leading-relaxed mt-4">
                    {sec.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars of Learning */}
      <section className="py-20 bg-white dark:bg-dark-card transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-montserrat font-extrabold text-3xl text-primary dark:text-white">Curriculum Highlights</h2>
            <p className="text-slate-600 dark:text-slate-400 font-poppins text-sm mt-3">
              Beyond standard worksheets, our students participate in interactive co-curricular laboratories weekly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {pillars.map((pil) => {
              const Icon = pil.icon;
              return (
                <div key={pil.name} className="bg-slate-50 dark:bg-dark-bg/60 p-8 rounded-2xl border border-slate-100 dark:border-dark-border flex gap-4">
                  <div className="bg-primary dark:bg-gold p-3 rounded-xl text-white dark:text-slate-900 h-fit flex-shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-montserrat font-bold text-base text-primary dark:text-white">{pil.name}</h4>
                    <p className="text-slate-500 dark:text-slate-400 font-poppins text-xs leading-relaxed mt-2">{pil.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Online Exam Demo Panel */}
      <section className="bg-primary text-white py-16 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 flex flex-col items-center">
          <h2 className="font-montserrat font-bold text-2xl sm:text-3xl">Explore Our CBT Platform Demo</h2>
          <p className="text-slate-300 font-poppins text-xs sm:text-sm max-w-2xl mt-4 leading-relaxed">
            Interested in seeing our Computer Based Testing (CBT) portal in action? Our students complete examinations online, receiving instant feedback and analytics reports. Try the interactive student demo.
          </p>
          <a
            href="/portal/login"
            className="bg-gold hover:bg-gold-dark text-slate-900 font-poppins font-bold px-8 py-3.5 rounded-xl text-sm shadow-md mt-6 hover:scale-105 active:scale-95 transition-all"
          >
            Launch Student Portal Demo
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
