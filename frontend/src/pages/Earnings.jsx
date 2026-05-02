import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, IndianRupee, Map as MapIcon, User, Settings, MapPin, Calendar, ArrowUpRight, TrendingUp, CreditCard, ChevronRight, Download } from 'lucide-react';
import Button from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';
import logo from '../assets/bee-logo.png';

const payoutHistory = [
  { id: 'PO-2039', date: 'Oct 09 - Oct 15', amount: '12,450', status: 'Processing', type: 'Bank Transfer' },
  { id: 'PO-2038', date: 'Oct 02 - Oct 08', amount: '15,200', status: 'Deposited', type: 'Bank Transfer' },
  { id: 'PO-2037', date: 'Sep 25 - Oct 01', amount: '14,800', status: 'Deposited', type: 'Bank Transfer' },
  { id: 'PO-2036', date: 'Sep 18 - Sep 24', amount: '11,350', status: 'Deposited', type: 'Bank Transfer' },
];

const mockChartData = [
  { day: 'Mon', value: 40, label: '₹840' },
  { day: 'Tue', value: 65, label: '₹1,240' },
  { day: 'Wed', value: 30, label: '₹620' },
  { day: 'Thu', value: 85, label: '₹1,850', active: true },
  { day: 'Fri', value: 50, label: '₹950' },
  { day: 'Sat', value: 70, label: '₹1,400' },
  { day: 'Sun', value: 90, label: '₹2,100' },
];

const Earnings = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full bg-background font-sans overflow-hidden">

      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border h-full flex flex-col shrink-0 z-10 shadow-sm relative hidden md:flex">
        <div className="p-6 pt-8 pb-10 flex items-center gap-2">
          <img src={logo} alt="CargoBee" className="w-8 h-8 object-contain" />
          <h1 className="text-2xl font-bold text-accent tracking-tight">CargoBee</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <ThemeToggle />
          <button
            onClick={() => navigate('/driver/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 text-textSecondary hover:bg-background rounded-xl transition-colors font-medium text-sm"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl shadow-md transition-colors font-medium text-sm">
            <IndianRupee size={18} />
            Earnings
          </button>
          <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-4 py-3 text-textSecondary hover:bg-background rounded-xl transition-colors font-medium text-sm">
            <User size={18} />
            Profile
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">

        {/* Top Header */}
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 md:px-8 shrink-0 z-10 sticky top-0">
          <h2 className="text-base font-bold text-accent">Earnings & Payouts</h2>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-medium text-textSecondary">
            <Calendar size={14} />
            This Week
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 flex justify-center">
          <div className="w-full max-w-5xl flex flex-col xl:flex-row gap-8">

            {/* Left Column - Earnings Overview */}
            <div className="flex-1 flex flex-col gap-6">

              {/* Balance Card */}
              <div className="bg-surface rounded-3xl p-8 border border-border text-accent shadow-xl relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
                  <div>
                    <div className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mb-2">Available for Payout</div>
                    <div className="text-5xl font-black text-primary tracking-tight mb-2">₹12,450</div>
                    <div className="text-sm text-textSecondary font-medium">Auto-payout scheduled for Oct 16</div>
                  </div>

                  <Button className="bg-background border border-border text-accent hover:bg-surface px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 whitespace-nowrap">
                    <Download size={18} />
                    Cash Out Now
                  </Button>
                </div>
              </div>

              {/* Weekly Chart */}
              <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-accent">Weekly Earnings</h3>
                    <div className="text-sm text-textSecondary">Oct 09 - Oct 15</div>
                  </div>
                  <div className="bg-success/10 text-success text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border border-success/20">
                    <TrendingUp size={14} />
                    +18% vs last week
                  </div>
                </div>

                {/* CSS Bar Chart */}
                <div className="h-48 flex items-end justify-between gap-2 px-2 mt-10 relative">
                  {/* Grid lines */}
                  <div className="absolute left-0 right-0 top-0 h-px bg-border"></div>
                  <div className="absolute left-0 right-0 top-1/2 h-px bg-border"></div>
                  <div className="absolute left-0 right-0 bottom-0 h-px bg-border"></div>

                  {mockChartData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center gap-3 relative group w-full max-w-[40px]">
                      {/* Tooltip */}
                      <div className="absolute -top-10 bg-accent text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {data.label}
                      </div>

                      {/* Bar */}
                      <div
                        className={`w-full rounded-t-md transition-all duration-300 relative z-0 ${data.active ? 'bg-primary shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-300 dark:group-hover:bg-gray-600'}`}
                        style={{ height: `${data.value}%` }}
                      ></div>

                      {/* Label */}
                      <div className={`text-[10px] font-bold uppercase tracking-wider ${data.active ? 'text-primary' : 'text-textSecondary'}`}>
                        {data.day}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column - Payout History */}
            <div className="w-full xl:w-[400px] flex flex-col gap-6 shrink-0">

              <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-accent">Payout History</h3>
                  <button className="text-sm font-semibold text-primary hover:text-primaryDark transition-colors">See All</button>
                </div>

                <div className="space-y-4">
                  {payoutHistory.map((payout, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-background transition-colors group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${payout.status === 'Processing' ? 'bg-primary/10 text-primary' : 'bg-background text-textSecondary'
                          }`}>
                          <CreditCard size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-accent text-sm mb-0.5">{payout.date}</div>
                          <div className="text-[10px] font-bold text-textSecondary uppercase tracking-widest flex items-center gap-1">
                            {payout.type} • <span className={payout.status === 'Processing' ? 'text-orange-600' : 'text-success'}>{payout.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div className="font-black text-accent text-base">₹{payout.amount}</div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-6">
                  <div className="bg-background rounded-xl p-4 border border-border flex items-start gap-3">
                    <IndianRupee size={18} className="text-textSecondary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-accent mb-1">Tax & Deductions</div>
                      <p className="text-xs text-textSecondary leading-relaxed">
                        A standard platform fee of 15% and applicable TDS is deducted from all payouts. Download statement for details.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Earnings;
