import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard, FileText, Truck, Wallet, User as UserIcon,
  Settings, MapPin, ShieldCheck, LogOut, Heart, Bell,
  ChevronRight, MapPin as MapPinIcon, X, Check, Pencil, IndianRupee
} from 'lucide-react';
import Button from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';
import AvatarInitials from '../components/AvatarInitials';
import logo from '../assets/bee-logo.png';
import { logout, updateUser } from '../features/authSlice';
import { removeLocalItem, setLocalItem } from '../utils/storage';
import toast from 'react-hot-toast';

// ── Small reusable field ────────────────────────────────────────────────────
const EditField = ({ label, value, onChange, placeholder }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold text-textSecondary uppercase tracking-widest">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-accent text-sm font-medium
                 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
    />
  </div>
);

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // ── Derived display values ─────────────────────────────────────────────────
  const displayName  = user?.name  || 'CargoBee User';
  const displayEmail = user?.email || '';
  const displayRole  = user?.role === 'driver' ? 'Driver Partner' : 'Consumer';

  // ── Local UI state ─────────────────────────────────────────────────────────
  const [showEditModal,    setShowEditModal]    = useState(false);
  const [notificationsOn,  setNotificationsOn]  = useState(true);

  // ── Edit-modal draft state (populated when modal opens) ───────────────────
  const [draftName,        setDraftName]        = useState('');
  const [draftHomeAddr,    setDraftHomeAddr]    = useState('');
  const [draftOfficeAddr,  setDraftOfficeAddr]  = useState('');
  const [draftVehicleNo,   setDraftVehicleNo]   = useState('');
  const [draftLicenseNo,   setDraftLicenseNo]   = useState('');

  // Saved addresses (local state — persisted to localStorage via user object)
  const [homeAddress,    setHomeAddress]    = useState(user?.homeAddress    || 'A-45, Phase 1, Ashok Vihar');
  const [officeAddress,  setOfficeAddress]  = useState(user?.officeAddress  || 'Cyber City, Building 10');
  const [vehicleNo,      setVehicleNo]      = useState(user?.vehicleNo      || 'KA-01-AB-1234');
  const [licenseNo,      setLicenseNo]      = useState(user?.licenseNo      || 'DL-1420110012345');

  // ── Open modal & pre-fill ─────────────────────────────────────────────────
  const openEdit = () => {
    setDraftName(displayName);
    setDraftHomeAddr(homeAddress);
    setDraftOfficeAddr(officeAddress);
    setDraftVehicleNo(vehicleNo);
    setDraftLicenseNo(licenseNo);
    setShowEditModal(true);
  };

  // ── Save handler ──────────────────────────────────────────────────────────
  const handleSave = () => {
    const trimmedName = draftName.trim();
    if (!trimmedName) { toast.error('Name cannot be empty'); return; }

    const updatedUser = {
      ...user,
      name:          trimmedName,
      homeAddress:   draftHomeAddr.trim(),
      officeAddress: draftOfficeAddr.trim(),
      vehicleNo:     draftVehicleNo.trim(),
      licenseNo:     draftLicenseNo.trim(),
    };

    dispatch(updateUser(updatedUser));
    setLocalItem('cargobee_user', JSON.stringify(updatedUser));

    setHomeAddress(draftHomeAddr.trim()   || homeAddress);
    setOfficeAddress(draftOfficeAddr.trim() || officeAddress);
    setVehicleNo(draftVehicleNo.trim() || vehicleNo);
    setLicenseNo(draftLicenseNo.trim() || licenseNo);

    setShowEditModal(false);
    toast.success('Profile updated!');
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    dispatch(logout());
    removeLocalItem('cargobee_token');
    removeLocalItem('cargobee_user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-full bg-background font-sans overflow-hidden">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className="w-64 bg-surface border-r border-border h-full flex flex-col shrink-0 hidden md:flex">
        <div className="p-6 pt-8 pb-10 flex items-center gap-2 text-primaryDark">
          <img src={logo} alt="CargoBee" className="w-8 h-8 object-contain" />
          <h1 className="text-2xl font-bold tracking-tight">CargoBee</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => navigate('/home')} className="w-full flex items-center gap-3 px-4 py-3 text-textSecondary hover:bg-surface rounded-xl transition-colors font-medium text-sm">
            <LayoutDashboard size={18} /> Dashboard
          </button>
          {user?.role !== 'consumer' && (
            <button onClick={() => navigate('/driver/earnings')} className="w-full flex items-center gap-3 px-4 py-3 text-textSecondary hover:bg-surface rounded-xl transition-colors font-medium text-sm">
              <IndianRupee size={18} /> Earnings
            </button>
          )}
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl shadow-md transition-colors font-medium text-sm">
            <UserIcon size={18} /> Profile
          </button>
        </nav>
      </aside>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">

        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 md:px-8 shrink-0">
          <h2 className="text-sm font-medium text-textSecondary">My Profile</h2>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center">
          <div className="w-full max-w-3xl flex flex-col gap-6">

            {/* ── Profile Card ─────────────────────────────────────────── */}
            <div className="bg-surface rounded-3xl p-8 border border-border shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative">
                <AvatarInitials name={displayName} size={128} className="border-4 border-surface" />
                <div className="absolute bottom-0 right-0 bg-success text-white p-2 rounded-full border-2 border-surface shadow-md">
                  <ShieldCheck size={20} />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left flex flex-col justify-center h-full pt-2">
                <div className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{displayRole}</div>
                <h1 className="text-3xl font-bold text-accent mb-2">{displayName}</h1>
                {displayEmail && (
                  <p className="text-textSecondary font-medium mb-4">{displayEmail}</p>
                )}
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <Button
                    variant="outline"
                    className="py-2 px-6 text-sm font-semibold hover:bg-background border-border text-textSecondary flex items-center gap-2"
                    onClick={openEdit}
                  >
                    <Pencil size={14} /> Edit Profile
                  </Button>
                </div>
              </div>
            </div>

            {/* ── Saved Locations or Vehicle Details ────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {user?.role === 'driver' ? (
                <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
                  <h3 className="text-sm font-bold text-textSecondary uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Truck size={16} /> Vehicle & License
                  </h3>

                  <div className="space-y-4">
                    <div
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-background transition-colors border border-transparent hover:border-border group cursor-pointer"
                      onClick={openEdit}
                    >
                      <div className="w-10 h-10 bg-orange-50/10 text-orange-500 rounded-full flex items-center justify-center shrink-0">
                        <Truck size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-accent text-sm">Vehicle No.</div>
                        <div className="text-xs text-textSecondary truncate">{vehicleNo || 'Tap to add'}</div>
                      </div>
                      <ChevronRight size={16} className="text-border group-hover:text-primary transition-colors shrink-0" />
                    </div>

                    <div
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-background transition-colors border border-transparent hover:border-border group cursor-pointer"
                      onClick={openEdit}
                    >
                      <div className="w-10 h-10 bg-blue-50/10 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                        <FileText size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-accent text-sm">Driving License</div>
                        <div className="text-xs text-textSecondary truncate">{licenseNo || 'Tap to add'}</div>
                      </div>
                      <ChevronRight size={16} className="text-border group-hover:text-primary transition-colors shrink-0" />
                    </div>

                    <button
                      onClick={openEdit}
                      className="w-full py-3 text-sm font-bold text-primary hover:text-primaryDark transition-colors text-center border border-dashed border-primary/30 rounded-xl hover:bg-primary/5 mt-2"
                    >
                      + Update Details
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
                  <h3 className="text-sm font-bold text-textSecondary uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Heart size={16} /> Saved Locations
                  </h3>

                  <div className="space-y-4">
                    <div
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-background transition-colors border border-transparent hover:border-border group cursor-pointer"
                      onClick={openEdit}
                    >
                      <div className="w-10 h-10 bg-orange-50/10 text-orange-500 rounded-full flex items-center justify-center shrink-0">
                        <MapPinIcon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-accent text-sm">Home</div>
                        <div className="text-xs text-textSecondary truncate">{homeAddress || 'Tap to add'}</div>
                      </div>
                      <ChevronRight size={16} className="text-border group-hover:text-primary transition-colors shrink-0" />
                    </div>

                    <div
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-background transition-colors border border-transparent hover:border-border group cursor-pointer"
                      onClick={openEdit}
                    >
                      <div className="w-10 h-10 bg-blue-50/10 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                        <Wallet size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-accent text-sm">Office</div>
                        <div className="text-xs text-textSecondary truncate">{officeAddress || 'Tap to add'}</div>
                      </div>
                      <ChevronRight size={16} className="text-border group-hover:text-primary transition-colors shrink-0" />
                    </div>

                    <button
                      onClick={openEdit}
                      className="w-full py-3 text-sm font-bold text-primary hover:text-primaryDark transition-colors text-center border border-dashed border-primary/30 rounded-xl hover:bg-primary/5 mt-2"
                    >
                      + Add New Location
                    </button>
                  </div>
                </div>
              )}

              {/* Preferences */}
              <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
                <h3 className="text-sm font-bold text-textSecondary uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Settings size={16} /> Preferences
                </h3>

                <div className="space-y-2">
                  {/* Push Notifications — interactive toggle */}
                  <div
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-background transition-colors border border-transparent hover:border-border cursor-pointer"
                    onClick={() => {
                      const next = !notificationsOn;
                      setNotificationsOn(next);
                      toast(next ? '🔔 Notifications enabled' : '🔕 Notifications disabled');
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Bell size={18} className={notificationsOn ? 'text-primary' : 'text-gray-400'} />
                      <span className="font-bold text-accent text-sm">Push Notifications</span>
                    </div>
                    {/* Toggle pill */}
                    <div
                      className={`w-11 h-6 rounded-full relative transition-colors duration-300 shadow-inner ${notificationsOn ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${notificationsOn ? 'left-6' : 'left-1'}`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-background transition-colors border border-transparent hover:border-border cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={18} className="text-textSecondary" />
                      <span className="font-bold text-accent text-sm">Privacy &amp; Security</span>
                    </div>
                    <ChevronRight size={16} className="text-border group-hover:text-primary transition-colors" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-background transition-colors border border-transparent hover:border-border cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-textSecondary" />
                      <span className="font-bold text-accent text-sm">Terms &amp; Conditions</span>
                    </div>
                    <ChevronRight size={16} className="text-border group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>

            </div>

            {/* ── Logout ───────────────────────────────────────────────── */}
            <div className="mt-4">
              <Button
                onClick={handleLogout}
                className="w-full bg-error/10 hover:bg-error/20 text-error py-4 rounded-xl font-bold border border-error/20 shadow-sm flex justify-center items-center gap-2"
              >
                <LogOut size={18} />
                Log Out
              </Button>
            </div>

          </div>
        </div>
      </main>

      {/* ── Edit Profile Modal ────────────────────────────────────────────── */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowEditModal(false); }}
        >
          <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-[fadeSlideUp_0.2s_ease]">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div>
                <h2 className="text-lg font-bold text-accent">Edit Profile</h2>
                <p className="text-xs text-textSecondary mt-0.5">Update your personal information</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-full hover:bg-background text-textSecondary transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-6 space-y-5">
              {/* Avatar preview */}
              <div className="flex justify-center">
                <AvatarInitials name={draftName || displayName} size={72} />
              </div>

              <EditField
                label="Full Name"
                value={draftName}
                onChange={setDraftName}
                placeholder="Enter your full name"
              />

              <div className="border-t border-border pt-4">
                <p className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mb-3 flex items-center gap-1">
                  {user?.role === 'driver' ? <><Truck size={12} /> Vehicle Details</> : <><MapPinIcon size={12} /> Saved Addresses</>}
                </p>
                <div className="space-y-4">
                  {user?.role === 'driver' ? (
                    <>
                      <EditField
                        label="🚚 Vehicle No"
                        value={draftVehicleNo}
                        onChange={setDraftVehicleNo}
                        placeholder="e.g. KA-01-AB-1234"
                      />
                      <EditField
                        label="📄 Driving License"
                        value={draftLicenseNo}
                        onChange={setDraftLicenseNo}
                        placeholder="e.g. DL-1420110012345"
                      />
                    </>
                  ) : (
                    <>
                      <EditField
                        label="🏠 Home Address"
                        value={draftHomeAddr}
                        onChange={setDraftHomeAddr}
                        placeholder="e.g. A-45, Phase 1, Ashok Vihar"
                      />
                      <EditField
                        label="🏢 Office Address"
                        value={draftOfficeAddr}
                        onChange={setDraftOfficeAddr}
                        placeholder="e.g. Cyber City, Building 10"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 pb-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1 py-3 border-border text-textSecondary hover:bg-background font-semibold"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 py-3 font-semibold flex items-center justify-center gap-2"
                onClick={handleSave}
              >
                <Check size={16} /> Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
