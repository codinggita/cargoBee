import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, MapPin, User, LayoutDashboard, FileText, Plus, X, Clock } from 'lucide-react';
import Button from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';
import logo from '../assets/bee-logo.png';

const mockTrips = [
  { id: '#CB-9283', vehicle: 'Heavy Cargo Truck', status: 'Completed', pickup: 'Industrial Area, Okhla Phase III', drop: 'Connaught Place, Central Delhi', date: 'Oct 12, 2023 • 14:30', price: '4,250', icon: '🚚', driver: 'Ayush Kumar', rating: 4.9, distance: '18.2 km', duration: '42 min', base: 599, distCharge: 3623, gst: 76, total: 4250 },
  { id: '#CB-8120', vehicle: 'E-Loader Express', status: 'Cancelled', pickup: 'Rohini Sector 7, New Delhi', drop: 'Janakpuri District Center', date: 'Oct 10, 2023 • 09:15', price: '850', icon: '🛺', driver: 'Ravi Singh', rating: 4.7, distance: '11.4 km', duration: '28 min', base: 249, distCharge: 125, gst: 7, total: 850 },
  { id: '#CB-7541', vehicle: 'Tempo Traveller', status: 'Completed', pickup: 'Gurugram Phase V, Cyber City', drop: 'IGI Airport Terminal 3', date: 'Oct 08, 2023 • 18:00', price: '1,120', icon: '🚐', driver: 'Mohan Das', rating: 4.8, distance: '23.6 km', duration: '55 min', base: 349, distCharge: 306, gst: 19, total: 1120 },
];

const Trips = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);

  const filteredTrips = mockTrips.filter(t => {
    if (filter !== 'All' && t.status !== filter) return false;
    if (searchQuery && !t.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex h-screen w-full bg-background font-sans overflow-hidden">
      <aside className="w-64 bg-surface border-r border-border h-full flex flex-col shrink-0">
        <div className="p-6 pt-8 pb-10 flex items-center gap-2">
          <img src={logo} alt="CargoBee" className="w-8 h-8 object-contain" />
          <h1 className="text-2xl font-bold text-accent tracking-tight">CargoBee</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <ThemeToggle />
          <button onClick={() => navigate('/home')} className="w-full flex items-center gap-3 px-4 py-3 text-textSecondary hover:bg-background rounded-xl transition-colors font-medium text-sm"><LayoutDashboard size={18} /> Dashboard</button>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl shadow-md font-medium text-sm"><FileText size={18} /> Activity</button>
          <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-4 py-3 text-textSecondary hover:bg-background rounded-xl transition-colors font-medium text-sm"><User size={18} /> Profile</button>
        </nav>
        <div className="p-6">
          <Button className="w-full bg-primary hover:bg-primaryDark text-white flex items-center justify-center gap-2 py-4 rounded-xl shadow-lg" onClick={() => navigate('/home')}>
            <Plus size={18} /> New Dispatch
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-8 shrink-0">
          <h2 className="text-sm font-medium text-textSecondary">My Trips</h2>
          <div className="flex items-center gap-4 text-textSecondary">
            <button className="hover:text-accent transition-colors"><MapPin size={20} /></button>
            <button className="w-8 h-8 rounded-full border border-border bg-gray-100 flex items-center justify-center"><User size={18} /></button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="bg-background border border-border p-1.5 rounded-xl flex items-center">
              {['All', 'Completed', 'Cancelled'].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${filter === f ? 'bg-surface text-accent shadow-md border border-border/50' : 'text-textSecondary hover:text-accent'}`}>{f}</button>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary"><Search size={16} /></div>
              <input type="text" placeholder="Search by trip ID..." className="w-full bg-surface border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary transition-all" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTrips.map(trip => (
              <div key={trip.id} onClick={() => setSelectedTrip(trip)} className="bg-surface rounded-2xl p-6 border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl border border-primary/20">{trip.icon}</div>
                    <div>
                      <div className="text-[10px] font-bold text-textSecondary tracking-widest uppercase mb-0.5">TRIP {trip.id}</div>
                      <h3 className="font-medium text-accent text-lg">{trip.vehicle}</h3>
                    </div>
                  </div>
                  <div className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${trip.status === 'Completed' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>{trip.status}</div>
                </div>
                <div className="relative pl-6 mb-6">
                  <div className="absolute left-[5px] top-2 bottom-2 border-l-[1.5px] border-dashed border-border" />
                  <div className="relative mb-4">
                    <div className="absolute -left-[27px] top-1.5 w-2 h-2 bg-success rounded-full ring-4 ring-surface z-10" />
                    <div className="text-[9px] font-bold text-textSecondary uppercase tracking-widest mb-0.5">Pickup</div>
                    <div className="text-sm font-medium text-accent">{trip.pickup}</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[27px] top-1.5 w-2 h-2 bg-error rounded-full ring-4 ring-surface z-10" />
                    <div className="text-[9px] font-bold text-textSecondary uppercase tracking-widest mb-0.5">Drop</div>
                    <div className="text-sm font-medium text-textSecondary">{trip.drop}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-5 border-t border-border">
                  <div className="text-xs text-textSecondary font-medium">📅 {trip.date}</div>
                  <div className={`text-xl font-black ${trip.status === 'Cancelled' ? 'text-gray-400 line-through decoration-2' : 'text-accent'}`}>₹{trip.price}</div>
                </div>
                <div className="mt-2 text-xs text-primary font-semibold text-right">View details →</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedTrip(null)}>
          <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-surface z-10">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedTrip.icon}</span>
                <div>
                  <div className="text-xs font-bold text-textSecondary uppercase tracking-widest">Trip {selectedTrip.id}</div>
                  <h2 className="text-lg font-bold text-accent">{selectedTrip.vehicle}</h2>
                </div>
              </div>
              <button onClick={() => setSelectedTrip(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-textSecondary" /></button>
            </div>

            <div className="p-6 space-y-5">
              <div className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${selectedTrip.status === 'Completed' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>{selectedTrip.status}</div>

              {/* Route */}
              <div className="bg-background rounded-2xl p-4 pl-8 relative border border-border">
                <div className="absolute left-5 top-6 bottom-6 border-l-[1.5px] border-dashed border-border" />
                <div className="relative mb-4">
                  <div className="absolute -left-4 top-1 w-2.5 h-2.5 bg-success rounded-full ring-4 ring-background z-10" />
                  <div className="text-[10px] font-bold text-textSecondary uppercase mb-0.5">Pickup</div>
                  <div className="text-sm font-medium text-accent">{selectedTrip.pickup}</div>
                </div>
                <div className="relative">
                  <div className="absolute -left-4 top-1 w-2.5 h-2.5 bg-error rounded-full ring-4 ring-background z-10" />
                  <div className="text-[10px] font-bold text-textSecondary uppercase mb-0.5">Drop</div>
                  <div className="text-sm font-medium text-accent">{selectedTrip.drop}</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[{ l: 'Distance', v: selectedTrip.distance }, { l: 'Duration', v: selectedTrip.duration }, { l: 'Rating', v: `⭐ ${selectedTrip.rating}` }].map(({ l, v }) => (
                  <div key={l} className="bg-background rounded-xl p-3 text-center">
                    <div className="text-[9px] font-bold text-textSecondary uppercase tracking-widest mb-1">{l}</div>
                    <div className="font-bold text-accent text-sm">{v}</div>
                  </div>
                ))}
              </div>

              {/* Fare Breakdown (dotted receipt) */}
              <div className="bg-background rounded-2xl p-4 border-2 border-dashed border-border">
                <div className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mb-3 text-center">🧾 Fare Breakdown</div>
                {[{ l: 'Base Fare', v: selectedTrip.base }, { l: 'Distance Charge', v: selectedTrip.distCharge }, { l: 'GST (1.8%)', v: selectedTrip.gst }].map(({ l, v }) => (
                  <div key={l} className="flex justify-between items-center mb-2">
                    <span className="text-sm text-textSecondary">{l}</span>
                    <span className="text-sm font-bold text-accent">₹{v}</span>
                  </div>
                ))}
                <div className="border-t border-dashed border-border pt-3 flex justify-between items-center mt-2">
                  <span className="font-bold text-accent">Total Paid</span>
                  <span className="text-xl font-black text-primary">₹{selectedTrip.total}</span>
                </div>
              </div>

              {/* Driver */}
              <div className="flex items-center gap-3 bg-background rounded-xl p-3">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Driver" className="w-10 h-10 rounded-full object-cover border border-border" />
                <div>
                  <div className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">Driver</div>
                  <div className="font-bold text-accent">{selectedTrip.driver}</div>
                </div>
                <div className="ml-auto text-sm font-bold text-primary">⭐ {selectedTrip.rating}</div>
              </div>

              <div className="flex items-center gap-2 text-xs text-textSecondary">
                <Clock size={12} /> {selectedTrip.date}
              </div>
            </div>
            <div className="p-4 border-t border-border">
              <Button className="w-full py-3" onClick={() => setSelectedTrip(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trips;
