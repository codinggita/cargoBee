import * as Yup from 'yup';

export const vehicleRegex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;

// ── Login: email + password ────────────────────────────────────────────────
export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

// ── Register: full name + email + password + confirm ──────────────────────
export const registerValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('Please confirm your password'),
});

// ── Driver registration step 2 (vehicle info) ────────────────────────────
export const registerStep2Schema = Yup.object({
  vehicleType: Yup.string()
    .oneOf(['mini_tempo', 'pickup_truck', 'e_cart'])
    .required('Vehicle type is required'),
  vehicleNumber: Yup.string()
    .matches(vehicleRegex, 'Enter valid vehicle number (e.g., MH02AB1234)')
    .required('Vehicle number is required'),
  aadharUpload: Yup.mixed().required('Aadhar card upload is required'),
});
