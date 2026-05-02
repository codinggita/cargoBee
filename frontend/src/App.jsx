import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './features/authSlice';
import { getLocalItem } from './utils/storage';

// Eagerly loaded pages
import SplashScreen from './pages/SplashScreen';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Register from './pages/Register';

const LoadingScreen = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#F5A623] border-t-transparent"></div>
  </div>
);

const App = () => {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  // Hydrate auth state from localStorage on app load
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

          <Route path="/home" element={
            <div className="min-h-screen flex items-center justify-center bg-background">
              <h1 className="text-2xl font-bold text-accent">Home Page (Coming in Chunk 3)</h1>
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
