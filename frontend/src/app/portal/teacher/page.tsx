'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList, PlusCircle, Sparkles, BookOpen, Send, Bot, Check } from 'lucide-react';

export default function TeacherDashboard() {
  const { token } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Grade states
  const [selectedStudent, setSelectedStudent] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [ca1, setCa1] = useState('15');
  const [ca2, setCa2] = useState('15');
  const [exam, setExam] = useState('50');
  const [term, setTerm] = useState('1st Term');
  const [session, setSession] = useState('2025/2026');
  const [gradeStatus, setGradeStatus] = useState('');

  // AI Lesson notes states
  const [lessonClass, setLessonClass] = useState('Primary 5');
  const [lessonSubject, setLessonSubject] = useState('Mathematics');
  const [lessonTopic, setLessonTopic] = useState('Simple Equations');
  const [lessonObjectives, setLessonObjectives] = useState('Understand how to solve for an unknown variable x.');
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [generatingPlan, setGeneratingPlan] = useState(false);

  // CBT creation states
  const [cbtTitle, setCbtTitle] = useState('Mathematics Term Quiz');
  const [cbtClass, setCbtClass] = useState('Primary 5');
  const [cbtDuration, setCbtDuration] = useState('15');
  const [cbtStatus, setCbtStatus] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/students', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
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
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  // Submit Grade handler
  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGradeStatus('Saving grade and generating AI comments...');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/grades/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: selectedStudent,
          subject,
          ca1: Number(ca1),
          ca2: Number(ca2),
          exam: Number(exam),
          term,
          session
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setGradeStatus(`Success: Grade saved! AI Comment: "${data.grade.aiComment}"`);
      setTimeout(() => setGradeStatus(''), 8000);
    } catch (err: any) {
      setGradeStatus(`Error: ${err.message}`);
    }
  };

  // AI Lesson note planner handler
  const handleGenerateLessonPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratingPlan(true);
    setGeneratedPlan('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/ai/lesson-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          className: lessonClass,
          subject: lessonSubject,
          topic: lessonTopic,
          objectives: lessonObjectives
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setGeneratedPlan(data.lessonPlan);
    } catch (err: any) {
      setGeneratedPlan(`Failed to generate: ${err.message}`);
    } finally {
      setGeneratingPlan(false);
    }
  };

  // Schedule CBT Quiz
  const handleCreateCBT = async (e: React.FormEvent) => {
    e.preventDefault();
    setCbtStatus('Scheduling Exam...');
    try {
      const questions = [
        {
          id: 1,
          question: `What is the core formula to expand the lesson topic?`,
          options: ['A) Add values', 'B) Subtract coefficients', 'C) Multiply balances', 'D) Divide fractions'],
          correctAnswer: 'B'
        },
        {
          id: 2,
          question: `Which Montessori apparatus matches this subject?`,
          options: ['A) Golden counting beads', 'B) Sandpaper letters', 'C) Dressing frames', 'D) Cylinders'],
          correctAnswer: 'A'
        }
      ];

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/cbt/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: cbtTitle,
          subject: lessonSubject,
          className: cbtClass,
          duration: Number(cbtDuration),
          questions
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Instantly activate the exam for demo
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/cbt/exams/${data.exam.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'ACTIVE' })
      });

      setCbtStatus('CBT exam scheduled and ACTIVATED successfully!');
      setTimeout(() => setCbtStatus(''), 5000);
    } catch (err: any) {
      setCbtStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 font-poppins">
      
      {/* Overview stats */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-montserrat font-bold text-lg text-primary dark:text-white">Class Facilitator Board</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Log class diary worksheets, submit end-of-term academic performance lists, and run tests.
          </p>
        </div>
        <div className="bg-primary dark:bg-gold p-3 rounded-xl text-white dark:text-slate-900">
          <BookOpen className="h-6 w-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Submit Grades Form (7 columns) */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm border-b border-slate-100 dark:border-dark-border pb-3">
            <ClipboardList className="h-4 w-4 text-gold" />
            Submit Student Grades & Compile Report Card
          </div>

          <form onSubmit={handleGradeSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Select Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.user.name} ({st.admissionNo})
                    </option>
                  ))}
                  {students.length === 0 && <option>Loading students...</option>}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="English Language">English Language</option>
                  <option value="Quantitative Reasoning">Quantitative Reasoning</option>
                  <option value="STEM Robotics">STEM Robotics</option>
                  <option value="Bilingual French">Bilingual French</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  CA 1 (Max 20)
                </label>
                <input
                  type="number"
                  max={20}
                  required
                  value={ca1}
                  onChange={(e) => setCa1(e.target.value)}
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  CA 2 (Max 20)
                </label>
                <input
                  type="number"
                  max={20}
                  required
                  value={ca2}
                  onChange={(e) => setCa2(e.target.value)}
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Exam (Max 60)
                </label>
                <input
                  type="number"
                  max={60}
                  required
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Academic Term
                </label>
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                >
                  <option value="1st Term">1st Term</option>
                  <option value="2nd Term">2nd Term</option>
                  <option value="3rd Term">3rd Term</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Session
                </label>
                <input
                  type="text"
                  required
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  placeholder="2025/2026"
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-primary dark:bg-gold text-white dark:text-slate-900 font-bold text-xs w-full py-3.5 rounded-xl shadow-md transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              Compile Score & Generate AI Comment
            </button>

            {gradeStatus && (
              <div className="bg-slate-50 border border-slate-200 dark:bg-dark-bg dark:border-dark-border text-slate-700 dark:text-slate-300 text-xs p-3.5 rounded-xl font-medium">
                {gradeStatus}
              </div>
            )}
          </form>
        </div>

        {/* Schedule CBT Quiz (5 columns) */}
        <div className="lg:col-span-5 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm border-b border-slate-100 dark:border-dark-border pb-3">
            <PlusCircle className="h-4 w-4 text-gold" />
            Schedule & Publish CBT Quiz
          </div>

          <form onSubmit={handleCreateCBT} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                CBT Quiz Title
              </label>
              <input
                type="text"
                required
                value={cbtTitle}
                onChange={(e) => setCbtTitle(e.target.value)}
                placeholder="e.g. Simple Equations Homework"
                className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Target Class
                </label>
                <input
                  type="text"
                  required
                  value={cbtClass}
                  onChange={(e) => setCbtClass(e.target.value)}
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  required
                  value={cbtDuration}
                  onChange={(e) => setCbtDuration(e.target.value)}
                  className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-primary dark:bg-gold text-white dark:text-slate-900 font-bold text-xs w-full py-3.5 rounded-xl shadow-md transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              Publish Test Instantly
            </button>

            {cbtStatus && (
              <div className="bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs p-3.5 rounded-xl font-semibold text-center animate-pulse">
                {cbtStatus}
              </div>
            )}
          </form>
        </div>

      </div>

      {/* AI Lesson planner panel */}
      <div id="ai-planner" className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm border-b border-slate-100 dark:border-dark-border pb-3">
          <Bot className="h-4 w-4 text-gold" />
          AI Lesson Note Planner (Montessori Hybrid Style)
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <form onSubmit={handleGenerateLessonPlan} className="lg:col-span-4 space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Class Grade
              </label>
              <input
                type="text"
                required
                value={lessonClass}
                onChange={(e) => setLessonClass(e.target.value)}
                className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                required
                value={lessonSubject}
                onChange={(e) => setLessonSubject(e.target.value)}
                className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Topic Objectives
              </label>
              <input
                type="text"
                required
                value={lessonTopic}
                onChange={(e) => setLessonTopic(e.target.value)}
                className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Specific Learning Objectives
              </label>
              <textarea
                required
                rows={3}
                value={lessonObjectives}
                onChange={(e) => setLessonObjectives(e.target.value)}
                className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={generatingPlan}
              className="bg-primary dark:bg-gold text-white dark:text-slate-900 font-bold text-xs w-full py-3.5 rounded-xl shadow-md transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {generatingPlan ? 'Generating lesson model...' : 'Draft Montessori Lesson Plan'}
            </button>
          </form>

          {/* Results Render Area */}
          <div className="lg:col-span-8 bg-slate-50 dark:bg-dark-bg/60 border border-slate-200 dark:border-dark-border p-6 rounded-2xl max-h-[380px] overflow-y-auto">
            {generatedPlan ? (
              <pre className="text-[11px] text-slate-800 dark:text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                {generatedPlan}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 gap-2">
                <Bot className="h-8 w-8 text-slate-300 animate-pulse" />
                <span className="text-xs">Fill out the parameters and trigger the generator to prepare structured lesson notes instantly.</span>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
