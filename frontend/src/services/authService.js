import api from './api';

/**
 * Auth Service — wraps all /api/auth endpoints
 */

/** Register a new user with email + password */
export const registerUser = (name, email, password, role) =>
  api.post('/auth/register', { name, email, password, role });

/** Login with email + password */
export const loginUser = (email, password) =>
  api.post('/auth/login', { email, password });

/** Google OAuth — upsert user in DB and return JWT */
export const googleAuthApi = ({ name, email, googleId, photoURL, role }) =>
  api.post('/auth/google', { name, email, googleId, photoURL, role });

/** Logout signal (stateless) */
export const logoutUser = () =>
  api.post('/auth/logout');
