import { useId } from 'react';

export default function Input({ label, error, className = '', ...props }) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-surface-600 dark:text-surface-200"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-lg border border-primary-200/30 bg-white px-4 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 transition-colors focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/20 dark:bg-surface-800 dark:text-surface-50 dark:border-primary-200/20 dark:placeholder:text-surface-400 dark:focus:border-primary-400 ${
          error ? 'border-danger-400 focus:ring-danger-400/20' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-danger-400">{error}</p>
      )}
    </div>
  );
}

// Ready for: no further connections needed
