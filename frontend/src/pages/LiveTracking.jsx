import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useJsApiLoader, GoogleMap, DirectionsRenderer, OverlayView
} from '@react-google-maps/api';
import { Bell, Phone, MessageSquare, Share2, RefreshCw, Plus, Minus, Crosshair, MapPin } from 'lucide-react';
import Button from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';
import logo from '../assets/bee-logo.png';

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

const libraries = ['places'];

const lightMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#d5e2e8' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#a2c1d1' }] },
];

const center = { lat: 19.074, lng: 72.879 };

const LiveTracking = () => {
  const navigate = useNavigate();
  const [map, setMap] = useState(null);
  const [bookingState, setBookingState] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  // Truck position: interpolates between pickup and drop over 30s
  const [truckProgress, setTruckProgress] = useState(0.15);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  // Watch for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  const progressRef = useRef(null);

  useEffect(() => {
    const stateStr = sessionStorage.getItem('booking_state');
    if (stateStr) setBookingState(JSON.parse(stateStr));
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  useEffect(() => {
    if (isLoaded && bookingState?.pickup?.lat && bookingState?.drop?.lat) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: bookingState.pickup.lat, lng: bookingState.pickup.lng },
          destination: { lat: bookingState.drop.lat, lng: bookingState.drop.lng },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          }
        }
      );
    }
  }, [isLoaded, bookingState]);

  // Animate truck from pickup toward drop over 60s
  useEffect(() => {
    progressRef.current = setInterval(() => {
      setTruckProgress((p) => {
        if (p >= 0.95) {
          clearInterval(progressRef.current);
          // Auto-navigate to trip completion after reaching ~destination
          setTimeout(() => navigate('/trip-completion'), 1000);
          return 0.98;
        }
        return p + 0.004; // moves ~0.4% every 250ms → full trip ≈ 60s
      });
    }, 250);
    return () => clearInterval(progressRef.current);
  }, []);

  // Interpolate lat/lng based on progress
  const getTruckPos = () => {
    if (!bookingState?.pickup?.lat || !bookingState?.drop?.lat) {
      return { lat: center.lat + 0.002, lng: center.lng - 0.002 };
    }
    const p = truckProgress;
    return {
      lat: bookingState.pickup.lat + (bookingState.drop.lat - bookingState.pickup.lat) * p,
      lng: bookingState.pickup.lng + (bookingState.drop.lng - bookingState.pickup.lng) * p,
    };
  };

  const mapCenter = bookingState?.pickup?.lat
    ? { lat: bookingState.pickup.lat, lng: bookingState.pickup.lng }
    : center;

  const truckPos = getTruckPos();
  const etaMinutes = Math.max(1, Math.round((1 - truckProgress) * 18));

  const handleZoomIn  = () => map?.setZoom((map.getZoom() || 14) + 1);
  const handleZoomOut = () => map?.setZoom((map.getZoom() || 14) - 1);
  const handleRecenter = () => map?.panTo(truckPos);

  const handleFinishTrip = () => {
    clearInterval(progressRef.current);
    navigate('/trip-completion');
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden relative">
      {/* Top Navbar */}
      <header className="bg-background h-16 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
            <img src={logo} alt="CargoBee" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold text-accent">CargoBee</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-semibold text-accent ml-8">
            <ThemeToggle />
            <button className="hover:text-primary transition-colors">Shipments</button>
            <button className="hover:text-primary transition-colors">Support</button>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-textSecondary">
          <div className="w-8 h-8 rounded-full border-2 border-primary overflow-hidden cursor-pointer" onClick={handleFinishTrip}>
            <img src="https://i.pravatar.cc/150?u=user1" alt="User" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Main Map Area */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 z-0">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={mapCenter}
              zoom={14}
              onLoad={(m) => setMap(m)}
              options={{ styles: isDark ? darkMapStyle : lightMapStyle, disableDefaultUI: true }}
            >
              {/* Saffron dashed route */}
              {directionsResponse && (
                <DirectionsRenderer
                  directions={directionsResponse}
                  options={{
                    suppressMarkers: true,
                    polylineOptions: {
                      strokeColor: '#F59E0B',
                      strokeWeight: 5,
                      strokeOpacity: 0,
                      icons: [{
                        icon: {
                          path: 'M 0,-1 0,1',
                          strokeOpacity: 1,
                          strokeWeight: 4,
                          scale: 4,
                          strokeColor: '#F59E0B',
                        },
                        offset: '0',
                        repeat: '20px',
                      }],
                    },
                  }}
                />
              )}

              {/* Pickup marker */}
              {bookingState?.pickup?.lat && (
                <OverlayView position={bookingState.pickup} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                  <div className="w-4 h-4 bg-success border-4 border-surface rounded-full shadow-md -ml-2 -mt-2" />
                </OverlayView>
              )}

              {/* Drop marker */}
              {bookingState?.drop?.lat && (
                <OverlayView position={bookingState.drop} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                  <div className="w-4 h-4 bg-error border-4 border-surface rounded-full shadow-md -ml-2 -mt-2" />
                </OverlayView>
              )}

              {/* Animated truck icon */}
              <OverlayView position={truckPos} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                <div className="text-2xl -ml-4 -mt-4 drop-shadow-lg" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))' }}>
                  🚚
                </div>
              </OverlayView>
            </GoogleMap>
          ) : null}
        </div>

        {/* Floating Cards (Left) */}
        <div className="absolute top-6 left-6 z-10 flex flex-col gap-4 w-full max-w-[340px]">

          {/* Status Card */}
          <div className="bg-surface rounded-2xl p-5 shadow-xl border border-border">
            <div className="bg-success text-white text-[10px] font-bold px-2 py-0.5 rounded-full inline-block uppercase tracking-wider mb-2">
              Trip in Progress
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-accent mb-1">Arriving in ~{etaMinutes} mins</h2>
                <p className="text-xs text-textSecondary">
                  {Math.round(truckProgress * 100)}% of route completed
                </p>
              </div>
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg text-white">
                <span className="text-xl">🚚</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-3 w-full h-1.5 bg-gray-100 dark:bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${truckProgress * 100}%` }}
              />
            </div>
          </div>

          {/* Driver Card */}
          <div className="bg-surface rounded-2xl p-5 shadow-xl border border-border">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#1e293b] rounded-xl overflow-hidden">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Pilot" className="w-full h-full object-cover opacity-90" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mb-0.5">Your Pilot</div>
                  <h3 className="font-bold text-accent text-lg leading-none mb-1">Ayush Kumar</h3>
                  <div className="text-[10px] text-textSecondary">MH-02-FJ-4821 • {bookingState?.vehicle?.name || 'Mini Tempo'}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-primaryDark text-xl leading-none mb-1">{bookingState?.distance || '3.2 km'}</div>
                <div className="text-[9px] font-bold text-textSecondary uppercase tracking-widest">Left To Drop</div>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative pl-6 mb-4">
              <div className="absolute left-2 top-1.5 bottom-1.5 w-[2px] bg-gray-200 dark:bg-gray-700 border-l-2 border-dashed border-gray-300 dark:border-gray-600" />
              <div className="relative mb-4">
                <div className="absolute -left-6 top-1 w-3 h-3 bg-success border-2 border-surface rounded-full z-10" />
                <div className="text-[10px] font-bold text-accent mb-0.5">Pickup</div>
                <div className="text-xs text-textSecondary leading-tight">{bookingState?.pickup?.address || 'Pickup Location'}</div>
              </div>
              <div className="relative">
                <div className="absolute -left-6 top-1 w-3 h-3 bg-error border-2 border-surface rounded-full z-10" />
                <div className="text-[10px] font-bold text-accent mb-0.5">Dropoff</div>
                <div className="text-xs text-textSecondary leading-tight">{bookingState?.drop?.address || 'Drop Location'}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-3">
              <Button variant="outline" className="flex-1 py-2.5 text-sm bg-background border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 flex gap-2 justify-center items-center">
                <MessageSquare size={16} /> Message
              </Button>
              <Button variant="outline" className="flex-1 py-2.5 text-sm bg-background border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 flex gap-2 justify-center items-center">
                <Share2 size={16} /> Share
              </Button>
            </div>
            <div className="flex gap-3">
              <Button fullWidth className="bg-[#b45309] hover:bg-[#92400e] py-3.5 text-sm shadow-md flex gap-2 justify-center items-center text-white flex-1">
                <Phone size={18} /> Call Pilot
              </Button>
              <Button onClick={handleFinishTrip} className="bg-success hover:bg-success/90 py-3.5 text-sm shadow-md flex gap-2 justify-center items-center text-white">
                End Trip
              </Button>
            </div>
          </div>
        </div>

        {/* Map Controls (Right) */}
        <div className="absolute top-6 right-6 z-10 flex flex-col gap-2">
          <button onClick={handleZoomIn} className="w-10 h-10 bg-surface rounded-xl shadow-md flex items-center justify-center text-accent hover:bg-background border border-border"><Plus size={20} /></button>
          <button onClick={handleZoomOut} className="w-10 h-10 bg-surface rounded-xl shadow-md flex items-center justify-center text-accent hover:bg-background border border-border"><Minus size={20} /></button>
          <button onClick={handleRecenter} className="w-10 h-10 bg-surface rounded-xl shadow-md flex items-center justify-center text-primary hover:bg-background border border-border mt-2"><Crosshair size={20} /></button>
        </div>
      </div>

      {/* Bottom Information Bar */}
      <div className="bg-surface border-t border-border px-6 py-3 flex items-center justify-between z-20 shrink-0">
        <div className="flex gap-8">
          <div>
            <div className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mb-1">Order ID</div>
            <div className="font-semibold text-accent text-sm">#CB-98234-AX</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mb-1">Vehicle</div>
            <div className="font-semibold text-accent text-sm">{bookingState?.vehicle?.name || 'Mini Tempo'}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-textSecondary uppercase tracking-widest mb-1">Fare</div>
            <div className="font-semibold text-primary text-sm">₹{bookingState?.fare || '---'}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-textSecondary">
          Live tracking active
          <button className="p-1 hover:bg-background rounded text-accent transition-colors" onClick={handleRecenter}>
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
