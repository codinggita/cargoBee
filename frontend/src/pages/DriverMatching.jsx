import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJsApiLoader, GoogleMap, DirectionsRenderer, OverlayView } from '@react-google-maps/api';
import { Star, Phone, MessageSquare, MapPin, Zap, ShieldCheck, X, CheckCircle, Clock, Navigation } from 'lucide-react';
import Button from '../components/Button';
import logo from '../assets/bee-logo.png';

const libraries = ['places'];

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

const DEFAULT_CENTER = { lat: 19.0760, lng: 72.8777 };

const trust = [
  { icon: ShieldCheck, label: 'VERIFIED',  sub: 'Background checked' },
  { icon: Zap,         label: 'EXPRESS',   sub: 'Priority dispatch'   },
  { icon: ShieldCheck, label: 'INSURED',   sub: 'Full cargo cover'    },
];

const DriverMatching = () => {
  const navigate = useNavigate();
  const [isMatched, setIsMatched]           = useState(false);
  const [bookingState, setBookingState]     = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [dotCount, setDotCount]             = useState(1);
  const dotRef = useRef(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('booking_state');
    if (raw) setBookingState(JSON.parse(raw));
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  // Simulate matching after 3 s
  useEffect(() => {
    const t = setTimeout(() => setIsMatched(true), 3000);
    return () => clearTimeout(t);
  }, []);

  // Animated ellipsis dots
  useEffect(() => {
    if (isMatched) return;
    dotRef.current = setInterval(() => setDotCount(d => (d % 3) + 1), 600);
    return () => clearInterval(dotRef.current);
  }, [isMatched]);

  useEffect(() => {
    if (!isLoaded || !bookingState?.pickup?.lat || !bookingState?.drop?.lat) return;
    new window.google.maps.DirectionsService().route(
      {
        origin:      { lat: bookingState.pickup.lat, lng: bookingState.pickup.lng },
        destination: { lat: bookingState.drop.lat,   lng: bookingState.drop.lng   },
        travelMode:  window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => { if (status === 'OK') setDirectionsResponse(result); }
    );
  }, [isLoaded, bookingState]);

  const mapCenter = bookingState?.pickup?.lat
    ? { lat: bookingState.pickup.lat, lng: bookingState.pickup.lng }
    : DEFAULT_CENTER;

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans bg-[#1e2535]">

      {/* ════════════════ MAP AREA ════════════════ */}
      <div className={`relative h-full transition-all duration-700 ease-in-out ${isMatched ? 'w-full md:w-[calc(100%-420px)]' : 'w-full'}`}>

        {/* Gradient header overlay */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#0f1623]/90 to-transparent z-10 pointer-events-none" />

        {/* Top bar */}
        <div className="absolute top-0 left-0 w-full px-6 py-4 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="CargoBee" className="w-8 h-8 object-contain" />
            <span className="text-white font-black tracking-tight text-xl">CargoBee</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <button className="hover:text-white transition-colors">Help</button>
            <button onClick={() => navigate('/home')} className="hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Map */}
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={mapCenter}
            zoom={13}
            options={{ styles: darkMapStyle, disableDefaultUI: true }}
          >
            {directionsResponse && (
              <DirectionsRenderer
                directions={directionsResponse}
                options={{
                  suppressMarkers: false,
                  polylineOptions: { strokeColor: '#F59E0B', strokeWeight: 5, strokeOpacity: 0.9 },
                }}
              />
            )}

            {/* Searching pulse overlay — only before match */}
            {!isMatched && (
              <OverlayView position={mapCenter} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                <div className="relative flex items-center justify-center -ml-16 -mt-16">
                  <div className="absolute w-32 h-32 rounded-full bg-primary/20 animate-ping" />
                  <div className="absolute w-20 h-20 rounded-full bg-primary/30 animate-ping" style={{ animationDelay: '0.4s' }} />
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.6)] relative z-10">
                    <span className="text-2xl">🚚</span>
                  </div>
                </div>
              </OverlayView>
            )}
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-4 border-gray-600 border-t-primary animate-spin" />
          </div>
        )}

        {/* ── Searching state UI (bottom of map) ── */}
        {!isMatched && (
          <>
            {/* Status card */}
            <div className="absolute bottom-28 left-0 w-full px-5 flex justify-center z-10">
              <div className="bg-[#0f1623]/90 backdrop-blur-md border border-white/10 rounded-3xl px-6 py-5 w-full max-w-sm text-center shadow-2xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-primary/80 uppercase tracking-widest">Searching nearby drivers</span>
                </div>
                <h2 className="text-xl font-black text-white mb-1">
                  Finding your driver{'.'.repeat(dotCount)}
                </h2>
                <p className="text-gray-400 text-xs mb-4">
                  Near <span className="text-gray-200 font-semibold">{bookingState?.pickup?.address?.split(',')[0] || 'your location'}</span>
                </p>
                {/* Trust badges */}
                <div className="flex justify-center gap-3">
                  {trust.map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                      <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                        <Icon size={16} className="text-primary" />
                      </div>
                      <span className="text-[8px] font-black text-white/70 uppercase tracking-wider">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cancel */}
            <div className="absolute bottom-8 left-0 w-full flex justify-center z-10">
              <button
                onClick={() => navigate('/home')}
                className="text-gray-400 hover:text-white text-sm border border-white/10 hover:border-white/30 px-8 py-2.5 rounded-full transition-all bg-black/40 backdrop-blur-sm"
              >
                Cancel Search
              </button>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/5 z-10">
              <div className="h-full bg-primary animate-[progressBar_3s_ease-in-out_forwards]" style={{ width: '100%', animationFillMode: 'both' }} />
            </div>
          </>
        )}

        {/* ── Matched banner ── */}
        {isMatched && (
          <div className="absolute top-20 left-0 w-full px-5 flex justify-center z-10">
            <div className="bg-success/90 backdrop-blur-sm rounded-2xl px-5 py-3 flex items-center gap-3 shadow-xl">
              <CheckCircle size={20} className="text-white" strokeWidth={2.5} />
              <span className="text-white font-bold text-sm">Driver found! Ayush is on his way.</span>
            </div>
          </div>
        )}
      </div>

      {/* ════════════════ DRIVER PANEL ════════════════ */}
      <div className={`absolute md:relative right-0 top-0 h-full bg-surface shadow-2xl z-30 flex flex-col transition-all duration-700 ease-in-out ${
        isMatched ? 'w-full md:w-[420px] translate-x-0' : 'w-full md:w-[420px] translate-x-full'
      }`}>

        {/* Panel header */}
        <div className="px-6 pt-6 pb-5 border-b border-border bg-surface">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] font-black text-success uppercase tracking-widest mb-0.5">✓ Driver Confirmed</div>
              <h2 className="text-xl font-black text-accent">Driver Details</h2>
            </div>
            <button onClick={() => navigate('/home')} className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <X size={18} className="text-textSecondary" />
            </button>
          </div>

          {/* Driver profile */}
          <div className="flex items-center gap-4 bg-background rounded-2xl p-4 border border-border">
            <div className="relative shrink-0">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Driver" className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/20" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-surface flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-black text-accent leading-tight">Ayush Kumar</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Star size={13} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-bold text-accent">4.9</span>
                <span className="text-textSecondary text-xs">(2,400 trips)</span>
              </div>
              <div className="text-xs text-textSecondary mt-1 font-mono uppercase tracking-wider">MH 02 FJ 4821</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mb-0.5">Vehicle</div>
              <div className="text-sm font-bold text-accent">{bookingState?.vehicle?.name || 'Mini Tempo'}</div>
              <div className="text-lg">🚚</div>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

          {/* ETA cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background rounded-2xl p-4 border border-border">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock size={13} className="text-primary" />
                <div className="text-[10px] font-black text-textSecondary uppercase tracking-widest">Arrival in</div>
              </div>
              <div className="text-2xl font-black text-primary">8 min</div>
              <div className="text-xs text-textSecondary mt-0.5">Driver en route</div>
            </div>
            <div className="bg-background rounded-2xl p-4 border border-border">
              <div className="flex items-center gap-1.5 mb-1">
                <Navigation size={13} className="text-accent" />
                <div className="text-[10px] font-black text-textSecondary uppercase tracking-widest">Distance</div>
              </div>
              <div className="text-2xl font-black text-accent">1.2 km</div>
              <div className="text-xs text-textSecondary mt-0.5">From pickup</div>
            </div>
          </div>

          {/* Route summary */}
          <div className="bg-background rounded-2xl p-4 border border-border">
            <div className="text-[10px] font-black text-textSecondary uppercase tracking-widest mb-3">Route</div>
            <div className="relative pl-6">
              <div className="absolute left-[5px] top-2 bottom-2 border-l-2 border-dashed border-gray-200 dark:border-gray-700" />
              <div className="relative mb-4">
                <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 bg-success rounded-full ring-4 ring-white dark:ring-gray-900 z-10" />
                <div className="text-[9px] font-bold text-textSecondary uppercase tracking-widest mb-0.5">Pickup</div>
                <div className="text-sm font-semibold text-accent leading-tight">{bookingState?.pickup?.address || 'Pickup Location'}</div>
              </div>
              <div className="relative">
                <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 bg-error rounded-full ring-4 ring-white dark:ring-gray-900 z-10" />
                <div className="text-[9px] font-bold text-textSecondary uppercase tracking-widest mb-0.5">Drop</div>
                <div className="text-sm font-semibold text-accent leading-tight">{bookingState?.drop?.address || 'Drop Location'}</div>
              </div>
            </div>
            {bookingState?.distance && (
              <div className="mt-4 pt-3 border-t border-border flex justify-between text-xs text-textSecondary">
                <span>📍 {bookingState.distance}</span>
                <span>⏱ {bookingState.duration}</span>
                <span className="font-black text-primary">₹{bookingState.fare}</span>
              </div>
            )}
          </div>

          {/* Trust row */}
          <div className="flex gap-2">
            {trust.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex-1 bg-background rounded-2xl p-3 border border-border flex flex-col items-center text-center gap-1">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon size={14} className="text-primary" />
                </div>
                <div className="text-[9px] font-black text-accent uppercase tracking-wider leading-none">{label}</div>
                <div className="text-[9px] text-textSecondary leading-none">{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="shrink-0 p-5 border-t border-border bg-surface space-y-2.5">
          <Button
            fullWidth
            className="py-4 font-bold flex items-center justify-center gap-2 text-base shadow-lg shadow-primary/20"
            onClick={() => navigate('/live-tracking')}
          >
            <Navigation size={18} /> Track Live
          </Button>
          <div className="grid grid-cols-2 gap-2.5">
            <Button variant="outline" className="py-3.5 flex items-center justify-center gap-2 border-gray-200 font-semibold text-sm">
              <Phone size={16} /> Call Driver
            </Button>
            <Button variant="outline" className="py-3.5 flex items-center justify-center gap-2 border-gray-200 font-semibold text-sm">
              <MessageSquare size={16} /> Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverMatching;
