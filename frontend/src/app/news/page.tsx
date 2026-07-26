'use client';

import React from 'react';
import { Calendar as CalendarIcon, Clock, ChevronRight, FileText } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function News() {
  const blogs = [
    {
      title: 'The Value of Tactile Mathematics in Montessori',
      date: 'July 15, 2026',
      author: 'Mrs. Edu',
      summary: 'Why counting wooden beads and concrete scales helps kindergarten kids conceptualize algebra faster than simple memory recall worksheets.',
    },
    {
      title: 'Pioneering Robotics Assembly in Ikorodu Schools',
      date: 'June 28, 2026',
      author: 'Mr. Babatunde Emeka (ICT Coordinator)',
      summary: 'A summary of our students’ buggy racing robots built during the STEM summer bootcamp and their impact on logical critical analysis.',
    },
    {
      title: 'Healthy Snack Guidelines for Creche & Nursery Sessions',
      date: 'May 10, 2026',
      author: 'Nurse Funmi Coker',
      summary: 'Crucial health and nutrition guidelines to support optimal physical stamina, dental hygiene, and cognitive alertness in children.',
    },
  ];

  const calendarEvents = [
    { title: '1st Term Resumption Date', date: 'Sept 14, 2026', time: '8:00 AM', desc: 'All students return to campus for classes.' },
    { title: 'Parent-Teacher Consultative Assembly', date: 'Oct 03, 2026', time: '10:00 AM', desc: 'Term academic goals and ERP training support workshop.' },
    { title: 'Mid-Term Examinations Start', date: 'Oct 26, 2026', time: '8:30 AM', desc: 'Evaluation of mid-term curriculum milestones.' },
    { title: 'Inter-House Sports Relay heats', date: 'Nov 12, 2026', time: '9:00 AM', desc: 'Athletic qualifying heats at stadium.' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Subpage Header Banner */}
      <section className="bg-primary text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-primary-light/10 to-transparent pointer-events-none" />
        <h1 className="font-montserrat font-bold text-3xl sm:text-5xl">News, Announcements & Events</h1>
        <p className="text-slate-300 font-poppins text-xs sm:text-sm mt-3 uppercase tracking-widest text-gold font-semibold">
          High IQ Campus Logs
        </p>
      </section>

      {/* Main Content Grid */}
      <section className="py-20 bg-cream dark:bg-dark-bg transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Blog Feed (2 columns width on large screens) */}
          <div className="lg:col-span-2 space-y-10">
            <h2 className="font-montserrat font-extrabold text-2xl text-primary dark:text-white">Academic Blog & News</h2>
            
            {blogs.map((blog, idx) => (
              <article key={idx} className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-8 rounded-2xl shadow-sm space-y-4 hover:border-gold transition-colors duration-200">
                <div className="flex items-center gap-4 text-xs font-poppins text-slate-400">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {blog.date}
                  </span>
                  <span>•</span>
                  <span>By {blog.author}</span>
                </div>
                <h3 className="font-montserrat font-bold text-xl text-primary dark:text-white hover:text-gold transition-colors">
                  {blog.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 font-poppins text-sm leading-relaxed">
                  {blog.summary}
                </p>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert('Loading blog details... Feature available soon.'); }}
                  className="font-poppins text-xs text-primary dark:text-gold font-bold flex items-center gap-1 hover:gap-2 transition-all w-fit"
                >
                  Read Full Article
                  <ChevronRight className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>

          {/* Right Column: Events Calendar (1 column width) */}
          <div className="space-y-8">
            <h2 className="font-montserrat font-extrabold text-2xl text-primary dark:text-white">Upcoming Events</h2>
            
            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl shadow-sm p-6 space-y-6">
              {calendarEvents.map((evt, idx) => (
                <div key={idx} className="flex gap-4 items-start border-b border-slate-100 dark:border-dark-border pb-4 last:border-0 last:pb-0">
                  <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-primary dark:text-gold flex flex-col items-center justify-center flex-shrink-0 text-center w-14 h-14">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="block text-[9px] font-bold mt-1 tracking-tight leading-none">
                      {evt.date.split(',')[0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-montserrat font-bold text-sm text-primary dark:text-white">
                      {evt.title}
                    </h4>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400 font-poppins mt-1">
                      <Clock className="h-3 w-3" />
                      {evt.time}
                    </span>
                    <p className="text-slate-500 dark:text-slate-400 font-poppins text-xs mt-1.5 leading-relaxed">
                      {evt.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter reminder */}
            <div className="bg-primary text-white p-6 rounded-2xl shadow-md space-y-4">
              <h4 className="font-montserrat font-bold text-base text-gold">Don't Miss Dates</h4>
              <p className="font-poppins text-xs text-slate-300 leading-relaxed">
                Add our calendar feeds to your Google Calendar or Outlook to sync resumption days automatically.
              </p>
              <button
                onClick={() => alert('Syncing Academic Calendar Feed with Google Calendar... Done!')}
                className="bg-gold text-slate-900 font-poppins text-xs font-bold w-full py-2.5 rounded-xl"
              >
                Sync with Calendar
              </button>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
