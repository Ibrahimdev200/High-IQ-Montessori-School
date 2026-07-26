'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Navigation, Compass } from 'lucide-react';

export default function TransportDashboard() {
  const { token } = useAuth();
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  // GPS simulation coordinates
  const [lat, setLat] = useState(6.6186);
  const [lng, setLng] = useState(3.5029);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}` + '/api/transport/routes', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setRoutes(data); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  // Simulated GPS route coordinate updater
  useEffect(() => {
    if (!isBroadcasting || routes.length === 0) return;
    
    const interval = setInterval(async () => {
      const nextLat = lat + (Math.random() - 0.5) * 0.0005;
      const nextLng = lng + (Math.random() - 0.5) * 0.0005;
      setLat(nextLat);
      setLng(nextLng);

      // Call backend to update coordinates in database
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/transport/routes/${routes[0].id}/gps`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            currentLat: nextLat,
            currentLng: nextLng,
            status: 'EN_ROUTE'
          })
        });
      } catch (err) {
        console.error('Failed to sync coordinates: ', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isBroadcasting, lat, lng, routes, token]);

  const toggleBroadcast = () => {
    if (isBroadcasting) {
      setIsBroadcasting(false);
      setStatusMsg('GPS coordinates broadcast paused.');
    } else {
      setIsBroadcasting(true);
      setStatusMsg('Live GPS coordinate telemetry is now BROADCASTING active signal streams!');
    }
    setTimeout(() => setStatusMsg(''), 4000);
  };

  return (
    <div className="space-y-8 font-poppins">
      
      <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-montserrat font-bold text-lg text-primary dark:text-white">Bus Fleet Operations</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Publish route maps schedules, update active bus driver logs, and stream GPS coordinate arrays.
          </p>
        </div>
        <div className="bg-primary dark:bg-gold p-3 rounded-xl text-white dark:text-slate-900">
          <Compass className="h-6 w-6" />
        </div>
      </div>

      {statusMsg && (
        <div className="bg-slate-100 border border-slate-200 dark:bg-dark-bg dark:border-dark-border text-slate-700 dark:text-slate-300 text-xs p-3.5 rounded-xl font-medium text-center">
          {statusMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Active Routes (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm border-b border-slate-100 dark:border-dark-border pb-3">
            <MapPin className="h-4 w-4 text-gold" />
            Transit Routes & Driver Rosters
          </div>

          <div className="space-y-4">
            {routes.map((rt) => (
              <div key={rt.id} className="border border-slate-200 dark:border-dark-border p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-primary dark:text-gold">{rt.name}</span>
                  <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded">
                    Fee: ₦{rt.fee.toLocaleString()}
                  </span>
                </div>
                <div className="text-xs space-y-1 mt-2 text-slate-600 dark:text-slate-400">
                  <p><strong>Driver:</strong> {rt.driverName} ({rt.driverPhone})</p>
                  <p><strong>Vehicle plate:</strong> {rt.vehicleNo}</p>
                </div>
              </div>
            ))}
            
            {routes.length === 0 && (
              <div className="text-center text-xs text-slate-400 py-12">
                No active routes logged in transit registers.
              </div>
            )}
          </div>
        </div>

        {/* GPS Broadcast Simulation Box (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm border-b border-slate-100 dark:border-dark-border pb-3">
            <Navigation className="h-4 w-4 text-gold" />
            GPS Telemetry Broadcast console
          </div>

          <div className="space-y-4 text-center">
            <div className="bg-slate-50 dark:bg-dark-bg/60 border border-slate-200 dark:border-dark-border p-6 rounded-xl">
              <span className="block text-[9px] uppercase font-bold text-slate-400">GPS Signal Broadcast</span>
              <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded mt-1 ${
                isBroadcasting ? 'bg-emerald-100 text-emerald-800 animate-pulse' : 'bg-slate-100 text-slate-600'
              }`}>
                {isBroadcasting ? 'BROADCASTING SIGNALS' : 'STANDBY'}
              </span>
              
              <span className="block font-mono text-xs text-slate-600 dark:text-slate-300 font-semibold mt-4">
                Lat: {lat.toFixed(6)}° N<br />Lng: {lng.toFixed(6)}° E
              </span>
            </div>

            <button
              onClick={toggleBroadcast}
              className={`w-full py-3.5 rounded-xl font-poppins font-bold text-xs shadow-md transition-all hover:scale-[1.01] active:scale-95 cursor-pointer ${
                isBroadcasting
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-primary dark:bg-gold text-white dark:text-slate-900'
              }`}
            >
              {isBroadcasting ? 'Halt Telemetry Broadcast' : 'Initiate GPS Broadcast'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
