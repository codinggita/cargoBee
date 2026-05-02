import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import Input from '../components/Input';
import Button from '../components/Button';
import { loginValidationSchema } from '../utils/validators';
import { loginSuccess } from '../features/authSlice';
import { setLocalItem } from '../utils/storage';
import beeLogo from '../assets/bee-logo.png';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup } from 'firebase/auth';
import { loginUser, googleAuthApi } from '../services/authService';
import toast from 'react-hot-toast';

const Login = () => {
  const [role, setRole] = useState('consumer');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ── Email + Password Login ─────────────────────────────────────────────────
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await loginUser(values.email, values.password);
        const { token, user: dbUser } = res.data;

        dispatch(loginSuccess({ user: { ...dbUser, role: dbUser.role || role }, token }));
        setLocalItem('cargobee_token', token);
        setLocalItem('cargobee_user', JSON.stringify({ ...dbUser, role: dbUser.role || role }));

        toast.success(`Welcome back, ${dbUser.name}!`);
        navigate(dbUser.role === 'driver' ? '/driver/dashboard' : '/home');
      } catch (err) {
        const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
  });

  // ── Google Sign-In ─────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    try {
      // 1. Firebase Google popup
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // 2. Sync with our MongoDB backend
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

      toast.success(`Welcome back, ${firebaseUser.displayName}!`);
      navigate(dbUser.role === 'driver' ? '/driver/dashboard' : '/home');
    } catch (err) {
      console.error('Google login error:', err);
      if (err.code === 'auth/popup-closed-by-user') return; // user cancelled
      toast.error(err.response?.data?.message || 'Google sign-in failed. Please try again.');
    }
  };



  return (
    <PageWrapper className="flex flex-col relative page-enter">
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
            <h2 className="text-2xl font-bold text-accent mb-2">Welcome Back</h2>
            <p className="text-textSecondary text-sm">Sign in to continue</p>
          </div>

          {/* Role Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
            <button
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === 'consumer' ? 'bg-accent text-white dark:text-black shadow-sm' : 'hover:text-accent'
                }`}
              style={role !== 'consumer' ? { color: '#111' } : {}}
              onClick={() => setRole('consumer')}
            >
              Consumer
            </button>
            <button
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === 'driver' ? 'bg-accent text-white dark:text-black shadow-sm' : 'hover:text-accent'
                }`}
              style={role !== 'driver' ? { color: '#111' } : {}}
              onClick={() => setRole('driver')}
            >
              Driver Partner
            </button>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-5">

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

            <Button type="submit" fullWidth loading={loading}>
              Sign In
            </Button>

            {/* Divider */}
            <div className="relative flex items-center justify-center py-2">
              <div className="border-t border-border w-full" />
              <span className="bg-surface px-3 text-xs text-textSecondary absolute">OR</span>
            </div>

            {/* Google Sign-In */}
            <Button
              type="button"
              variant="outline"
              fullWidth
              className="flex items-center gap-3"
              onClick={handleGoogleLogin}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </Button>

            <p className="text-center text-sm text-textSecondary">
              New to CargoBee?{' '}
              <button
                type="button"
                className="text-primary font-semibold hover:underline"
                onClick={() => navigate('/register')}
              >
                Create an account
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

export default Login;
