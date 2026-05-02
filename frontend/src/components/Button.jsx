import React from 'react';

const Button = ({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'outline' | 'ghost'
  type = 'button',
  fullWidth = false,
  disabled = false,
  className = '',
  loading = false,
  ...props
}) => {
  const baseClasses = 'flex justify-center items-center font-semibold rounded-full px-6 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary hover:bg-primaryDark text-white active:scale-95 disabled:bg-primary/50 disabled:cursor-not-allowed',
    outline: 'bg-surface border-2 border-border hover:border-primary text-textPrimary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'bg-transparent text-textPrimary hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
