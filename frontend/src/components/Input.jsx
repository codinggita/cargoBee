import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  prefix,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col gap-1 w-full ${containerClassName}`}>
      {label && <label className="text-sm font-medium text-textSecondary ml-1">{label}</label>}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-textSecondary">
            <Icon size={20} />
          </div>
        )}
        {prefix && (
          <div className="absolute left-4 flex items-center text-textPrimary font-medium">
            {prefix}
          </div>
        )}
        <input
          ref={ref}
          className={`cb-input ${Icon ? 'pl-11' : ''} ${prefix ? 'pl-16' : ''} ${error ? 'border-error focus:border-error focus:ring-error/20' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-error mt-1 ml-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
