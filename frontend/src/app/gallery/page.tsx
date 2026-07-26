'use client';

import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Video, Eye, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Gallery() {
  const [filter, setFilter] = useState('ALL');

  const photos = [
    { title: 'STEM Robotics Lab Assembly', category: 'STEM', desc: 'Primary 5 pupils constructing autonomous buggy trackers.' },
    { title: 'Montessori Practical Life Lesson', category: 'ACADEMIC', desc: 'Early learning kindergarten kids working with color beads boards.' },
    { title: 'Inter-House Athletics Sports Relay', category: 'SPORTS', desc: 'Annual sports day relay track sprint finals in Lagos stadium.' },
    { title: 'Creative Art & Clay Sculpting', category: 'ARTS', desc: 'Nursery kids sculpting environmental animals using non-toxic clay.' },
    { title: 'Graduation Ceremony Awards', category: 'EVENTS', desc: 'Valedictorian speech and certificate handovers during graduation gala.' },
    { title: 'Science Excursion to ICT Center', category: 'EVENTS', desc: 'Students visiting active computer networks and telecom operations.' },
  ];

  const filteredPhotos = filter === 'ALL' ? photos : photos.filter(p => p.category === filter);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Subpage Header Banner */}
      <section className="bg-primary text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-primary-light/10 to-transparent pointer-events-none" />
        <h1 className="font-montserrat font-bold text-3xl sm:text-5xl">Photo & Video Gallery</h1>
        <p className="text-slate-300 font-poppins text-xs sm:text-sm mt-3 uppercase tracking-widest text-gold font-semibold">
          High IQ Campus Life
        </p>
      </section>

      {/* Virtual 360 Tour Simulator Banner */}
      <section className="py-12 bg-slate-900 text-white text-center border-b border-gold/20">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-gold px-3.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-4 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            Interactive Feature
          </div>
          <h2 className="font-montserrat font-bold text-2xl">Take a 360° Virtual Campus Tour</h2>
          <p className="text-slate-300 font-poppins text-xs mt-3 leading-relaxed">
            Click below to load our interactive 360-degree high-fidelity panoramic view simulator. Walk through the Montessori Creche, the Science labs, and soccer playgrounds.
          </p>
          <button
            onClick={() => alert('Starting Panoramic Tour Simulator... Loading assets. Welcome to the ICT Lab! Use mouse drag to rotate view.')}
            className="bg-gold hover:bg-gold-dark text-slate-900 font-poppins font-bold px-6 py-3 rounded-xl text-xs mt-6 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            Launch 360° Virtual Tour
          </button>
        </div>
      </section>

      {/* Filter Toolbar */}
      <section className="py-10 bg-cream dark:bg-dark-bg transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {['ALL', 'STEM', 'ACADEMIC', 'SPORTS', 'ARTS', 'EVENTS'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`font-poppins text-xs font-semibold px-5 py-2.5 rounded-full border transition-all cursor-pointer ${
                  filter === cat
                    ? 'bg-primary dark:bg-gold border-primary dark:border-gold text-white dark:text-slate-900 shadow-md'
                    : 'bg-white dark:bg-dark-card border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-300 hover:border-gold'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPhotos.map((photo, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl overflow-hidden shadow-sm group hover:border-gold transition-all duration-300"
              >
                {/* Simulated photo block */}
                <div className="aspect-video bg-gradient-to-tr from-primary/10 to-gold/10 relative flex items-center justify-center border-b border-slate-100 dark:border-dark-border">
                  <Camera className="h-10 w-10 text-slate-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="absolute bottom-3 left-3 bg-slate-900/80 text-white font-poppins text-[10px] px-2.5 py-1 rounded-md uppercase font-semibold">
                    {photo.category}
                  </span>
                </div>
                <div className="p-5">
                  <h4 className="font-montserrat font-bold text-base text-primary dark:text-white group-hover:text-gold transition-colors">
                    {photo.title}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 font-poppins text-xs leading-relaxed mt-2">
                    {photo.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
