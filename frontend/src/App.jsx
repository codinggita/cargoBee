import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './features/authSlice';
import { getLocalItem } from './utils/storage';

import SplashScreen from './pages/SplashScreen';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Register from './pages/Register';

const Home = lazy(() => import('./pages/Home'));
const AddressSearch = lazy(() => import('./pages/AddressSearch'));
const DriverMatching = lazy(() => import('./pages/DriverMatching'));
const LiveTracking = lazy(() => import('./pages/LiveTracking'));
const TripCompletion = lazy(() => import('./pages/TripCompletion'));
const RateExperience = lazy(() => import('./pages/RateExperience'));
const Trips = lazy(() => import('./pages/Trips'));

const LoadingScreen = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#F5A623] border-t-transparent"></div>
  </div>
);

const App = () => {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const token = getLocalItem('cargobee_token');
    let user = getLocalItem('cargobee_user');

    if (typeof user === 'string') {
      try { user = JSON.parse(user); } catch (e) {
        console.error('Failed to parse user from local storage');
      }
    }

    if (token && user) {
      dispatch(loginSuccess({ user, token }));
    }
    setIsInitializing(false);
  }, [dispatch]);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Navigate to="/splash" replace />} />

          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/address-search" element={<AddressSearch />} />
          <Route path="/driver-matching" element={<DriverMatching />} />
          <Route path="/live-tracking" element={<LiveTracking />} />
          <Route path="/trip-completion" element={<TripCompletion />} />
          <Route path="/rate-experience" element={<RateExperience />} />
          <Route path="/trips" element={<Trips />} />

          {/* Placeholders for upcoming pages */}
          <Route path="/profile" element={
            <div className="min-h-screen flex items-center justify-center bg-background">
              <h1 className="text-2xl font-bold text-accent">Profile (Coming in next chunk)</h1>
            </div>
          } />
          <Route path="/driver/dashboard" element={
            <div className="min-h-screen flex items-center justify-center bg-background">
              <h1 className="text-2xl font-bold text-accent">Driver Dashboard (Coming in later chunk)</h1>
            </div>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
