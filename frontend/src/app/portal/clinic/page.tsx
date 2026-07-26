'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Activity, PlusCircle } from 'lucide-react';

export default function ClinicDashboard() {
  const { token } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [targetStudent, setTargetStudent] = useState('');
  const [symptoms, setSymptoms] = useState('Body temperature of 38.5C');
  const [diagnosis, setDiagnosis] = useState('Mild Malaria symptoms');
  const [treatment, setTreatment] = useState('Administered 5ml Coartem syrup, bed rest.');
  const [status, setStatus] = useState('');

  const fetchRecords = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/clinic/records', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setRecords(data); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecords();

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

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStudent) return;
    setStatus('Logging medical entry...');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/clinic/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: targetStudent,
          symptoms,
          diagnosis,
          treatment,
          date: new Date().toISOString().split('T')[0],
          nurseName: 'Nurse Funmi Coker'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStatus('Medical record logged successfully!');
      fetchRecords();
      setTimeout(() => setStatus(''), 5000);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 font-poppins">
      
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-montserrat font-bold text-lg text-primary dark:text-white">Campus Medical Center</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Maintain immunization catalogs, drug inventory lists, and log student triage check-ins.
          </p>
        </div>
        <div className="bg-primary dark:bg-gold p-3 rounded-xl text-white dark:text-slate-900">
          <Activity className="h-6 w-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Medical records logs list (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm border-b border-slate-100 dark:border-dark-border pb-3">
            <Activity className="h-4 w-4 text-gold" />
            Triage & Treatment Logs
          </div>

          <div className="space-y-4">
            {records.map((rec) => (
              <div key={rec.id} className="border border-slate-200 dark:border-dark-border p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>Student: <strong className="text-primary dark:text-gold">{rec.student.user.name}</strong></span>
                  <span>Date: {rec.date}</span>
                </div>
                <div className="text-xs space-y-1">
                  <p><strong className="text-slate-500">Symptoms:</strong> {rec.symptoms}</p>
                  <p><strong className="text-slate-500">Diagnosis:</strong> {rec.diagnosis}</p>
                  <p><strong className="text-slate-500">Treatment:</strong> {rec.treatment}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Facilitating Nurse: {rec.nurseName}</p>
                </div>
              </div>
            ))}

            {records.length === 0 && (
              <div className="text-center text-xs text-slate-400 py-12">
                No clinical records logged in database today.
              </div>
            )}
          </div>
        </div>

        {/* Add Medical Record Form (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm border-b border-slate-100 dark:border-dark-border pb-3">
            <PlusCircle className="h-4 w-4 text-gold" />
            Log Triage Incident
          </div>

          <form onSubmit={handleCreateRecord} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Select Student
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
                Symptoms Description
              </label>
              <input
                type="text"
                required
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Diagnosis
              </label>
              <input
                type="text"
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Treatment Administered
              </label>
              <textarea
                required
                rows={3}
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-primary dark:bg-gold text-white dark:text-slate-900 font-bold text-xs w-full py-3.5 rounded-xl shadow-md hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
            >
              Log Incident Record
            </button>

            {status && (
              <div className="bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[10px] p-3 rounded-xl font-semibold text-center animate-pulse">
                {status}
              </div>
            )}
          </form>
        </div>

      </div>

    </div>
  );
}
