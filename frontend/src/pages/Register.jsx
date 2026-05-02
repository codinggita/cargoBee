import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import Input from '../components/Input';
import Button from '../components/Button';
import { registerValidationSchema } from '../utils/validators';
import { loginSuccess } from '../features/authSlice';
import { setLocalItem } from '../utils/storage';
import beeLogo from '../assets/bee-logo.png';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import { registerUser, googleAuthApi } from '../services/authService';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const Register = () => {
  const [role, setRole] = useState('consumer');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ── Google Register ────────────────────────────────────────────────────────
  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      const res = await googleAuthApi({
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        googleId: firebaseUser.uid,
        photoURL: firebaseUser.photoURL,
        role,
      });

      const { token, user: dbUser } = res.data;

      dispatch(loginSuccess({ user: { ...dbUser, role: dbUser.role || role }, token }));
      setLocalItem('cargobee_token', token);
      setLocalItem('cargobee_user', JSON.stringify({ ...dbUser, role: dbUser.role || role }));

      toast.success(`Welcome to CargoBee, ${firebaseUser.displayName}!`);
      navigate(dbUser.role === 'driver' ? '/driver/dashboard' : '/home');
    } catch (err) {
      console.error('Google register error:', err);
      if (err.code === 'auth/popup-closed-by-user') return;
      toast.error(err.response?.data?.message || 'Google sign-in failed. Please try again.');
    }
  };

  // ── Email + Password Register ──────────────────────────────────────────────
  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await registerUser(values.name, values.email, values.password, role);
        const { token, user: dbUser } = res.data;

        dispatch(loginSuccess({ user: { ...dbUser, role: dbUser.role || role }, token }));
        setLocalItem('cargobee_token', token);
        setLocalItem('cargobee_user', JSON.stringify({ ...dbUser, role: dbUser.role || role }));

        toast.success(`Account created! Welcome, ${dbUser.name}!`);
        navigate(dbUser.role === 'driver' ? '/driver/dashboard' : '/home');
      } catch (err) {
        const msg = err.response?.data?.message || 'Registration failed. Please try again.';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <PageWrapper className="flex flex-col relative page-enter">
      <SEO title="Create Account" description="Join CargoBee today and get started with on-demand logistics." />
      {/* Decorative background */}
      <div
        className="absolute bottom-0 w-full h-48 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 320\'%3E%3Cpath fill=\'%231A1A2E\' fill-opacity=\'1\' d=\'M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z\'%3E%3C/path%3E%3C/svg%3E")',
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
        }}
      />

      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
        <div className="w-full max-w-md bg-surface p-8 rounded-3xl shadow-card dotted-card relative">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8 justify-center">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center p-2">
              <img src={beeLogo} alt="CargoBee" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-bold text-accent">CargoBee</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-accent mb-2">Create Account</h2>
            <p className="text-textSecondary text-sm">Join the CargoBee logistics network</p>
          </div>

          {/* Role Selector */}
          <div className="flex p-1 bg-gray-100 dark:bg-gray-200 rounded-xl mb-8">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === 'consumer' ? 'bg-accent text-white dark:text-black shadow-sm' : 'text-textSecondary hover:text-accent'
                }`}
              onClick={() => setRole('consumer')}
            >Consumer</button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === 'driver' ? 'bg-accent text-white dark:text-black shadow-sm' : 'text-textSecondary hover:text-accent'
                }`}
              onClick={() => setRole('driver')}
            >Driver Partner</button>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-5">

            {/* Full Name */}
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Full Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && formik.errors.name}
            />

            {/* Email */}
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email}
            />

            {/* Password */}
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && formik.errors.password}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-textSecondary hover:text-accent transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && formik.errors.confirmPassword}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-textSecondary hover:text-accent transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password strength hint */}
            {formik.values.password && !formik.errors.password && (
              <p className="text-xs text-success flex items-center gap-1">
                <ShieldCheck size={12} /> Strong password
              </p>
            )}

            <Button type="submit" fullWidth loading={loading}>
              Create Account
            </Button>

            {/* Divider */}
            <div className="relative flex items-center justify-center py-2">
              <div className="border-t border-border w-full" />
              <span className="bg-surface px-3 text-xs text-textSecondary absolute">OR</span>
            </div>

            {/* Google Register */}
            <Button
              type="button"
              variant="outline"
              fullWidth
              className="flex items-center gap-3"
              onClick={handleGoogleRegister}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Register with Google
            </Button>

            <p className="text-center text-sm text-textSecondary">
              Already have an account?{' '}
              <button
                type="button"
                className="text-primary font-semibold hover:underline"
                onClick={() => navigate('/login')}
              >
                Log in here
              </button>
            </p>
          </form>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-textSecondary text-xs font-medium">
          <ShieldCheck size={16} className="text-success" />
          Secured Logistics Ecosystem
        </div>
      </div>
    </PageWrapper>
  );
};

export default Register;
