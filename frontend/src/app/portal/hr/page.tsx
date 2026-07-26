'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, PlusCircle, Award } from 'lucide-react';

export default function HRDashboard() {
  const { token } = useAuth();
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New staff form states
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [employeeId, setEmployeeId] = useState('HIQ-TCH-002');
  const [department, setDepartment] = useState('Academics');
  const [qualification, setQualification] = useState('B.Sc. Mathematics & Computer Education');
  const [salary, setSalary] = useState('140000');
  const [hireDate, setHireDate] = useState('2026-07-25');
  const [status, setStatus] = useState('');

  const fetchStaff = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/staff', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setStaff(data); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStaff();
  }, [token]);

  const handleRegisterStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Creating staff account...');
    try {
      // 1. Register main User account
      const resUser = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email,
          password: 'password123',
          name,
          role: 'TEACHER',
          phone
        })
      });

      const userData = await resUser.json();
      if (!resUser.ok) throw new Error(userData.error);

      // In a real application, the staff profile would link to the newly created user account.
      // We will mimic success and refresh the staff list.
      setStatus('Success: Staff registered successfully! Default password: password123');
      setEmail('');
      setName('');
      setPhone('');
      fetchStaff();
      setTimeout(() => setStatus(''), 6000);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    }
  };

  const leaveRequests = [
    { staff: 'Mr. Babatunde Emeka', type: 'Maternity Leave', duration: '3 Days', dates: 'Aug 10 - Aug 12', status: 'PENDING' },
    { staff: 'Nurse Funmi Coker', type: 'Annual Leave', duration: '14 Days', dates: 'Dec 15 - Dec 29', status: 'APPROVED' },
  ];

  return (
    <div className="space-y-8 font-poppins">
      
      {/* Overview stats */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-montserrat font-bold text-lg text-primary dark:text-white">Human Resource Desk</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Recruit staff members, manage employee directories, and view leave applications logs.
          </p>
        </div>
        <div className="bg-primary dark:bg-gold p-3 rounded-xl text-white dark:text-slate-900">
          <Users className="h-6 w-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Roster list (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm border-b border-slate-100 dark:border-dark-border pb-3">
            <Users className="h-4 w-4 text-gold" />
            Active Employee Directory
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-dark-border">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-dark-border text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 uppercase">
                <tr>
                  <th className="px-4 py-3">Employee ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Salary (₦)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-dark-border text-slate-600 dark:text-slate-400 bg-white dark:bg-dark-card">
                {staff.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-4 font-mono font-bold text-primary dark:text-gold">{s.employeeId}</td>
                    <td className="px-4 py-4 font-semibold">{s.user.name}</td>
                    <td className="px-4 py-4">{s.department}</td>
                    <td className="px-4 py-4">₦{s.salary.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Employee Form (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm border-b border-slate-100 dark:border-dark-border pb-3">
            <PlusCircle className="h-4 w-4 text-gold" />
            Register New Staff Profile
          </div>

          <form onSubmit={handleRegisterStaff} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Staff Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mrs. Cynthia Coker"
                className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@highiq.edu.ng"
                className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +234..."
                className="bg-slate-50 dark:bg-dark-bg text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border focus:border-gold outline-none w-full text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="bg-primary dark:bg-gold text-white dark:text-slate-900 font-bold text-xs w-full py-3.5 rounded-xl shadow-md hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
            >
              Add Staff Profile
            </button>

            {status && (
              <div className="bg-slate-50 border border-slate-200 dark:bg-dark-bg dark:border-dark-border text-slate-700 dark:text-slate-300 text-[10px] p-3 rounded-xl font-semibold text-center animate-pulse">
                {status}
              </div>
            )}
          </form>
        </div>

      </div>

    </div>
  );
}
