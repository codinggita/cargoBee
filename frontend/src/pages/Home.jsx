import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MapPin, Bell, User, Clock, AlertTriangle, X, ChevronRight, Package, Truck, Zap, Navigation } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import PageWrapper from '../components/PageWrapper';
import Button from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';
import SEO from '../components/SEO';
import logo from '../assets/bee-logo.png';
import toast from 'react-hot-toast';

const vehicles = [
  { id: 'mini_tempo',   name: 'Mini Tempo',   capacity: '1,000 kg', basePrice: 349,  emoji: '🚚', tag: 'Popular' },
  { id: 'pickup_truck', name: 'Pickup Truck',  capacity: '2,000 kg', basePrice: 599,  emoji: '🚛', tag: 'Best Value' },
  { id: 'e_cart',       name: 'E-Cart',        capacity: '500 kg',   basePrice: 249,  emoji: '🛵', tag: 'Eco' },
];

const cargoTypesList = [
  { label: 'Boxes',       emoji: '📦' },
  { label: 'Furniture',   emoji: '🪑' },
  { label: 'Electronics', emoji: '💻' },
  { label: 'Fragile',     emoji: '🔮' },
  { label: 'Other',       emoji: '📋' },
];

const libraries = ['places'];

const lightMapStyle = [
  { elementType: 'geometry',            stylers: [{ color: '#f0ebe3' }] },
  { elementType: 'labels.icon',         stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill',    stylers: [{ color: '#7a6a5a' }] },
  { elementType: 'labels.text.stroke',  stylers: [{ color: '#f5f1ec' }] },
  { featureType: 'road',                elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.arterial',       elementType: 'geometry', stylers: [{ color: '#fdf5e0' }] },
  { featureType: 'water',               elementType: 'geometry', stylers: [{ color: '#c9dde8' }] },
  { featureType: 'poi',                 stylers: [{ visibility: 'off' }] },
  { featureType: 'transit',             stylers: [{ visibility: 'off' }] },
];

const darkMapStyle = [
  { elementType: 'geometry',           stylers: [{ color: '#1e2535' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1e2535' }] },
  { elementType: 'labels.text.fill',   stylers: [{ color: '#8a99b0' }] },
  { featureType: 'road',               elementType: 'geometry',      stylers: [{ color: '#2c3a52' }] },
  { featureType: 'road',               elementType: 'geometry.stroke',stylers: [{ color: '#1a2435' }] },
  { featureType: 'road.highway',       elementType: 'geometry',      stylers: [{ color: '#3d5068' }] },
  { featureType: 'road',               elementType: 'labels.text.fill',stylers: [{ color: '#8a99b0' }] },
  { featureType: 'water',              elementType: 'geometry',      stylers: [{ color: '#0f1a2e' }] },
  { featureType: 'poi',                stylers: [{ visibility: 'off' }] },
  { featureType: 'transit',            stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative',     elementType: 'labels',        stylers: [{ visibility: 'simplified' }] },
];

const Home = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const user = useSelector((state) => state.auth.user);
  const [pickup, setPickup]               = useState(null);
  const [drop, setDrop]                   = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState('mini_tempo');
  const [cargoTypes, setCargoTypes]       = useState(['Boxes']);
  const [loading, setLoading]             = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance]           = useState('');
  const [duration, setDuration]           = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [map, setMap]                     = useState(null);
  const [isDark, setIsDark]               = useState(document.documentElement.classList.contains('dark'));

  // Watch for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const defaultCenter = { lat: 18.9220, lng: 72.8322 };

  // Restore addresses from sessionStorage on navigation return
  useEffect(() => {
    const pStr = sessionStorage.getItem('temp_pickup');
    const dStr = sessionStorage.getItem('temp_drop');
    if (pStr) { try { setPickup(JSON.parse(pStr)); } catch { setPickup({ address: pStr }); } }
    if (dStr) { try { setDrop(JSON.parse(dStr));   } catch { setDrop({ address: dStr });   } }
  }, [location.key]);

  // Fetch directions once both addresses are set
  useEffect(() => {
    if (!isLoaded || !pickup?.lat || !drop?.lat) return;
    const svc = new window.google.maps.DirectionsService();
    svc.route(
      { origin: { lat: pickup.lat, lng: pickup.lng }, destination: { lat: drop.lat, lng: drop.lng }, travelMode: window.google.maps.TravelMode.DRIVING },
      (result, status) => {
        if (status === 'OK') {
          setDirectionsResponse(result);
          setDistance(result.routes[0].legs[0].distance.text);
          setDuration(result.routes[0].legs[0].duration.text);
          // Fit map to route bounds
          if (map) map.fitBounds(result.routes[0].bounds, 60);
        }
      }
    );
  }, [isLoaded, pickup?.lat, drop?.lat, map]);

  const toggleCargoType = (label) =>
    setCargoTypes(prev => prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label]);

  const selectedVehicleObj = vehicles.find(v => v.id === selectedVehicle);

  const calculatedPrice = React.useMemo(() => {
    const base = selectedVehicleObj?.basePrice || 349;
    if (!distance) return base;
    const km = parseFloat(distance.replace(/,/g, '').split(' ')[0]);
    return isNaN(km) ? base : Math.round(base + Math.max(0, km - 3) * 15);
  }, [distance, selectedVehicleObj]);

  const handleBookNow = () => {
    if (!pickup || !drop) { toast.error('Please select both pickup and drop locations'); return; }
    setLoading(true);
    sessionStorage.setItem('booking_state', JSON.stringify({ pickup, drop, vehicle: selectedVehicleObj, cargoTypes, distance, duration, fare: calculatedPrice }));
    setTimeout(() => { setLoading(false); navigate('/driver-matching'); }, 1200);
  };

  const handleCancelBooking = () => {
    setShowCancelModal(false);
    sessionStorage.removeItem('booking_state');
    setPickup(null); setDrop(null); setDirectionsResponse(null); setDistance(''); setDuration('');
    toast.success('Booking cancelled. ₹50 cancellation fee applied.');
  };

  const mapCenter = pickup?.lat ? { lat: pickup.lat, lng: pickup.lng } : defaultCenter;

  return (
    <PageWrapper className="relative bg-surface h-screen overflow-hidden flex flex-col page-enter">
      <SEO title="Book a Truck" description="Book a truck instantly with CargoBee." />
      {/* Navbar Overlay */}
      <header className="bg-surface border-b border-border h-16 flex items-center justify-between px-5 shrink-0 z-20 shadow-sm">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/home')}>
          <img src={logo} alt="CargoBee" className="w-8 h-8 object-contain" />
          <span className="text-xl font-black text-accent tracking-tight hidden sm:block">CargoBee</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-textSecondary">
          <button onClick={() => navigate('/trips')} className="hover:text-primary transition-colors">My Trips</button>
          <button onClick={() => navigate('/profile')} className="hover:text-primary transition-colors">Profile</button>
        </nav>

        <div className="flex items-center gap-3 text-textSecondary">
          <ThemeToggle />
          <button onClick={() => navigate('/profile')} className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
            <User size={18} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT PANEL ── */}
        <div className="w-full md:w-[400px] lg:w-[440px] bg-background shrink-0 z-10 flex flex-col overflow-hidden shadow-xl">

          {/* Scrollable booking form */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            {/* Hero greeting */}
            <div className="pt-1">
              <h1 className="text-2xl font-black text-accent leading-tight mb-0.5">Where to?</h1>
              <p className="text-sm text-textSecondary">Fast, reliable cargo across the city.</p>
            </div>

            {/* ── Location inputs ── */}
            <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
              {/* Pickup row */}
              <button
                onClick={() => navigate('/address-search', { state: { type: 'pickup' } })}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group text-left"
              >
                <div className="w-3 h-3 rounded-full bg-success ring-4 ring-success/20 shrink-0" />
                <div className="flex-1 min-w-0">
                  {pickup?.address
                    ? <span className="text-sm font-semibold text-accent truncate block">{pickup.address}</span>
                    : <span className="text-sm text-textSecondary">Enter pickup location</span>
                  }
                </div>
                <ChevronRight size={16} className="text-textSecondary/50 group-hover:text-primary transition-colors shrink-0" />
              </button>

              {/* Divider with swap icon */}
              <div className="relative flex items-center px-4">
                <div className="flex-1 border-t border-dashed border-border" />
                <div className="mx-3 text-textSecondary/30 text-[10px] font-bold uppercase tracking-widest select-none">to</div>
                <div className="flex-1 border-t border-dashed border-border" />
              </div>

              {/* Drop row */}
              <button
                onClick={() => navigate('/address-search', { state: { type: 'drop' } })}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group text-left"
              >
                <div className="w-3 h-3 rounded-full bg-error ring-4 ring-error/20 shrink-0" />
                <div className="flex-1 min-w-0">
                  {drop?.address
                    ? <span className="text-sm font-semibold text-accent truncate block">{drop.address}</span>
                    : <span className="text-sm text-textSecondary">Enter drop location</span>
                  }
                </div>
                <ChevronRight size={16} className="text-textSecondary/50 group-hover:text-primary transition-colors shrink-0" />
              </button>
            </div>

            {/* Route info pill (only when route computed) */}
            {distance && duration && (
              <div className="flex items-center gap-3 bg-primary/8 border border-primary/20 rounded-xl px-4 py-2.5">
                <Navigation size={14} className="text-primary shrink-0" />
                <span className="text-sm font-semibold text-primaryDark">{distance}</span>
                <span className="text-textSecondary text-xs">•</span>
                <Clock size={12} className="text-textSecondary shrink-0" />
                <span className="text-sm text-textSecondary font-medium">{duration}</span>
              </div>
            )}

            {/* ── Vehicle Selection ── */}
            <div>
              <h3 className="text-sm font-bold text-accent uppercase tracking-widest mb-3">Select Vehicle</h3>
              <div className="grid grid-cols-3 gap-2.5">
                {vehicles.map(v => {
                  const active = selectedVehicle === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVehicle(v.id)}
                      className={`relative flex flex-col items-center p-3 rounded-2xl border-2 transition-all text-center ${
                        active
                          ? 'border-primary bg-primary/5 shadow-md shadow-primary/10 scale-[1.03]'
                          : 'border-border bg-surface hover:border-primary/40'
                      }`}
                    >
                      {v.tag && (
                        <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap ${
                          active ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-200 text-textSecondary'
                        }`}>
                          {v.tag}
                        </span>
                      )}
                      <span className="text-3xl mb-1.5 mt-1">{v.emoji}</span>
                      <span className={`text-xs font-bold leading-tight ${active ? 'text-primaryDark' : 'text-accent'}`}>{v.name}</span>
                      <span className="text-[10px] text-textSecondary mt-0.5">{v.capacity}</span>
                      <span className={`text-sm font-black mt-1 ${active ? 'text-primary' : 'text-accent'}`}>₹{v.basePrice}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Cargo Type ── */}
            <div>
              <h3 className="text-sm font-bold text-accent uppercase tracking-widest mb-3">Cargo Type</h3>
              <div className="flex flex-wrap gap-2">
                {cargoTypesList.map(({ label, emoji }) => {
                  const active = cargoTypes.includes(label);
                  return (
                    <button
                      key={label}
                      onClick={() => toggleCargoType(label)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold border transition-all ${
                        active
                          ? 'bg-primary text-white border-primary shadow-sm shadow-primary/30'
                          : 'bg-surface border-border text-textSecondary hover:border-primary/50 hover:text-primary'
                      }`}
                    >
                      <span>{emoji}</span> {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Sticky bottom fare + CTA ── */}
          <div className="shrink-0 border-t border-border bg-surface p-5">
            {/* Fare summary */}
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-xs font-bold text-textSecondary uppercase tracking-widest mb-0.5">Estimated Fare</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-accent">₹{calculatedPrice}</span>
                  <span className="text-sm text-textSecondary line-through">₹{calculatedPrice + 80}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                    {distance ? `📍 ${distance}` : '🎉 PROMO APPLIED'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mb-0.5">Vehicle</div>
                <div className="text-sm font-bold text-accent">{selectedVehicleObj?.emoji} {selectedVehicleObj?.name}</div>
              </div>
            </div>

            <Button fullWidth size="lg" onClick={handleBookNow} loading={loading} className="py-4 text-base font-black shadow-lg shadow-primary/20 mb-2">
              Book Now →
            </Button>

            {(pickup || drop) && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full py-2 text-sm font-medium text-error/70 hover:text-error transition-colors"
              >
                Cancel Booking
              </button>
            )}

            <p className="text-center text-[10px] text-textSecondary/60 mt-2 leading-relaxed">
              By booking you agree to CargoBee's Terms. Pricing varies by distance & traffic.
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL — Map ── */}
        <div className="flex-1 relative hidden md:block bg-background">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={mapCenter}
              zoom={pickup?.lat ? 14 : 12}
              onLoad={m => setMap(m)}
              options={{ styles: isDark ? darkMapStyle : lightMapStyle, disableDefaultUI: true, zoomControl: true }}
            >
              {pickup?.lat && !directionsResponse && <Marker position={{ lat: pickup.lat, lng: pickup.lng }} />}
              {drop?.lat  && !directionsResponse && <Marker position={{ lat: drop.lat,   lng: drop.lng   }} />}
              {directionsResponse && (
                <DirectionsRenderer
                  options={{
                    directions: directionsResponse,
                    polylineOptions: { strokeColor: '#F59E0B', strokeWeight: 5, strokeOpacity: 0.9 },
                  }}
                />
              )}
            </GoogleMap>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-background">
              <div className="w-10 h-10 rounded-full border-4 border-border border-t-primary animate-spin" />
            </div>
          )}

          {/* Map overlay — no address selected */}
          {!pickup && !drop && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-surface/80 dark:bg-surface/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-border text-center">
                <MapPin size={28} className="text-primary mx-auto mb-2" />
                <p className="text-sm font-bold text-accent">Select pickup & drop</p>
                <p className="text-xs text-textSecondary">Route will appear here</p>
              </div>
            </div>
          )}

          {/* Floating route summary pill (top of map) */}
          {distance && duration && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-surface rounded-full px-5 py-2 shadow-lg border border-border flex items-center gap-3 text-sm font-semibold text-accent">
              <span className="text-primary">🛣️ {distance}</span>
              <span className="text-textSecondary/50">•</span>
              <span>⏱ {duration}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Cancel Modal ── */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-7 text-center">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-error" />
              </div>
              <h2 className="text-xl font-black text-accent mb-1">Cancel Booking?</h2>
              <p className="text-textSecondary text-sm mb-2">A cancellation fee will be charged</p>
              <p className="text-4xl font-black text-error mb-4">₹50</p>
              <p className="text-textSecondary text-sm mb-6">This will be deducted from your CargoBee Wallet.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowCancelModal(false)} className="flex-1 py-3 border-2 border-border rounded-2xl font-bold text-accent hover:bg-background transition-colors">
                  Keep Booking
                </button>
                <Button onClick={handleCancelBooking} className="flex-1 py-3 bg-error hover:bg-error/90 text-white shadow-lg shadow-error/30">
                  Yes, Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default Home;
