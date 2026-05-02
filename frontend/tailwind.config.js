/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary:       'rgb(var(--color-primary) / <alpha-value>)',
        primaryDark:   'rgb(var(--color-primary-dark) / <alpha-value>)',
        accent:        'rgb(var(--color-accent) / <alpha-value>)',
        secondary:     'rgb(var(--color-secondary) / <alpha-value>)',
        success:       'rgb(var(--color-success) / <alpha-value>)',
        error:         'rgb(var(--color-error) / <alpha-value>)',
        background:    'rgb(var(--color-background) / <alpha-value>)',
        surface:       'rgb(var(--color-surface) / <alpha-value>)',
        border:        'rgb(var(--color-border) / <alpha-value>)',
        textPrimary:   'rgb(var(--color-text-primary) / <alpha-value>)',
        textSecondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
        gray: {
          50: 'rgb(var(--color-gray-50) / <alpha-value>)',
          100: 'rgb(var(--color-gray-100) / <alpha-value>)',
          200: 'rgb(var(--color-gray-200) / <alpha-value>)',
          300: 'rgb(var(--color-gray-300) / <alpha-value>)',
          400: 'rgb(var(--color-gray-400) / <alpha-value>)',
          500: 'rgb(var(--color-gray-500) / <alpha-value>)',
          600: 'rgb(var(--color-gray-600) / <alpha-value>)',
          700: 'rgb(var(--color-gray-700) / <alpha-value>)',
          800: 'rgb(var(--color-gray-800) / <alpha-value>)',
          900: 'rgb(var(--color-gray-900) / <alpha-value>)',
        }
      },
      fontFamily: {
        sans:    ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        card:  '0 2px 16px rgba(0,0,0,0.08)',
        cardHover: '0 8px 32px rgba(0,0,0,0.12)',
        modal: '0 20px 60px rgba(0,0,0,0.18)',
      },
      borderRadius: {
        xl2: '1rem',
        xl3: '1.5rem',
      },
      keyframes: {
        pulse2: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%':       { opacity: '0.7', transform: 'scale(1.05)' },
        },
        ripple: {
          '0%':   { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        progressBar: {
          from: { width: '0%' },
          to:   { width: '100%' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'pulse2':    'pulse2 2s ease-in-out infinite',
        'ripple':    'ripple 1.8s ease-out infinite',
        'slide-up':  'slideUp 0.5s ease forwards',
        'fade-in':   'fadeIn 0.4s ease forwards',
        'progress':  'progressBar 2.5s linear forwards',
        'spin':      'spin 1s linear infinite',
        'float':     'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
