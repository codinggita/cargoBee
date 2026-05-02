import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Navigation, X, Loader2, Search } from 'lucide-react';

const AddressSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const type = location.state?.type || 'pickup';

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);

  const inputRef = useRef(null);
  const autocompleteService = useRef(null);
  const geocoderRef = useRef(null);
  const debounceTimer = useRef(null);

  // Wait for Google Maps to be ready (it's already loaded by Home.jsx)
  useEffect(() => {
    const checkReady = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        geocoderRef.current = new window.google.maps.Geocoder();
        setMapsReady(true);
      } else {
        setTimeout(checkReady, 100);
      }
    };
    checkReady();
  }, []);

  // Auto-focus input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Debounced search
  const fetchSuggestions = useCallback((input) => {
    if (!autocompleteService.current || !input.trim()) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    autocompleteService.current.getPlacePredictions(
      {
        input,
        componentRestrictions: { country: 'in' },
        types: ['geocode', 'establishment'],
      },
      (results, status) => {
        setSearching(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          setSuggestions(results);
        } else {
          setSuggestions([]);
        }
      }
    );
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    clearTimeout(debounceTimer.current);
    if (val.length < 2) {
      setSuggestions([]);
      return;
    }
    debounceTimer.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  // Resolve place_id → lat/lng → save → navigate back
  const selectSuggestion = async (suggestion) => {
    const address = suggestion.description;
    setSuggestions([]);
    setQuery(address);

    try {
      const result = await new Promise((resolve, reject) => {
        geocoderRef.current.geocode({ placeId: suggestion.place_id }, (results, status) => {
          if (status === 'OK' && results[0]) resolve(results[0]);
          else reject(new Error('Geocode failed: ' + status));
        });
      });

      const lat = result.geometry.location.lat();
      const lng = result.geometry.location.lng();

      sessionStorage.setItem(`temp_${type}`, JSON.stringify({ address, lat, lng }));
      navigate(-1);
    } catch (err) {
      console.error(err);
      // Still navigate back with just the address text
      sessionStorage.setItem(`temp_${type}`, JSON.stringify({ address, lat: null, lng: null }));
      navigate(-1);
    }
  };

  // Submit manually typed text
  const handleManualSubmit = async () => {
    if (!query.trim()) return;

    // If there are suggestions, select the first one
    if (suggestions.length > 0) {
      selectSuggestion(suggestions[0]);
      return;
    }

    // Otherwise geocode free-text
    try {
      const result = await new Promise((resolve, reject) => {
        geocoderRef.current.geocode(
          { address: query, componentRestrictions: { country: 'in' } },
          (results, status) => {
            if (status === 'OK' && results[0]) resolve(results[0]);
            else reject(new Error('Geocode failed'));
          }
        );
      });

      const address = result.formatted_address;
      const lat = result.geometry.location.lat();
      const lng = result.geometry.location.lng();
      sessionStorage.setItem(`temp_${type}`, JSON.stringify({ address, lat, lng }));
      navigate(-1);
    } catch {
      // Just store as-is without coordinates
      sessionStorage.setItem(`temp_${type}`, JSON.stringify({ address: query, lat: null, lng: null }));
      navigate(-1);
    }
  };

  // GPS Current Location
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        geocoderRef.current.geocode(
          { location: { lat: latitude, lng: longitude } },
          (results, status) => {
            setGpsLoading(false);
            if (status === 'OK' && results[0]) {
              const address = results[0].formatted_address;
              sessionStorage.setItem(
                `temp_${type}`,
                JSON.stringify({ address, lat: latitude, lng: longitude })
              );
              navigate(-1);
            } else {
              alert('Could not reverse-geocode your location.');
            }
          }
        );
      },
      () => {
        setGpsLoading(false);
        alert('Unable to retrieve your location. Please allow location access in your browser settings.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const clearInput = () => {
    setQuery('');
    setSuggestions([]);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/60 sm:p-6">
      <div
        className="flex-1 bg-surface sm:rounded-3xl shadow-2xl flex flex-col w-full max-w-2xl mx-auto overflow-hidden"
        style={{ animation: 'slideUp 0.25s ease-out' }}
      >
        {/* Header */}
        <div className="p-4 border-b border-border bg-surface shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <ArrowLeft size={22} className="text-accent" />
            </button>
            <h2 className="font-bold text-lg text-accent">
              {type === 'pickup' ? '📍 Enter Pickup Location' : '🏁 Enter Drop Location'}
            </h2>
          </div>

          {/* Search Input */}
          <div className="relative flex items-center gap-2">
            <div
              className={`absolute left-4 w-2.5 h-2.5 rounded-full z-10 ${
                type === 'pickup' ? 'bg-success ring-4 ring-success/20' : 'bg-error ring-4 ring-error/20'
              }`}
            />
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-background border-2 border-border rounded-xl py-4 pl-12 pr-24 text-accent font-medium outline-none focus:border-primary transition-all placeholder:text-textSecondary"
              placeholder={mapsReady ? 'Search any location in India...' : 'Loading map...'}
              value={query}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
              disabled={!mapsReady}
            />

            <div className="absolute right-2 flex items-center gap-1">
              {query && (
                <button
                  onClick={clearInput}
                  className="p-2 text-textSecondary hover:text-accent rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
              <button
                onClick={handleManualSubmit}
                disabled={!query.trim() || !mapsReady}
                className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-40 transition-colors"
              >
                {searching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* GPS Button */}
          <button
            onClick={handleCurrentLocation}
            disabled={gpsLoading || !mapsReady}
            className="w-full flex items-center gap-4 p-4 bg-surface hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-b border-border active:scale-[0.99]"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              {gpsLoading ? <Loader2 size={20} className="animate-spin" /> : <Navigation size={20} />}
            </div>
            <div className="text-left">
              <div className="font-semibold text-primary">Use Current Location</div>
              <div className="text-xs text-textSecondary mt-0.5">
                {gpsLoading ? 'Fetching your GPS location...' : 'Tap to use GPS'}
              </div>
            </div>
          </button>

          {/* Suggestions / Placeholder */}
          <div className="p-3">
            {suggestions.length > 0 && (
              <>
                <div className="text-[10px] font-bold text-textSecondary tracking-widest px-2 mb-2 uppercase">
                  Search Results
                </div>
                <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm divide-y divide-border">
                  {suggestions.map((s) => (
                    <button
                      key={s.place_id}
                      onClick={() => selectSuggestion(s)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left group"
                    >
                      <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                      <div className="flex-1 overflow-hidden">
                        <div className="font-semibold text-accent truncate text-sm group-hover:text-primary transition-colors">
                          {s.structured_formatting.main_text}
                        </div>
                        <div className="text-xs text-textSecondary truncate mt-0.5">
                          {s.structured_formatting.secondary_text}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {suggestions.length === 0 && !query && (
              <div className="py-12 text-center">
                <MapPin size={40} className="text-primary/30 mx-auto mb-3" />
                <p className="text-textSecondary text-sm">Start typing to search any location across India</p>
                <p className="text-textSecondary/60 text-xs mt-1">Powered by Google Maps</p>
              </div>
            )}

            {searching && (
              <div className="py-8 flex flex-col items-center gap-2 text-textSecondary text-sm">
                <Loader2 size={22} className="animate-spin text-primary" />
                <span>Searching...</span>
              </div>
            )}

            {!searching && query.length >= 2 && suggestions.length === 0 && (
              <div className="py-8 text-center text-textSecondary text-sm">
                <p>No results found for <span className="font-semibold text-accent">"{query}"</span></p>
                <p className="text-xs mt-1 text-textSecondary/60">Press Enter or tap 🔍 to search anyway</p>
              </div>
            )}
          </div>
        </div>

        {/* Confirm Footer */}
        {query.trim() && (
          <div className="p-4 border-t border-border bg-surface">
            <button
              onClick={handleManualSubmit}
              className="w-full bg-primary hover:bg-primary/90 active:scale-[0.98] text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
            >
              <MapPin size={18} />
              Confirm: {query.length > 40 ? query.slice(0, 40) + '...' : query}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(24px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AddressSearch;
