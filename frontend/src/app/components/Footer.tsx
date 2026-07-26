'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Mail, Phone, MapPin, Send, Download } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // If path starts with /portal, we don't render the public footer
  if (pathname?.startsWith('/portal')) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-primary text-white border-t border-slate-800 dark:border-dark-border mt-auto pt-16 pb-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl text-primary">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <span className="font-montserrat font-bold text-lg tracking-tight">HIGH IQ</span>
              <span className="block text-[10px] font-medium tracking-widest text-gold uppercase -mt-1 font-poppins">
                Montessori School
              </span>
            </div>
          </div>
          <p className="text-slate-300 font-poppins text-xs leading-relaxed mt-2">
            Pioneering student-centered education in Ikorodu. Combining Montessori principles with British & Nigerian curricula for global excellence.
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center gap-2 text-slate-300 text-xs">
              <MapPin className="h-4 w-4 text-gold flex-shrink-0" />
              <span>123 High IQ Avenue, Ikorodu, Lagos State, Nigeria</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-xs">
              <Phone className="h-4 w-4 text-gold flex-shrink-0" />
              <span>0803 123 4567, 0812 345 6789</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-xs">
              <Mail className="h-4 w-4 text-gold flex-shrink-0" />
              <span>info@highiqmontessori.edu.ng</span>
            </div>
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="font-montserrat font-bold text-base text-gold tracking-wide mb-6">Quick Links</h4>
          <ul className="flex flex-col gap-3 text-xs font-poppins text-slate-300">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/academics" className="hover:text-white transition-colors">Academics</Link></li>
            <li><Link href="/admissions" className="hover:text-white transition-colors">Admissions Portal</Link></li>
            <li><Link href="/gallery" className="hover:text-white transition-colors">School Gallery</Link></li>
            <li><Link href="/news" className="hover:text-white transition-colors">News & Blog</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        {/* Resources / Downloads Column */}
        <div>
          <h4 className="font-montserrat font-bold text-base text-gold tracking-wide mb-6">Resource Center</h4>
          <ul className="flex flex-col gap-4 text-xs font-poppins text-slate-300">
            <li>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert('Downloading School Prospectus...'); }}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg border border-slate-700 transition-all group"
              >
                <Download className="h-4 w-4 text-gold group-hover:-translate-y-0.5 transition-transform" />
                <div>
                  <span className="block font-semibold">Download Prospectus</span>
                  <span className="block text-[10px] text-slate-400">PDF Guide • 4.2 MB</span>
                </div>
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert('Downloading Academic Calendar...'); }}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg border border-slate-700 transition-all group"
              >
                <Download className="h-4 w-4 text-gold group-hover:-translate-y-0.5 transition-transform" />
                <div>
                  <span className="block font-semibold">Academic Calendar</span>
                  <span className="block text-[10px] text-slate-400">2025/2026 Session</span>
                </div>
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription Column */}
        <div>
          <h4 className="font-montserrat font-bold text-base text-gold tracking-wide mb-6">Join Our Newsletter</h4>
          <p className="text-slate-300 font-poppins text-xs leading-relaxed mb-4">
            Stay updated with High IQ academic events, admission cycles, and student achievements.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              placeholder="Your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-800 text-white text-xs px-3 py-2.5 rounded-lg outline-none border border-slate-700 focus:border-gold w-full"
            />
            <button
              type="submit"
              className="bg-gold hover:bg-gold-dark text-slate-900 px-3 rounded-lg flex items-center justify-center transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          {subscribed && (
            <p className="text-gold text-[11px] font-semibold mt-2 animate-pulse">
              Thank you! You have subscribed successfully.
            </p>
          )}
        </div>
      </div>

      <hr className="border-slate-800 dark:border-dark-border my-12" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-poppins text-slate-400">
        <p>© {new Date().getFullYear()} High IQ Montessori School. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
