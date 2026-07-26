'use client';

import React, { useState } from 'react';
import { Calendar, FileText, CheckCircle2, DollarSign, Clock, HelpCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Admissions() {
  const [formData, setFormData] = useState({
    childName: '',
    dob: '',
    gender: 'MALE',
    targetClass: 'Nursery 1',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    previousSchool: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.childName && formData.guardianName && formData.guardianEmail) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          childName: '',
          dob: '',
          gender: 'MALE',
          targetClass: 'Nursery 1',
          guardianName: '',
          guardianPhone: '',
          guardianEmail: '',
          previousSchool: '',
        });
      }, 5000);
    }
  };

  const steps = [
    { title: '1. Online Application', desc: 'Complete the enquiry details below or chat with the AI helper.' },
    { title: '2. Document Submission', desc: 'Upload previous academic reports, birth certificates, and vaccination history.' },
    { title: '3. Student Evaluation', desc: 'A friendly physical diagnostic interview to gauge cognitive reading and logic milestones.' },
    { title: '4. Offer & Acceptance', desc: 'Secure the vacancy seat by paying the non-refundable registration levy.' },
  ];

  const feeStructure = [
    { grade: 'Creche & Playgroup', tuition: '₦220,000 / term', books: '₦35,000', uniforms: '₦25,000' },
    { grade: 'Nursery & Kindergarten', tuition: '₦250,000 / term', books: '₦40,000', uniforms: '₦25,000' },
    { grade: 'Primary School (1-6)', tuition: '₦280,000 / term', books: '₦45,000', uniforms: '₦30,000' },
    { grade: 'Secondary College (7-12)', tuition: '₦350,000 / term', books: '₦60,000', uniforms: '₦30,000' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Subpage Header Banner */}
      <section className="bg-primary text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-primary-light/10 to-transparent pointer-events-none" />
        <h1 className="font-montserrat font-bold text-3xl sm:text-5xl">Admissions & Enrollments</h1>
        <p className="text-slate-300 font-poppins text-xs sm:text-sm mt-3 uppercase tracking-widest text-gold font-semibold">
          Secure Your Ward’s Seat
        </p>
      </section>

      {/* Steps & Timeline */}
      <section className="py-20 bg-cream dark:bg-dark-bg transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-montserrat font-extrabold text-3xl text-primary dark:text-white">Admission Process</h2>
            <p className="text-slate-600 dark:text-slate-400 font-poppins text-sm mt-3">
              Four easy steps to secure admission at High IQ Montessori School.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((st, idx) => (
              <div key={idx} className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-100 dark:border-dark-border shadow-sm">
                <h4 className="font-montserrat font-bold text-base text-primary dark:text-gold mb-3">{st.title}</h4>
                <p className="text-slate-600 dark:text-slate-400 font-poppins text-xs leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fees & Scholarship Panel */}
      <section className="py-20 bg-white dark:bg-dark-card transition-colors border-y border-slate-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column: Fees table */}
            <div>
              <h2 className="font-montserrat font-extrabold text-2xl text-primary dark:text-white mb-6">Termly Fee Structure</h2>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-dark-border">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-dark-border font-poppins text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase">
                    <tr>
                      <th className="px-4 py-3">Grade Level</th>
                      <th className="px-4 py-3">Tuition Fee</th>
                      <th className="px-4 py-3">Books & Materials</th>
                      <th className="px-4 py-3">Uniforms (Once)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-dark-border text-slate-600 dark:text-slate-400 bg-white dark:bg-dark-card">
                    {feeStructure.map((fee, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-4 font-semibold text-primary dark:text-white">{fee.grade}</td>
                        <td className="px-4 py-4">{fee.tuition}</td>
                        <td className="px-4 py-4">{fee.books}</td>
                        <td className="px-4 py-4">{fee.uniforms}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-500 font-poppins mt-3 italic">
                * Note: Tuition fees include access to digital coding software and robotic lab apparatuses. Boarding/Hostel and school bus services attract auxiliary charges.
              </p>
            </div>

            {/* Right Column: Scholarship & Admissions timeline */}
            <div className="flex flex-col justify-center gap-6">
              <div className="bg-slate-50 dark:bg-dark-bg/60 p-6 rounded-2xl border border-slate-100 dark:border-dark-border flex gap-4">
                <div className="bg-gold text-slate-900 p-2.5 rounded-xl h-fit">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-montserrat font-bold text-base text-primary dark:text-white">Admissions Timeline</h4>
                  <p className="text-slate-600 dark:text-slate-400 font-poppins text-xs leading-relaxed mt-2">
                    - **Application Window:** Open until Sept 5th, 2026. <br />
                    - **Assessment Dates:** Every Saturday in August (9:00 AM – 1:00 PM). <br />
                    - **Academic Session Resumption:** Monday, Sept 14th, 2026.
                  </p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-dark-bg/60 p-6 rounded-2xl border border-slate-100 dark:border-dark-border flex gap-4">
                <div className="bg-gold text-slate-900 p-2.5 rounded-xl h-fit">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-montserrat font-bold text-base text-primary dark:text-white">Scholarships & Installment Plans</h4>
                  <p className="text-slate-600 dark:text-slate-400 font-poppins text-xs leading-relaxed mt-2">
                    - **Sibling Discounts:** 5% reduction on tuition fee for 2nd child; 10% for 3rd or more. <br />
                    - **Installments:** 60% upon resumption, 40% prior to midterm exams. <br />
                    - **Academic Scholarship:** Up to 50% tuition waiver for the highest-performing student in the annual CBT entrance test.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Online Application Form */}
      <section className="py-20 bg-cream dark:bg-dark-bg transition-colors">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-extrabold text-3xl text-primary dark:text-white">Online Enrollment Enquiry</h2>
            <p className="text-slate-600 dark:text-slate-400 font-poppins text-sm mt-3">
              Fill the form below to receive a customized prospectus and booking invite for assessments.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-8 sm:p-10 rounded-2xl shadow-sm space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Child's Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.childName}
                  onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                  placeholder="e.g. Oluwaseun Adebayo"
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Target Class Entry
                </label>
                <select
                  value={formData.targetClass}
                  onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                >
                  <option value="Creche">Creche (3-12 months)</option>
                  <option value="Playgroup">Playgroup (1-2 years)</option>
                  <option value="Nursery 1">Nursery 1 (3 years)</option>
                  <option value="Nursery 2">Nursery 2 (4 years)</option>
                  <option value="Primary 1">Primary 1 (5-6 years)</option>
                  <option value="Primary 5">Primary 5 (9-10 years)</option>
                  <option value="JSS 1">Junior Secondary College 1</option>
                  <option value="SSS 1">Senior Secondary College 1</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Guardian Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  placeholder="e.g. Chief Adebayo"
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Guardian Phone
                </label>
                <input
                  type="tel"
                  required
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  placeholder="e.g. +234..."
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Guardian Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.guardianEmail}
                  onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                  placeholder="e.g. parent@email.com"
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Previous School Attended (If Any)
              </label>
              <input
                type="text"
                value={formData.previousSchool}
                onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                placeholder="e.g. Lagos Prep Academy"
                className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="bg-primary dark:bg-gold text-white dark:text-slate-900 font-poppins font-bold text-sm w-full py-4 rounded-xl shadow-md transition-all hover:bg-primary-light dark:hover:bg-gold-dark hover:scale-[1.01] active:scale-95 cursor-pointer"
            >
              Submit Application Enquiry
            </button>

            {submitted && (
              <div className="bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl p-4 text-xs font-poppins text-center animate-bounce">
                Your application query has been received successfully! Our admissions officer will email you the prospectus and confirmation details shortly.
              </div>
            )}

          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
