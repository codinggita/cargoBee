import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, MapPin, IndianRupee, Download, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import logo from '../assets/bee-logo.png';

const TripCompletion = () => {
  const navigate = useNavigate();
  const [bookingState, setBookingState] = useState(null);
  const [animStep, setAnimStep] = useState(0); // 0→1→2→3
  const autoTimer = useRef(null);

  useEffect(() => {
    const stateStr = sessionStorage.getItem('booking_state');
    if (stateStr) setBookingState(JSON.parse(stateStr));

    // Step animation: icon pop → text fade → receipt slide
    const t1 = setTimeout(() => setAnimStep(1), 200);
    const t2 = setTimeout(() => setAnimStep(2), 700);
    const t3 = setTimeout(() => setAnimStep(3), 1100);

    // Auto-redirect to rating after 6s
    autoTimer.current = setTimeout(() => navigate('/rate-experience'), 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(autoTimer.current); };
  }, []);

  const handleRate = () => { clearTimeout(autoTimer.current); navigate('/rate-experience'); };
  const handleHome = () => { clearTimeout(autoTimer.current); navigate('/home'); };

  // Fare breakdown
  const fare       = typeof bookingState?.fare === 'object' ? bookingState.fare : {};
  const base       = fare.base       ?? bookingState?.vehicle?.basePrice ?? 349;
  const distKm     = parseFloat((bookingState?.distance || '3.2 km').replace(/[^\d.]/g, '')) || 3.2;
  const distCharge = fare.distanceCharge ?? Math.round(Math.max(0, distKm - 3) * 15);
  const peak       = fare.peakSurcharge ?? 0;
  const gst        = fare.gst        ?? Math.round((base + distCharge + peak) * 0.018);
  const total      = fare.total      ?? (base + distCharge + peak + gst);
  const receiptId  = useRef(`BEE-${Math.floor(Math.random() * 900000) + 100000}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex flex-col font-sans">

      {/* Slim top bar */}
      <header className="h-14 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2 text-white/70">
          <img src={logo} alt="CargoBee" className="w-6 h-6 object-contain" />
          <span className="font-bold tracking-widest text-sm uppercase">CargoBee</span>
        </div>
        <button onClick={handleHome} className="text-white/50 hover:text-white/80 text-xs font-semibold transition-colors">
          Back to Home
        </button>
      </header>

      {/* Main content — vertically centered */}
      <main className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-sm flex flex-col items-center gap-6">

          {/* ── Success icon ── */}
          <div className="relative flex items-center justify-center">
            {/* Outer glow rings */}
            <div className={`absolute w-40 h-40 rounded-full bg-success/10 transition-all duration-700 ${animStep >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} />
            <div className={`absolute w-28 h-28 rounded-full bg-success/15 transition-all duration-500 delay-100 ${animStep >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} />
            <div className={`w-20 h-20 rounded-full bg-success/25 border-4 border-success flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)] transition-all duration-500 ${animStep >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
              <CheckCircle size={40} className="text-success" strokeWidth={2.5} />
            </div>
          </div>

          {/* ── Title ── */}
          <div className={`text-center transition-all duration-500 ${animStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-3xl font-black text-white mb-1 tracking-tight">Trip Completed! 🎉</h1>
            <p className="text-white/60 text-sm font-medium">Your cargo was delivered safely.</p>
            <p className="text-white/30 text-xs mt-1">Auto-redirecting to rating in 6s…</p>
          </div>

          {/* ── Receipt card ── */}
          <div className={`w-full transition-all duration-500 ${animStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">

              {/* Receipt header */}
              <div className="bg-gradient-to-r from-primary to-primaryDark px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-0.5">Receipt</div>
                  <div className="text-white font-bold text-sm">#{receiptId.current}</div>
                </div>
                <div className="bg-white/20 rounded-xl px-3 py-1.5 text-white text-xs font-bold">PAID ✓</div>
              </div>

              {/* Tear notch */}
              <div className="flex items-center px-4 py-2">
                <div className="w-4 h-4 rounded-full bg-[#1a1a2e] -ml-6 shrink-0" />
                <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-2" />
                <div className="w-4 h-4 rounded-full bg-[#1a1a2e] -mr-6 shrink-0" />
              </div>

              {/* Line items */}
              <div className="px-6 pb-2 space-y-3">
                {[
                  { label: 'Base Fare',                              val: base },
                  { label: `Distance (${bookingState?.distance || `${distKm} km`})`, val: distCharge },
                  ...(peak > 0 ? [{ label: 'Peak Surcharge (20%)', val: peak }] : []),
                  { label: 'GST (1.8%)',                             val: gst },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-sm font-semibold" style={{ color: '#111' }}>{label}</span>
                    <span className="text-sm font-bold" style={{ color: '#111' }}>₹{val}</span>
                  </div>
                ))}
              </div>

              {/* Tear notch */}
              <div className="flex items-center px-4 py-2">
                <div className="w-4 h-4 rounded-full bg-[#1a1a2e] -ml-6 shrink-0" />
                <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-2" />
                <div className="w-4 h-4 rounded-full bg-[#1a1a2e] -mr-6 shrink-0" />
              </div>

              {/* Total */}
              <div className="px-6 pb-6 flex justify-between items-center">
                <span className="text-lg font-black" style={{ color: '#111' }}>Total Paid</span>
                <span className="text-3xl font-black text-primary flex items-center gap-0.5">
                  <IndianRupee size={22} strokeWidth={3} />
                  {total}
                </span>
              </div>
            </div>

            {/* Driver row */}
            <div className="mt-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-3">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Driver" className="w-10 h-10 rounded-full object-cover border-2 border-white/20" />
              <div className="flex-1">
                <div className="text-white font-bold text-sm">Ayush Kumar</div>
                <div className="text-white/50 text-xs">MH-02-FJ-4821 • {bookingState?.vehicle?.name || 'Mini Tempo'}</div>
              </div>
              <div className="text-yellow-400 text-sm font-bold">★ 4.9</div>
            </div>
          </div>

          {/* ── Action buttons ── */}
          <div className={`w-full space-y-3 transition-all duration-500 delay-150 ${animStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button
              onClick={handleRate}
              className="w-full bg-primary hover:bg-primaryDark text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              Rate Your Driver <ArrowRight size={18} />
            </button>
            <button
              onClick={handleHome}
              className="w-full bg-white/10 hover:bg-white/20 text-white/80 font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all text-sm"
            >
              <Download size={16} /> Download Receipt (coming soon)
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default TripCompletion;
