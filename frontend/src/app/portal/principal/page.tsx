'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList, ShieldAlert, Award, Sparkles, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

export default function PrincipalDashboard() {
  const { token } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  
  // AI analysis states
  const [selectedStudent, setSelectedStudent] = useState('');
  const [aiReport, setAiReport] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [approveStatus, setApproveStatus] = useState('');

  useEffect(() => {
    // Fetch students list
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/students', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStudents(data);
          if (data.length > 0) {
            setSelectedStudent(data[0].id);
          }
        }
      })
      .catch(err => console.error(err));

    // Fetch outstanding unapproved grades
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/finance/invoices', { // Just to check if endpoint is running
      headers: { 'Authorization': `Bearer ${token}` }
    }).catch(err => console.error(err));
  }, [token]);

  const handleApproveGrades = async () => {
    if (!selectedStudent) return;
    setApproveStatus('Approving student report card grades...');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/grades/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: selectedStudent,
          term: '1st Term',
          session: '2025/2026'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setApproveStatus('Success: Student grades approved and published to Parent Portal!');
      setTimeout(() => setApproveStatus(''), 5000);
    } catch (err: any) {
      setApproveStatus(`Error: ${err.message}`);
    }
  };

  const handleTriggerAI = async () => {
    if (!selectedStudent) return;
    setAnalyzing(true);
    setAiReport(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/ai/predict/${selectedStudent}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAiReport(data);
    } catch (err: any) {
      alert(`AI Error: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 font-poppins">
      
      {/* Welcome header */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-montserrat font-bold text-lg text-primary dark:text-white">Principal Administration Board</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Publish academic reports, compile cohort analytics, and invoke AI risk predictors.
          </p>
        </div>
        <div className="bg-primary dark:bg-gold p-3 rounded-xl text-white dark:text-slate-900">
          <Award className="h-6 w-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Approve Report Card Panel (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm border-b border-slate-100 dark:border-dark-border pb-3">
            <CheckCircle2 className="h-4 w-4 text-gold" />
            Academic Review & Approval Board
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Select Student Cohort
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.user.name} ({st.admissionNo}) - {st.class}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleApproveGrades}
              className="bg-primary dark:bg-gold text-white dark:text-slate-900 font-bold text-xs w-full py-3.5 rounded-xl shadow-md hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              Approve & Release Report Cards
            </button>

            {approveStatus && (
              <div className="bg-slate-50 border border-slate-200 dark:bg-dark-bg dark:border-dark-border text-slate-700 dark:text-slate-300 text-xs p-3.5 rounded-xl font-medium text-center">
                {approveStatus}
              </div>
            )}
          </div>
        </div>

        {/* AI student analyzer (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm border-b border-slate-100 dark:border-dark-border pb-3">
            <Sparkles className="h-4 w-4 text-gold" />
            AI Student Performance Insights
          </div>

          <div className="space-y-4">
            <button
              onClick={handleTriggerAI}
              disabled={analyzing}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold w-full py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {analyzing ? 'Analyzing academic parameters...' : 'Run AI Analysis & Risk Prediction'}
            </button>

            {aiReport && (
              <div className="bg-slate-50 dark:bg-dark-bg/60 p-4 border border-slate-200 dark:border-dark-border rounded-xl space-y-3 text-xs leading-relaxed">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Cohort Academic Risk</span>
                  <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded mt-0.5 ${
                    aiReport.academicRisk === 'LOW'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/20 dark:text-rose-400'
                  }`}>
                    {aiReport.academicRisk} RISK
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Average Grade Score</span>
                  <span className="block font-bold text-slate-700 dark:text-slate-300">{aiReport.averageScore}%</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Predicted Attendance Rate</span>
                  <span className="block font-bold text-slate-700 dark:text-slate-300">{aiReport.predictedAttendance}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Montessori Matching Styles</span>
                  <span className="block font-bold text-slate-700 dark:text-slate-300">{aiReport.learningStyleRecommendation}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-slate-400">AI Pedagogical Advice</span>
                  <p className="text-slate-600 dark:text-slate-400 mt-1 text-[11px] leading-relaxed">
                    {aiReport.aiInsights}
                  </p>
                </div>
              </div>
            )}

            {!aiReport && !analyzing && (
              <div className="text-center text-xs text-slate-400 py-8">
                Select a student on the left and click above to parse grades through the prediction model.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
