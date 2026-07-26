'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Eye, Heart, Music, Award, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  const coreValues = [
    { name: 'Academic Excellence', desc: 'Developing high cognitive focus, logical reasoning, and active memory recollection.', icon: Award },
    { name: 'Montessori Integrity', desc: 'True adherence to Dr. Maria Montessori’s sensory, child-centered self-discovery layouts.', icon: Compass },
    { name: 'Technological Innovation', desc: 'Integration of coding, robotics mechanics, and digital design tools from an early age.', icon: ShieldCheck },
    { name: 'Character & Grace', desc: 'Instilling core ethical discipline, social grace, and respect for environment and peers.', icon: Heart },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Subpage Header Banner */}
      <section className="bg-primary text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-primary-light/10 to-transparent pointer-events-none" />
        <h1 className="font-montserrat font-bold text-3xl sm:text-5xl">About Our School</h1>
        <p className="text-slate-300 font-poppins text-xs sm:text-sm mt-3 uppercase tracking-widest text-gold font-semibold">
          Discover the High IQ Foundation
        </p>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-cream dark:bg-dark-bg transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Mission Card */}
          <div className="bg-white dark:bg-dark-card p-10 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm flex gap-6">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-primary dark:text-gold h-fit">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-montserrat font-bold text-xl text-primary dark:text-white">Our Mission</h3>
              <p className="text-slate-600 dark:text-slate-400 font-poppins text-sm leading-relaxed mt-4">
                To nurture the child's natural desire to learn, using authentic Montessori principles and contemporary technological tools. We aim to equip pupils with logic, skills, and values required to lead globally and excel academically.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-white dark:bg-dark-card p-10 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm flex gap-6">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-primary dark:text-gold h-fit">
              <Eye className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-montserrat font-bold text-xl text-primary dark:text-white">Our Vision</h3>
              <p className="text-slate-600 dark:text-slate-400 font-poppins text-sm leading-relaxed mt-4">
                To be the foremost international private school in Nigeria, recognized for pioneering child-centered technological innovation, academic excellence, and raising independent leaders of impeccable character.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* School Anthem Banner */}
      <section className="py-16 bg-white dark:bg-dark-card border-y border-slate-200 dark:border-dark-border text-center transition-colors">
        <div className="max-w-3xl mx-auto px-4 flex flex-col items-center">
          <div className="bg-primary dark:bg-gold p-3 rounded-full text-white dark:text-slate-900 mb-6">
            <Music className="h-6 w-6" />
          </div>
          <h2 className="font-montserrat font-extrabold text-2xl sm:text-3xl text-primary dark:text-white">
            High IQ School Anthem
          </h2>
          <blockquote className="mt-6 text-slate-700 dark:text-slate-300 font-poppins text-sm sm:text-base leading-relaxed italic max-w-xl">
            "Arise, O High IQ Scholars, <br />
            With minds alert and hearts of gold, <br />
            Under the guidance of our mentors, <br />
            New heights of wisdom to unfold. <br /><br />
            High IQ Montessori, High IQ Montessori, <br />
            Nurturing the logic, building the child, <br />
            We lead the way with knowledge wild! <br />
            Forward we march with excellence, <br />
            In faith, in science, and intelligence."
          </blockquote>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-cream dark:bg-dark-bg transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-montserrat font-extrabold text-3xl text-primary dark:text-white">Our Core Values</h2>
            <p className="text-slate-600 dark:text-slate-400 font-poppins text-sm mt-3">
              The fundamental guidelines that shape academic life, teacher recruitment, and school administration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((val) => {
              const Icon = val.icon;
              return (
                <div key={val.name} className="bg-white dark:bg-dark-card p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border text-center flex flex-col items-center gap-3">
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-primary dark:text-gold w-fit">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-montserrat font-bold text-base text-primary dark:text-white">{val.name}</h4>
                  <p className="text-slate-500 dark:text-slate-400 font-poppins text-xs leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* School Timeline/History */}
      <section className="py-20 bg-white dark:bg-dark-card transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-montserrat font-extrabold text-3xl text-primary dark:text-white">Our Journey</h2>
          </div>

          <div className="relative border-l border-slate-200 dark:border-dark-border pl-6 space-y-12 ml-4">
            <div className="relative">
              <span className="absolute -left-[31px] top-1.5 bg-gold border-4 border-white dark:border-dark-card rounded-full w-4 h-4" />
              <h4 className="font-montserrat font-bold text-lg text-primary dark:text-white">2018 - Founded</h4>
              <p className="text-slate-600 dark:text-slate-400 font-poppins text-sm leading-relaxed mt-2">
                High IQ Montessori was founded in Ikorodu as an early learning center, starting with a preschool playground of 12 pupils.
              </p>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-1.5 bg-gold border-4 border-white dark:border-dark-card rounded-full w-4 h-4" />
              <h4 className="font-montserrat font-bold text-lg text-primary dark:text-white">2020 - Primary Expansion</h4>
              <p className="text-slate-600 dark:text-slate-400 font-poppins text-sm leading-relaxed mt-2">
                Launched the Primary School division and introduced the hybrid British National and NERDC curriculum schemas.
              </p>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-1.5 bg-gold border-4 border-white dark:border-dark-card rounded-full w-4 h-4" />
              <h4 className="font-montserrat font-bold text-lg text-primary dark:text-white">2023 - Coding & Robotics Launch</h4>
              <p className="text-slate-600 dark:text-slate-400 font-poppins text-sm leading-relaxed mt-2">
                Built the flagship STEM laboratory. Integrated mandatory robotics training and logic puzzle assessments into the weekly curriculum.
              </p>
            </div>
            <div className="relative">
              <span className="absolute -left-[31px] top-1.5 bg-gold border-4 border-white dark:border-dark-card rounded-full w-4 h-4" />
              <h4 className="font-montserrat font-bold text-lg text-primary dark:text-white">2025 - College & ERP Integration</h4>
              <p className="text-slate-600 dark:text-slate-400 font-poppins text-sm leading-relaxed mt-2">
                Expanded into Secondary College classes. Launched the complete enterprise school ERP management system to connect parents, library, transportation, and automated grading reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
