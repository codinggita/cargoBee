import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CheckCircle, Camera, Navigation, Phone } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import Button from '../components/Button';
import FileUpload from '../components/FileUpload';
import ThemeToggle from '../components/ThemeToggle';

const mapContainerStyle = { width: '100%', height: '100%' };
const center = { lat: 12.9716, lng: 77.5946 }; // Bangalore
const libraries = ['places'];

const DriverActiveTrip = () => {
  const navigate = useNavigate();
  const [showDeliveryUpload, setShowDeliveryUpload] = useState(false);
  const [deliveryPhoto, setDeliveryPhoto] = useState(null);
  const [completing, setCompleting] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const handleCompleteTrip = () => {
    if (!deliveryPhoto) { setShowDeliveryUpload(true); return; }
    setCompleting(true);
    setTimeout(() => {
      navigate('/driver/dashboard');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-surface z-50 flex flex-col font-sans">

      {/* Header */}
      <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-success rounded-full shadow-[0_0_8px_#22c55e]"></div>
          <span className="font-bold text-accent">Active Trip</span>
        </div>
        <div className="text-sm font-bold text-primaryDark bg-primary/10 px-3 py-1.5 rounded-full">
          TRIP #CB-0042
        </div>
      </header>

      {/* Map */}
      <div className="flex-1 relative">
        {isLoaded ? (
          <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={13}>
            <Marker position={center} label="📍" />
            <Marker position={{ lat: 12.9800, lng: 77.6100 }} label="🏁" />
            <Polyline
              path={[center, { lat: 12.9800, lng: 77.6100 }]}
              options={{ strokeColor: '#f59e0b', strokeWeight: 5, strokeOpacity: 0.9 }}
            />
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-background">
            <span className="text-textSecondary">Loading map…</span>
          </div>
        )}

        {/* Floating ETA card */}
        <div className="absolute top-4 left-4 right-4 bg-surface rounded-2xl shadow-lg p-4 flex items-center justify-between border border-border">
          <div className="flex items-center gap-3">
            <Navigation size={20} className="text-primary" />
            <div>
              <div className="font-bold text-accent">ETA to Drop-off</div>
              <div className="text-textSecondary text-sm">Koramangala, 4th Block</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-primary">18 min</div>
            <div className="text-xs text-textSecondary">3.4 km left</div>
          </div>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="bg-surface border-t border-border p-6 space-y-4 shrink-0">

        {showDeliveryUpload && (
          <div className="mb-2">
            <FileUpload
              label="Upload Delivery Photo (required)"
              accept="image/*"
              onFileSelect={(f) => setDeliveryPhoto(f)}
            />
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 py-3.5 border-border hover:bg-background flex items-center justify-center gap-2"
          >
            <Phone size={18} />
            Call Customer
          </Button>
          <Button
            className={`flex-1 py-3.5 flex items-center justify-center gap-2 ${completing ? 'opacity-70 pointer-events-none' : ''
              }`}
            onClick={handleCompleteTrip}
          >
            {completing ? (
              <span>Completing…</span>
            ) : (
              <>
                {deliveryPhoto ? <CheckCircle size={18} /> : <Camera size={18} />}
                {deliveryPhoto ? 'Complete Trip' : 'Add Delivery Photo'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DriverActiveTrip;
