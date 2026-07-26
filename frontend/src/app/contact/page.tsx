'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, CloudSun, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'ADMISSION_ENQUIRY', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: '', email: '', phone: '', subject: 'ADMISSION_ENQUIRY', message: '' });
      }, 5000);
    }
  };

  const handleWhatsApp = () => {
    alert('Simulating redirect to WhatsApp chat with High IQ Montessori Admissions Desk (+2348012345678)...');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Subpage Header Banner */}
      <section className="bg-primary text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-primary-light/10 to-transparent pointer-events-none" />
        <h1 className="font-montserrat font-bold text-3xl sm:text-5xl">Contact Us</h1>
        <p className="text-slate-300 font-poppins text-xs sm:text-sm mt-3 uppercase tracking-widest text-gold font-semibold">
          Get In Touch With High IQ
        </p>
      </section>

      {/* Main Grid */}
      <section className="py-20 bg-cream dark:bg-dark-bg transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Contact details & Widgets */}
          <div className="space-y-8">
            <h2 className="font-montserrat font-extrabold text-2xl text-primary dark:text-white">Campus Information</h2>
            <p className="text-slate-600 dark:text-slate-400 font-poppins text-sm leading-relaxed">
              We look forward to welcoming you. Feel free to contact our admissions desks or visit our campus in Ikorodu.
            </p>

            <div className="space-y-4 font-poppins text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-dark-border pb-4 last:border-0 last:pb-0">
                <div className="bg-primary dark:bg-gold p-3 rounded-xl text-white dark:text-slate-900">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-montserrat font-bold text-sm text-primary dark:text-white">Campus Address</h4>
                  <p className="mt-1 text-slate-500">123 High IQ Avenue, Ikorodu, Lagos State, Nigeria</p>
                </div>
              </div>
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-dark-border pb-4 last:border-0 last:pb-0">
                <div className="bg-primary dark:bg-gold p-3 rounded-xl text-white dark:text-slate-900">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-montserrat font-bold text-sm text-primary dark:text-white">Phone Support</h4>
                  <p className="mt-1 text-slate-500">Admissions desk: 0803 123 4567</p>
                  <p className="text-slate-500">Principal office: 0812 345 6789</p>
                </div>
              </div>
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-dark-border pb-4 last:border-0 last:pb-0">
                <div className="bg-primary dark:bg-gold p-3 rounded-xl text-white dark:text-slate-900">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-montserrat font-bold text-sm text-primary dark:text-white">Email Inbox</h4>
                  <p className="mt-1 text-slate-500">info@highiqmontessori.edu.ng</p>
                  <p className="text-slate-500">admissions@highiqmontessori.edu.ng</p>
                </div>
              </div>
            </div>

            {/* Weather & Location Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Weather Widget */}
              <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="bg-amber-100 dark:bg-amber-950/20 text-amber-500 p-3 rounded-xl">
                  <CloudSun className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-semibold text-slate-400 font-poppins">Lagos Weather</span>
                  <span className="block font-montserrat font-bold text-lg text-primary dark:text-white">31°C Sunny</span>
                  <span className="block text-[10px] text-slate-400 font-poppins">Optimal for school visits today</span>
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm flex items-center gap-4">
                <div className="bg-slate-100 dark:bg-slate-800 text-primary dark:text-gold p-3 rounded-xl">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-semibold text-slate-400 font-poppins">Visitor Hours</span>
                  <span className="block font-montserrat font-bold text-base text-primary dark:text-white">Mon - Fri: 8am - 4pm</span>
                  <span className="block text-[10px] text-slate-400 font-poppins">Closed on public holidays</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Integration button */}
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-poppins font-bold text-sm w-full py-4 rounded-2xl shadow-md transition-all hover:scale-[1.01] cursor-pointer"
            >
              <MessageCircle className="h-5 w-5 fill-white text-emerald-500" />
              Chat Live on WhatsApp
            </button>
          </div>

          {/* Right Column: Enquiry Form */}
          <div className="space-y-6">
            <h2 className="font-montserrat font-extrabold text-2xl text-primary dark:text-white">Submit An Enquiry</h2>
            
            <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-8 rounded-2xl shadow-sm space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Chief Adebayo"
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. parent@email.com"
                    className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. +234..."
                    className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Enquiry Subject
                </label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                >
                  <option value="ADMISSION_ENQUIRY">Admission Enquiry</option>
                  <option value="FEES_BILLING">Fees & Billing</option>
                  <option value="VACANCY_CAREERS">Careers & Vacancies</option>
                  <option value="SPONSORSHIP_PARTNERSHIP">Sponsorships & Partnerships</option>
                  <option value="GENERAL_FEEDBACK">General Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Your Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help you today?"
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="bg-primary dark:bg-gold text-white dark:text-slate-900 font-poppins font-bold text-sm w-full py-3.5 rounded-xl shadow-md transition-all hover:bg-primary-light dark:hover:bg-gold-dark hover:scale-[1.01] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                Send Enquiry
                <Send className="h-4 w-4" />
              </button>

              {submitted && (
                <div className="bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl p-4 text-xs font-poppins text-center animate-pulse">
                  Your message has been sent successfully. We will reply to your email address within 24 hours.
                </div>
              )}
            </form>
          </div>

        </div>
      </section>

      {/* Simulated Map */}
      <section className="bg-slate-200 dark:bg-dark-bg h-96 transition-colors border-t border-slate-200 dark:border-dark-border relative flex items-center justify-center">
        <div className="absolute inset-0 bg-slate-950 opacity-10 pointer-events-none" />
        <div className="relative z-10 text-center space-y-2">
          <MapPin className="h-10 w-10 text-primary dark:text-gold mx-auto animate-bounce" />
          <h4 className="font-montserrat font-bold text-lg text-primary dark:text-white">High IQ Montessori Campus Location</h4>
          <p className="text-slate-500 dark:text-slate-400 font-poppins text-xs">
            Ikorodu Benson Area, Lagos State, Nigeria. GPS coordinates: 6.6186° N, 3.5029° E.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
