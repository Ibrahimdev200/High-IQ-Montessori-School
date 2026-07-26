'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DollarSign, FileText, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function FinanceDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // New Invoice form states
  const [students, setStudents] = useState<any[]>([]);
  const [targetStudent, setTargetStudent] = useState('');
  const [invoiceTitle, setInvoiceTitle] = useState('Primary 5 Tuition Fees - 2nd Term');
  const [invoiceAmount, setInvoiceAmount] = useState('250000');
  const [dueDate, setDueDate] = useState('2027-01-10');
  const [invoiceStatus, setInvoiceStatus] = useState('');

  const fetchStats = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/finance/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
    
    // Fetch students list for invoice assignment dropdown
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/students', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStudents(data);
          if (data.length > 0) setTargetStudent(data[0].id);
        }
      });
  }, [token]);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStudent) return;
    setInvoiceStatus('Logging invoice bill...');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/finance/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: targetStudent,
          title: invoiceTitle,
          amount: Number(invoiceAmount),
          dueDate
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setInvoiceStatus('Invoice created successfully!');
      fetchStats();
      setTimeout(() => setInvoiceStatus(''), 5000);
    } catch (err: any) {
      setInvoiceStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 font-poppins">
      
      {/* Overview stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Total Billed Invoices</span>
            <span className="block text-2xl font-extrabold text-primary dark:text-gold mt-2">
              ₦{stats.revenueSummary.totalInvoiced.toLocaleString()}
            </span>
          </div>
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Total Cash Collected</span>
            <span className="block text-2xl font-extrabold text-emerald-500 mt-2">
              ₦{stats.revenueSummary.totalCollected.toLocaleString()}
            </span>
          </div>
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Outstanding Arrears</span>
            <span className="block text-2xl font-extrabold text-amber-500 mt-2">
              ₦{stats.revenueSummary.totalOutstanding.toLocaleString()}
            </span>
          </div>
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm">
            <span className="block text-[10px] uppercase font-bold text-slate-400">Monthly Payroll Ledger</span>
            <span className="block text-2xl font-extrabold text-primary dark:text-gold mt-2">
              ₦{stats.payrollSummary.monthlyPayroll.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Create Invoice Form (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm border-b border-slate-100 dark:border-dark-border pb-3">
            <FileText className="h-4 w-4 text-gold" />
            Issue Student Tuition Invoice
          </div>

          <form onSubmit={handleCreateInvoice} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Assign to Student
              </label>
              <select
                value={targetStudent}
                onChange={(e) => setTargetStudent(e.target.value)}
                className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.user.name} ({st.admissionNo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Invoice Title
              </label>
              <input
                type="text"
                required
                value={invoiceTitle}
                onChange={(e) => setInvoiceTitle(e.target.value)}
                className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  required
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(e.target.value)}
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Due Date
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-primary dark:bg-gold text-white dark:text-slate-900 font-bold text-xs w-full py-3.5 rounded-xl shadow-md hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
            >
              Log Bill Invoice
            </button>

            {invoiceStatus && (
              <div className="bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs p-3.5 rounded-xl font-semibold text-center animate-pulse">
                {invoiceStatus}
              </div>
            )}
          </form>
        </div>

        {/* Expenses List (7 cols) */}
        {stats && (
          <div className="lg:col-span-7 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm border-b border-slate-100 dark:border-dark-border pb-3">
              <TrendingUp className="h-4 w-4 text-gold" />
              School Operations Expenditure Ledger
            </div>

            <div className="space-y-4">
              {stats.expenses.map((exp: any) => (
                <div key={exp.id} className="border border-slate-200 dark:border-dark-border p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-xs text-primary dark:text-white">{exp.description}</h5>
                    <span className="block text-[10px] text-slate-400 mt-1">{exp.category} • {exp.date}</span>
                  </div>
                  <span className="font-bold text-rose-500 text-xs">
                    -₦{exp.amount.toLocaleString()}
                  </span>
                </div>
              ))}

              <div className="bg-slate-50 dark:bg-dark-bg/60 p-4 rounded-xl flex justify-between items-center border border-slate-200 dark:border-dark-border">
                <span className="font-bold text-xs text-primary dark:text-white">Net Operations Cashflow</span>
                <span className={`font-bold text-sm ${stats.netCashFlow >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  ₦{stats.netCashFlow.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
