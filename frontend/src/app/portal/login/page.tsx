'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Lock, Mail, ArrowRight, Sun, Moon } from 'lucide-react';
import Link from 'next/link';

export default function PortalLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingForm, setLoadingForm] = useState(false);
  const router = useRouter();
  const { login, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(`/portal/${user.role.toLowerCase()}`);
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoadingForm(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      login(data.token, data.user);
      router.push(`/portal/${data.user.role.toLowerCase()}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Connection refused. Check that backend server is running.');
    } finally {
      setLoadingForm(false);
    }
  };

  const seedAccounts = [
    { role: 'Admin', email: 'admin@highiq.edu.ng' },
    { role: 'Principal', email: 'principal@highiq.edu.ng' },
    { role: 'Teacher', email: 'teacher@highiq.edu.ng' },
    { role: 'Student', email: 'student@highiq.edu.ng' },
    { role: 'Parent', email: 'parent@highiq.edu.ng' },
    { role: 'Finance', email: 'finance@highiq.edu.ng' },
    { role: 'HR Manager', email: 'hr@highiq.edu.ng' },
    { role: 'Librarian', email: 'librarian@highiq.edu.ng' },
    { role: 'Clinic Nurse', email: 'clinic@highiq.edu.ng' },
    { role: 'Transport', email: 'transport@highiq.edu.ng' },
  ];

  const fillCredentials = (accEmail: string) => {
    setEmail(accEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-poppins">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />

      {/* Main Card Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Side: Form (7 columns) */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-8 sm:p-10 rounded-3xl shadow-2xl flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-xl text-gold">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <span className="font-montserrat font-bold text-sm tracking-tight text-primary dark:text-white">HIGH IQ</span>
                  <span className="block text-[9px] font-medium tracking-widest text-gold uppercase -mt-1 font-poppins">Montessori School</span>
                </div>
              </Link>
              <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors">
                Back to Website
              </Link>
            </div>

            <h2 className="font-montserrat font-extrabold text-2xl text-slate-900 dark:text-white">Portal Sign In</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Access your customized dashboard by signing in with your registered email credential.
            </p>

            <form onSubmit={handleLogin} className="space-y-5 mt-8">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@highiq.edu.ng"
                    className="bg-slate-50 dark:bg-dark-bg text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Secure Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-slate-50 dark:bg-dark-bg text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-xl text-center font-medium">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loadingForm}
                className="bg-primary dark:bg-gold text-white dark:text-slate-900 font-bold text-sm w-full py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer disabled:opacity-55"
              >
                {loadingForm ? 'Authenticating...' : 'Sign In'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className="mt-8 text-center text-[10px] text-slate-400">
            For security, do not share credentials. High IQ security logs active logins by IP and timestamp.
          </div>
        </div>

        {/* Right Side: Demo Seed Acc Panel (5 columns) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col">
          <h3 className="font-montserrat font-bold text-base text-gold mb-1">ERP Demo Accounts</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-6">
            Click any account below to instantly pre-fill the login form for testing that specific dashboard role (default password: <code className="text-gold">password123</code>).
          </p>

          <div className="flex-1 overflow-y-auto max-h-[300px] lg:max-h-none space-y-2 pr-2">
            {seedAccounts.map((acc) => (
              <button
                key={acc.email}
                onClick={() => fillCredentials(acc.email)}
                className="w-full text-left bg-slate-800 hover:bg-slate-700/60 p-3 rounded-xl border border-slate-700/40 hover:border-gold transition-all text-xs flex justify-between items-center group cursor-pointer"
              >
                <div>
                  <span className="block font-bold text-slate-200">{acc.role}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">{acc.email}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
