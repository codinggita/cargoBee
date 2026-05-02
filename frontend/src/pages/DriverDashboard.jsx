import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LayoutDashboard, IndianRupee, Map as MapIcon, User, Settings, Bell, Calendar, Star, MapPin, Clock, ShieldCheck, ArrowUpRight, LogOut } from 'lucide-react';
import Button from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';
import AvatarInitials from '../components/AvatarInitials';
import { logout } from '../features/authSlice';
import { removeLocalItem } from '../utils/storage';
import toast from 'react-hot-toast';
import logo from '../assets/bee-logo.png';

const MOCK_REQUEST = {
  id: '#CB-0091', pickup: 'Indiranagar, 12th Main Rd',
  drop: 'Koramangala, 4th Block', fare: 320, distance: '4.2 km',
};
const recentTrips = [
  { id: '#CB-9821', route: 'Indiranagar → Whitefield', earning: '450.00', status: 'COMPLETED' },
  { id: '#CB-9818', route: 'HSR Layout → Bellandur',   earning: '280.00', status: 'COMPLETED' },
];

const DriverDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const driverName = user?.name || 'Driver';
  const firstName = driverName.trim().split(/\s+/)[0];
  const [isOnline, setIsOnline] = useState(true);
  const [showRequest, setShowRequest] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const cdRef  = useRef(null);
  const showRef = useRef(null);

  useEffect(() => {
    showRef.current = setTimeout(() => setShowRequest(true), 5000);
    return () => clearTimeout(showRef.current);
  }, []);

  useEffect(() => {
    if (!showRequest) return;
    setCountdown(60);
    cdRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(cdRef.current);
          setShowRequest(false);
          toast('⏰ Request expired', { icon: '⚠️' });
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(cdRef.current);
  }, [showRequest]);

  const handleAccept = useCallback(() => {
    clearInterval(cdRef.current);
    setShowRequest(false);
    toast.success('Trip accepted! Navigating to pickup…');
    setTimeout(() => navigate('/driver/active-trip'), 800);
  }, [navigate]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    removeLocalItem('cargobee_token');
    removeLocalItem('cargobee_user');
    navigate('/login');
  }, [dispatch, navigate]);

  const handleDecline = useCallback(() => {
    clearInterval(cdRef.current);
    setShowRequest(false);
    toast('Request declined.', { icon: '🚫' });
  }, []);

  const circumference = 2 * Math.PI * 16;
  const dashOffset = circumference - (countdown / 60) * circumference;

  return (
    <div className="flex h-screen w-full bg-background font-sans overflow-hidden">
      <aside className="w-64 bg-surface border-r border-border h-full flex flex-col shrink-0 z-10 shadow-sm">
        <div className="p-6 pt-8 pb-10 flex items-center gap-2">
          <img src={logo} alt="CargoBee" className="w-8 h-8 object-contain" />
          <h1 className="text-2xl font-bold text-accent tracking-tight">CargoBee</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <ThemeToggle />
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl shadow-md transition-colors font-medium text-sm">
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => navigate('/driver/earnings')} className="w-full flex items-center gap-3 px-4 py-3 text-textSecondary hover:bg-background rounded-xl transition-colors font-medium text-sm">
            <IndianRupee size={18} /> Earnings
          </button>
          <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-4 py-3 text-textSecondary hover:bg-background rounded-xl transition-colors font-medium text-sm">
            <User size={18} /> Profile
          </button>
        </nav>
        <div className="p-4 border-t border-border mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-2 hover:bg-background rounded-xl transition-colors text-left group"
          >
            <AvatarInitials name={driverName} size={40} />
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-bold text-accent truncate">{driverName}</div>
              <div className="text-[9px] font-bold text-textSecondary uppercase tracking-widest mt-0.5">Driver Partner</div>
            </div>
            <LogOut size={16} className="text-gray-400 group-hover:text-error transition-colors" />
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-8 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-6">
            <h2 className="text-base font-bold text-accent">Dashboard Overview</h2>
            <button onClick={() => { const n = !isOnline; setIsOnline(n); toast(n ? '🟢 Online' : '⚫ Offline'); }}
              className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-full border border-border hover:bg-surface transition-colors">
              <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-success shadow-[0_0_8px_#22c55e]' : 'bg-gray-400'}`} />
              <span className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">{isOnline ? 'Online' : 'Offline'}</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-medium text-textSecondary">
              <Calendar size={14} /> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col xl:flex-row gap-6 p-6 md:p-8">
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-accent tracking-tight mb-1">Welcome back, {firstName}!</h1>
                <p className="text-sm text-textSecondary">You've covered 84km so far today.</p>
              </div>
              <div className="bg-success/10 border border-success/20 text-success px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold shadow-sm">
                <ShieldCheck size={18} /> Verified
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm text-accent relative overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10">
                  <div className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mb-2">Today's Earnings</div>
                  <div className="text-4xl font-black text-primary mb-4">₹ 1,240</div>
                  <div className="flex items-center gap-2 text-success text-xs font-bold">
                    <ArrowUpRight size={14} strokeWidth={3} /> 12% increase from yesterday
                  </div>
                </div>
              </div>
              <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                  <Star size={20} fill="currentColor" />
                </div>
                <div className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mb-1">Rating</div>
                <div className="text-3xl font-bold text-accent">4.9 <span className="text-lg text-textSecondary font-medium">/5.0</span></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0"><MapPin size={24} /></div>
                <div>
                  <div className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mb-0.5">Total Distance</div>
                  <div className="text-2xl font-bold text-accent">84.2 <span className="text-sm text-textSecondary uppercase">KM</span></div>
                </div>
              </div>
              <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center shrink-0"><Clock size={24} /></div>
                <div>
                  <div className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mb-0.5">Duty Hours</div>
                  <div className="text-2xl font-bold text-accent">6.5 <span className="text-sm text-textSecondary">hrs</span></div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-xl font-bold text-accent">Recent Trips</h3>
                <button className="text-sm font-semibold text-primary hover:text-primaryDark transition-colors">View All</button>
              </div>
              <div className="space-y-3">
                {recentTrips.map(trip => (
                  <div key={trip.id} className="bg-surface rounded-2xl p-5 border border-border shadow-sm flex items-center gap-6 hover:border-primary/30 transition-colors">
                    <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center border border-border shrink-0 text-xl opacity-60">🚚</div>
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div><div className="text-[9px] font-bold text-textSecondary uppercase tracking-widest mb-1">Trip ID</div><div className="font-bold text-accent text-sm">{trip.id}</div></div>
                      <div><div className="text-[9px] font-bold text-textSecondary uppercase tracking-widest mb-1">Route</div><div className="font-medium text-accent text-sm truncate">{trip.route}</div></div>
                      <div><div className="text-[9px] font-bold text-textSecondary uppercase tracking-widest mb-1">Earned</div><div className="font-bold text-success text-sm">₹ {trip.earning}</div></div>
                    </div>
                    <div className="bg-success/10 text-success text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-wider shrink-0">{trip.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full xl:w-[340px] flex flex-col gap-6 shrink-0">
            {showRequest ? (
              <div className="bg-surface rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-primary relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                <div className="flex justify-between items-start mb-5">
                  <div className="flex gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                        <circle cx="18" cy="18" r="16" fill="none"
                          stroke={countdown <= 10 ? '#ef4444' : '#f59e0b'}
                          strokeWidth="3"
                          strokeDasharray={circumference}
                          strokeDashoffset={dashOffset}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dashoffset 1s linear' }} />
                      </svg>
                      <span className={`absolute text-sm font-black ${countdown <= 10 ? 'text-error' : 'text-accent'}`}>{countdown}s</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-accent leading-none mb-1">New Request!</h3>
                      <p className="text-[10px] text-textSecondary">Accept for priority bonus</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-bold text-textSecondary uppercase tracking-widest mb-0.5">Est. Fare</div>
                    <div className="text-2xl font-black text-success">₹{MOCK_REQUEST.fare}</div>
                  </div>
                </div>
                <div className="bg-background rounded-xl p-4 border border-border mb-5">
                  <div className="relative pl-6">
                    <div className="absolute left-[5px] top-2 bottom-2 border-l-2 border-dashed border-gray-300" />
                    <div className="relative mb-3">
                      <div className="absolute -left-[27px] top-1.5 w-2 h-2 bg-success rounded-full ring-4 ring-background z-10" />
                      <div className="text-[8px] font-bold text-textSecondary uppercase tracking-widest mb-0.5">Pickup</div>
                      <div className="text-xs font-medium text-accent">{MOCK_REQUEST.pickup}</div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[27px] top-1.5 w-2 h-2 bg-error rounded-full ring-4 ring-background z-10" />
                      <div className="text-[8px] font-bold text-textSecondary uppercase tracking-widest mb-0.5">Drop</div>
                      <div className="text-xs font-medium text-textSecondary">{MOCK_REQUEST.drop}</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border flex justify-between text-xs text-textSecondary">
                    <span>📍 {MOCK_REQUEST.distance}</span>
                    <span>{MOCK_REQUEST.id}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleDecline} className="flex-1 py-3 border-border text-textSecondary hover:bg-background font-semibold">Decline</Button>
                  <Button onClick={handleAccept} className="flex-1 py-3 bg-[#065f46] hover:bg-[#047857] shadow-lg font-semibold text-white">Accept</Button>
                </div>
              </div>
            ) : (
              <div className="bg-surface rounded-3xl p-6 border border-border text-center text-textSecondary shadow-sm">
                <div className="text-3xl mb-3">{isOnline ? '🟢' : '⚫'}</div>
                <div className="font-bold text-accent mb-1">{isOnline ? 'Waiting for requests…' : 'You are offline'}</div>
                <div className="text-xs">{isOnline ? 'Incoming bookings will appear here' : 'Go online to accept trips'}</div>
              </div>
            )}

            <div className="bg-surface rounded-2xl p-5 border border-border shadow-sm">
              <div className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mb-3">Live Area Traffic</div>
              <div className="w-full h-32 bg-[#1a1a1a] rounded-xl mb-4 overflow-hidden relative">
                <div className="w-full h-full rounded-lg" style={{ backgroundImage: 'linear-gradient(#f59e0b20 1px, transparent 1px), linear-gradient(90deg, #f59e0b20 1px, transparent 1px)', backgroundSize: '15px 15px' }}>
                  <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-[#b45309] rounded-full blur-xl opacity-60" />
                </div>
                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm border border-gray-700 rounded-full px-2 py-0.5 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                  <span className="text-[8px] font-bold text-white uppercase tracking-wider">High Demand</span>
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-textSecondary">Active Drivers Nearby</span>
                <span className="font-bold text-accent">24 Drivers</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DriverDashboard;
