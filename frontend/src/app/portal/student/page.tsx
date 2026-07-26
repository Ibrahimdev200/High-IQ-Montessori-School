'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Award, BookOpen, Clock, Download, GraduationCap, QrCode } from 'lucide-react';

export default function StudentDashboard() {
  const { user, token } = useAuth();
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [grades, setGrades] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  
  // CBT Player states
  const [activeExam, setActiveExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any[]>([]); // [{ questionId, selected }]
  const [examResult, setExamResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examFinished, setExamFinished] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    // Fetch profile
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.user?.student) {
          setStudentProfile(data.user.student);
          // Fetch student grades
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/grades/student/${data.user.student.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
            .then(res => res.json())
            .then(grData => { if (Array.isArray(grData)) setGrades(grData); });

          // Fetch exams
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/cbt/exams/class/${data.user.student.class}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
            .then(res => res.json())
            .then(exData => { if (Array.isArray(exData)) setExams(exData); });
        }
      })
      .catch(err => console.error(err));
  }, [user, token]);

  // CBT countdown timer effect
  useEffect(() => {
    if (!activeExam || timeLeft <= 0 || examFinished) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [activeExam, timeLeft, examFinished]);

  const handleStartExam = async (examId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/cbt/exams/${examId}/start`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActiveExam(data);
      setQuestions(data.questions);
      setAnswers(data.questions.map((q: any) => ({ questionId: q.id, selected: '' })));
      setTimeLeft(data.duration * 60);
      setExamFinished(false);
      setExamResult(null);
    } catch (err: any) {
      alert(`Error loading test items: ${err.message}`);
    }
  };

  const handleSelectOption = (qId: number, optionLetter: string) => {
    setAnswers(prev =>
      prev.map(a => (a.questionId === qId ? { ...a, selected: optionLetter } : a))
    );
  };

  const handleSubmitExam = async () => {
    if (!activeExam || !studentProfile) return;
    setExamFinished(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/cbt/exams/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          examId: activeExam.id,
          studentId: studentProfile.id,
          answers
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setExamResult(data);
      // Reload grades list to show updated score if applicable
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/grades/student/${studentProfile.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(grData => { if (Array.isArray(grData)) setGrades(grData); });
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    }
  };

  const getPDFReportCard = () => {
    if (!studentProfile) return;
    // Download report card trigger
    window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/grades/report-card/${studentProfile.id}?term=1st Term&session=2025/2026`, '_blank');
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 font-poppins">
      
      {/* Upper info row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile / ID badge */}
        {studentProfile && (
          <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm flex flex-col items-center text-center gap-4 relative overflow-hidden">
            {/* Ribbon */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gold" />
            
            <div className="bg-slate-100 dark:bg-slate-800 h-16 w-16 rounded-full flex items-center justify-center text-xl font-extrabold text-primary dark:text-gold uppercase mt-2">
              {user?.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-montserrat font-bold text-base text-primary dark:text-white">{user?.name}</h3>
              <span className="block text-[10px] font-bold text-gold uppercase tracking-wider mt-1">{studentProfile.class}</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">Adm No: {studentProfile.admissionNo}</span>
            </div>

            {/* QR block */}
            {studentProfile.qrCode && (
              <div className="border border-slate-100 dark:border-slate-800 p-2.5 rounded-xl bg-white flex flex-col items-center gap-1.5 shadow-inner mt-2">
                <img src={studentProfile.qrCode} alt="ID QR code" className="w-24 h-24" />
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <QrCode className="h-3 w-3 text-gold" />
                  QR Scan Attendance Ready
                </span>
              </div>
            )}
          </div>
        )}

        {/* Academic score summary cards */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-montserrat font-bold text-base text-primary dark:text-white">Continuous Assessment Score Sheet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Verify ongoing exam grades. Once grades are approved, click below to export your official terminal report card PDF.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {grades.map((g) => (
                <div key={g.id} className="bg-slate-50 dark:bg-dark-bg/60 border border-slate-200 dark:border-dark-border p-4 rounded-xl text-center">
                  <span className="block font-bold text-xs text-primary dark:text-white truncate">{g.subject}</span>
                  <span className="block text-2xl font-extrabold text-gold mt-1.5">{g.total}</span>
                  <span className="block text-[9px] text-slate-400 mt-0.5">{g.grade.split(' ')[0]}</span>
                </div>
              ))}
              {grades.length === 0 && (
                <div className="col-span-3 text-center text-xs text-slate-400 py-6">
                  No approved grades available in current term records.
                </div>
              )}
            </div>
          </div>

          {grades.length > 0 && (
            <button
              onClick={getPDFReportCard}
              className="bg-primary dark:bg-gold text-white dark:text-slate-900 font-poppins font-bold text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform cursor-pointer mt-6"
            >
              <Download className="h-4 w-4" />
              Download Terminal Report Card PDF
            </button>
          )}
        </div>

      </div>

      {/* CBT Exam Player Panel */}
      <div id="cbt" className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-dark-border pb-3">
          <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm">
            <Award className="h-4 w-4 text-gold" />
            Computer Based Testing (CBT) Engine
          </div>
          {activeExam && !examFinished && (
            <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-950/20 text-amber-600 px-4 py-1.5 rounded-full text-xs font-bold animate-pulse">
              <Clock className="h-3.5 w-3.5 animate-spin" />
              <span>Time Left: {formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        {/* 1. Exam Selection List */}
        {!activeExam && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Quizzes</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {exams.map((ex) => (
                <div key={ex.id} className="bg-slate-50 dark:bg-dark-bg/60 border border-slate-200 dark:border-dark-border p-5 rounded-2xl flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-sm text-primary dark:text-white">{ex.title}</h5>
                    <span className="block text-[10px] text-slate-400 mt-1">{ex.subject} • {ex.duration} Minutes</span>
                  </div>
                  <button
                    onClick={() => handleStartExam(ex.id)}
                    className="bg-primary dark:bg-gold text-white dark:text-slate-900 text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Start Test
                  </button>
                </div>
              ))}
              {exams.length === 0 && (
                <div className="col-span-2 text-center text-xs text-slate-400 py-12">
                  No active computer tests scheduled for your class entry today.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Active Test Panel */}
        {activeExam && !examFinished && (
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-dark-bg/60 p-4 rounded-xl border border-slate-200 dark:border-dark-border">
              <h4 className="font-bold text-base text-primary dark:text-white">{activeExam.title}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Please read questions carefully. Do not refresh current page.</p>
            </div>

            <div className="space-y-6">
              {questions.map((q, idx) => {
                const currentAns = answers.find(a => a.questionId === q.id)?.selected || '';
                return (
                  <div key={q.id} className="border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0">
                    <span className="font-bold text-xs text-slate-400">Question {idx + 1} of {questions.length}</span>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-2">{q.question}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      {q.options.map((opt: string) => {
                        const optLetter = opt.charAt(0); // A, B, C, D
                        const isSelected = currentAns === optLetter;
                        return (
                          <button
                            key={opt}
                            onClick={() => handleSelectOption(q.id, optLetter)}
                            className={`text-left p-3 rounded-xl border text-xs font-semibold transition-all ${
                              isSelected
                                ? 'bg-gold border-gold text-slate-900 font-bold scale-[1.01] shadow-sm'
                                : 'bg-white dark:bg-dark-card border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-300 hover:border-gold'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleSubmitExam}
              className="bg-primary dark:bg-gold text-white dark:text-slate-900 font-bold text-xs w-full py-4 rounded-xl shadow-md hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
            >
              Submit Examination Answers
            </button>
          </div>
        )}

        {/* 3. Result Summary Card */}
        {examFinished && examResult && (
          <div className="bg-slate-50 dark:bg-dark-bg/60 border border-slate-200 dark:border-dark-border p-8 rounded-2xl text-center max-w-lg mx-auto space-y-4 animate-in zoom-in-95 duration-200">
            <Award className="h-12 w-12 text-gold mx-auto" />
            <h4 className="font-montserrat font-extrabold text-xl text-primary dark:text-white">Exam Submission Received</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your test response answers were auto-graded by the High IQ assessment logic.
            </p>
            
            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-xl space-y-2">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Your Grade Score</span>
              <span className="block text-4xl font-extrabold text-gold">{examResult.score.toFixed(1)}%</span>
              <span className="block text-xs text-slate-500 mt-1">
                Correct answers: {examResult.totalCorrect} / {examResult.totalQuestions}
              </span>
            </div>

            <button
              onClick={() => {
                setActiveExam(null);
                setExamResult(null);
                setExamFinished(false);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white font-poppins font-bold text-xs py-2.5 px-6 rounded-xl mt-4"
            >
              Return to Quiz Dashboard
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
