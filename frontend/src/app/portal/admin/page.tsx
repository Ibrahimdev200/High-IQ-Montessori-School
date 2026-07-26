'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Settings, Sliders, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<any[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [status, setStatus] = useState('');

  const fetchSettings = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/settings')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setSettings(data); });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpsertSetting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey || !newValue) return;
    setStatus('Saving setting parameter...');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ key: newKey, value: newValue })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStatus('Parameter saved successfully!');
      setNewKey('');
      setNewValue('');
      fetchSettings();
      setTimeout(() => setStatus(''), 5000);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  const auditLogs = [
    { user: 'admin@highiq.edu.ng', action: 'CREATE_STUDENT', details: 'Adebayo Oluwaseun (HIQ-STUD-2026-0042)', time: '2026-07-25 12:44' },
    { user: 'teacher@highiq.edu.ng', action: 'SUBMIT_GRADES', details: 'Adebayo Oluwaseun - English: 79%', time: '2026-07-25 13:02' },
    { user: 'finance@highiq.edu.ng', action: 'RECORD_PAYMENT', details: 'Invoice Primary 5 Tuition - ₦100,000', time: '2026-07-25 13:15' },
    { user: 'admin@highiq.edu.ng', action: 'UPSERT_SETTINGS', details: 'school_name = High IQ Montessori School', time: '2026-07-25 13:30' },
  ];

  return (
    <div className="space-y-8 font-poppins">
      
      {/* Overview stats */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-montserrat font-bold text-lg text-primary dark:text-white">Admin Control Desk</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Re-configure backend integrations, manage role permissions profiles, and inspect system audit files.
          </p>
        </div>
        <div className="bg-primary dark:bg-gold p-3 rounded-xl text-white dark:text-slate-900">
          <Shield className="h-6 w-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Settings manager (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm border-b border-slate-100 dark:border-dark-border pb-3">
            <Settings className="h-4 w-4 text-gold" />
            Branding & Calendar Settings
          </div>

          <div className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-dark-border">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-dark-border text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 uppercase">
                  <tr>
                    <th className="px-4 py-3">Parameter Key</th>
                    <th className="px-4 py-3">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-dark-border text-slate-600 dark:text-slate-400 bg-white dark:bg-dark-card">
                  {settings.map((set) => (
                    <tr key={set.id}>
                      <td className="px-4 py-3 font-semibold text-primary dark:text-gold font-mono">{set.key}</td>
                      <td className="px-4 py-3">{set.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <form onSubmit={handleUpsertSetting} className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 dark:border-dark-border pt-4">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Key (e.g. school_phone)"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <input
                  type="text"
                  required
                  placeholder="Value (e.g. +234...)"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="bg-primary dark:bg-gold text-white dark:text-slate-900 font-bold text-xs py-2.5 rounded-xl hover:scale-102 transition-transform cursor-pointer"
              >
                Set Value
              </button>
            </form>

            {status && (
              <div className="bg-slate-50 border border-slate-200 dark:bg-dark-bg dark:border-dark-border text-slate-700 dark:text-slate-300 text-xs p-3 rounded-xl font-medium text-center">
                {status}
              </div>
            )}
          </div>
        </div>

        {/* Audit Log (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm border-b border-slate-100 dark:border-dark-border pb-3">
            <Sliders className="h-4 w-4 text-gold" />
            Security Audit Trail Logs
          </div>

          <div className="space-y-4">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-slate-500">{log.user}</span>
                  <span className="font-mono text-slate-400">{log.time}</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1.5">
                  <span className="font-bold text-primary dark:text-gold text-[11px]">{log.action}</span>
                  <span className="text-slate-600 dark:text-slate-400 max-w-[65%] truncate text-right font-medium">{log.details}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
