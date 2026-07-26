'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, MapPin, Calendar, ClipboardCheck, BellRing, Navigation } from 'lucide-react';

export default function ParentDashboard() {
  const { user, token } = useAuth();
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [paymentMsg, setPaymentMsg] = useState('');

  // Bus Tracking simulator states
  const [busLat, setBusLat] = useState(6.6186);
  const [busLng, setBusLng] = useState(3.5029);
  const [busStatus, setBusStatus] = useState('INACTIVE');
  const [trackingActive, setTrackingActive] = useState(false);

  useEffect(() => {
    // 1. Fetch parent's child profile details (our mock student Adebayo Oluwaseun has guardian email matching parent@highiq.edu.ng)
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/students', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Find the student whose guardianEmail is parent@highiq.edu.ng
          const child = data.find(st => st.guardianEmail === 'parent@highiq.edu.ng');
          if (child) {
            setStudentInfo(child);
            // Fetch invoices for this child
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/finance/invoices', {
              headers: { 'Authorization': `Bearer ${token}` }
            })
              .then(res => res.json())
              .then(invData => {
                if (Array.isArray(invData)) {
                  const childInvoices = invData.filter(inv => inv.studentId === child.id);
                  setInvoices(childInvoices);
                }
              });
          }
        }
      })
      .catch(err => console.error(err));
  }, [token]);

  // Simulate Bus Tracking coordinates changes
  useEffect(() => {
    if (!trackingActive) return;
    const timer = setInterval(() => {
      // Add small random steps towards the school location coordinates
      setBusLat(prev => prev + (Math.random() - 0.5) * 0.0005);
      setBusLng(prev => prev + (Math.random() - 0.5) * 0.0005);
      setBusStatus('EN_ROUTE');
    }, 2500);
    return () => clearInterval(timer);
  }, [trackingActive]);

  const handlePayInvoice = async (invoiceId: string, amount: number) => {
    setPaymentMsg('Connecting to Paystack gateway...');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/finance/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          invoiceId,
          amountPaid: amount
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPaymentMsg('Payment successful! Invoice ledger updated.');
      
      // Reload invoices
      if (studentInfo) {
        const invRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/finance/invoices', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const invData = await invRes.json();
        if (Array.isArray(invData)) {
          const childInvoices = invData.filter(inv => inv.studentId === studentInfo.id);
          setInvoices(childInvoices);
        }
      }
      setTimeout(() => setPaymentMsg(''), 5000);
    } catch (err: any) {
      setPaymentMsg(`Payment failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 font-poppins">
      
      {/* Welcome header */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-montserrat font-bold text-lg text-primary dark:text-white">Guardian Console</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track your child's academic logs, balance statements, attendance registers, and transit location.
          </p>
        </div>
        <div className="bg-primary dark:bg-gold p-3 rounded-xl text-white dark:text-slate-900">
          <Calendar className="h-6 w-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Child Roster Summary & Attendance Card (5 cols) */}
        {studentInfo && (
          <div className="lg:col-span-5 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm border-b border-slate-100 dark:border-dark-border pb-3">
              <ClipboardCheck className="h-4 w-4 text-gold" />
              Ward Profile Summary
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-dark-bg/60 p-4 rounded-xl">
                <div>
                  <span className="block font-bold text-sm text-primary dark:text-white">{studentInfo.user.name}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">Adm: {studentInfo.admissionNo} • {studentInfo.class}</span>
                </div>
                <div className="bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold">
                  Status: Active
                </div>
              </div>

              {/* Attendance metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-200 dark:border-dark-border p-4 rounded-xl text-center">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Term Attendance</span>
                  <span className="block text-xl font-extrabold text-primary dark:text-gold mt-1">97.8%</span>
                </div>
                <div className="border border-slate-200 dark:border-dark-border p-4 rounded-xl text-center">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Total Absences</span>
                  <span className="block text-xl font-extrabold text-rose-500 mt-1">1 Day</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-900 p-4 rounded-xl text-[11px] leading-relaxed text-blue-800 dark:text-blue-300 flex gap-2.5">
                <BellRing className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Next School Holiday:</span> Resumption for the first academic term commences Monday Sept 14th, 2026.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fees Ledger & Invoices (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm border-b border-slate-100 dark:border-dark-border pb-3">
            <CreditCard className="h-4 w-4 text-gold" />
            Billing Statements & Fee Balances
          </div>

          <div className="space-y-4">
            {invoices.map((inv) => {
              const outstanding = inv.amount - inv.paidAmount;
              const isPaid = inv.status === 'PAID';
              return (
                <div key={inv.id} className="border border-slate-200 dark:border-dark-border p-4 rounded-xl flex justify-between items-center bg-white dark:bg-dark-card">
                  <div>
                    <h5 className="font-bold text-xs text-primary dark:text-white">{inv.title}</h5>
                    <span className="block text-[10px] text-slate-400 mt-1">
                      Total: ₦{inv.amount.toLocaleString()} • Paid: ₦{inv.paidAmount.toLocaleString()}
                    </span>
                    <span className="block text-[9px] text-slate-400">Due Date: {inv.dueDate}</span>
                  </div>

                  <div className="text-right space-y-1.5">
                    <span className={`inline-block text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      isPaid
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                    }`}>
                      {inv.status}
                    </span>
                    {!isPaid && (
                      <button
                        onClick={() => handlePayInvoice(inv.id, outstanding)}
                        className="block bg-primary dark:bg-gold text-white dark:text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-lg hover:scale-102 transition-transform cursor-pointer"
                      >
                        Pay ₦{outstanding.toLocaleString()}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            
            {paymentMsg && (
              <div className="bg-slate-50 border border-slate-200 dark:bg-dark-bg dark:border-dark-border text-slate-700 dark:text-slate-300 text-xs p-3 rounded-xl font-semibold text-center">
                {paymentMsg}
              </div>
            )}
            
            {invoices.length === 0 && (
              <div className="text-center text-xs text-slate-400 py-12">
                No active tuition invoices logged in fee schedules today.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Transit tracking simulator */}
      <div id="bus-tracker" className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-dark-border pb-3">
          <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm">
            <MapPin className="h-4 w-4 text-gold" />
            Live School Bus Tracking Route (GPS Simulation)
          </div>
          <button
            onClick={() => setTrackingActive(!trackingActive)}
            className={`text-xs font-bold px-4 py-1.5 rounded-xl cursor-pointer transition-colors ${
              trackingActive
                ? 'bg-rose-500 text-white'
                : 'bg-primary dark:bg-gold text-white dark:text-slate-900'
            }`}
          >
            {trackingActive ? 'Pause Simulation' : 'Simulate GPS Signal'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Coordinates detail */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-50 dark:bg-dark-bg/60 p-5 rounded-2xl border border-slate-200 dark:border-dark-border space-y-3">
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-400">Transit status</span>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 ${
                  trackingActive
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 animate-pulse'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {trackingActive ? 'BUS ACTIVE: EN ROUTE' : 'BUS OFFLINE'}
                </span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-400">Current GPS Coordinates</span>
                <span className="block font-mono text-xs text-slate-700 dark:text-slate-300 font-semibold mt-1">
                  Lat: {busLat.toFixed(6)}° N<br />Lng: {busLng.toFixed(6)}° E
                </span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-400">Assigned Driver</span>
                <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                  Mr. Tunde Driver (+234 809 012 3456)
                </span>
              </div>
            </div>
          </div>

          {/* Map display */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 h-[220px] rounded-2xl relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#328cc1_1px,_transparent_1px)] bg-[size:24px_24px] opacity-15" />
            
            {/* Bus marker */}
            <div
              className="absolute bg-gold p-2.5 rounded-full text-slate-900 border-2 border-white shadow-2xl transition-all duration-1000 flex items-center justify-center"
              style={{
                transform: `translate(${(busLng - 3.5029) * 10000}px, ${-(busLat - 6.6186) * 10000}px)`
              }}
            >
              <Navigation className="h-4 w-4 rotate-45 animate-pulse" />
            </div>

            {/* School landmark */}
            <div className="absolute bg-primary p-2 rounded-xl text-white border border-slate-700 flex items-center gap-1.5 text-[9px] font-bold">
              <span>HIGH IQ CAMPUS</span>
            </div>

            <span className="absolute bottom-3 right-3 text-[9px] text-slate-400 font-mono">
              Live Coordinate Mesh Grid (Simulated scale 1:100)
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}
