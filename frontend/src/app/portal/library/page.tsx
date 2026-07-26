'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BookMarked, ToggleLeft, ToggleRight } from 'lucide-react';

export default function LibraryDashboard() {
  const { token } = useAuth();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  const fetchBooks = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/books', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setBooks(data); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks();
  }, [token]);

  const handleCheckout = async (bookId: string) => {
    setStatusMsg('Checking out book...');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/books/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookId,
          borrowerId: 'HIQ-STUD-2026-0042',
          borrowerName: 'Adebayo Oluwaseun',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 14 days
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStatusMsg('Book successfully checked out to Adebayo Oluwaseun!');
      fetchBooks();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    }
  };

  const handleReturn = async (bookId: string) => {
    setStatusMsg('Recording return of book...');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/books/return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStatusMsg('Book marked as returned successfully!');
      fetchBooks();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 font-poppins">
      
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-montserrat font-bold text-lg text-primary dark:text-white">Campus Digital & Physical Library</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track book lending circles, borrow queues, and inspect barcoded book metadata catalogs.
          </p>
        </div>
        <div className="bg-primary dark:bg-gold p-3 rounded-xl text-white dark:text-slate-900">
          <BookMarked className="h-6 w-6" />
        </div>
      </div>

      {statusMsg && (
        <div className="bg-slate-100 border border-slate-200 dark:bg-dark-bg dark:border-dark-border text-slate-700 dark:text-slate-300 text-xs p-3.5 rounded-xl font-medium text-center">
          {statusMsg}
        </div>
      )}

      {/* Book Catalog Table */}
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm space-y-6">
        <h3 className="font-montserrat font-bold text-sm text-primary dark:text-white">Active Library Catalog</h3>
        
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-dark-border">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-dark-border text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 uppercase">
              <tr>
                <th className="px-4 py-3">Book Title</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">ISBN</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Lending Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-dark-border text-slate-600 dark:text-slate-400 bg-white dark:bg-dark-card">
              {books.map((b) => {
                const isAvailable = b.status === 'AVAILABLE';
                return (
                  <tr key={b.id}>
                    <td className="px-4 py-4 font-semibold text-primary dark:text-white">{b.title}</td>
                    <td className="px-4 py-4">{b.author}</td>
                    <td className="px-4 py-4 font-mono">{b.isbn}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                        isAvailable
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {isAvailable ? (
                        <button
                          onClick={() => handleCheckout(b.id)}
                          className="flex items-center gap-1 bg-primary text-white dark:bg-gold dark:text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer hover:scale-102 transition-transform"
                        >
                          <ToggleRight className="h-4 w-4" />
                          Checkout
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReturn(b.id)}
                          className="flex items-center gap-1 bg-rose-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer hover:scale-102 transition-transform"
                        >
                          <ToggleLeft className="h-4 w-4" />
                          Mark Return
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
