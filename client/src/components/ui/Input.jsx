import { useId } from 'react';

export default function Input({ label, error, className = '', ...props }) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-[#ccc]"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-xl border border-[#333] bg-[#1a1a1a] px-4 py-3.5 text-sm text-white placeholder:text-[#666] transition-colors focus:border-[#E8563B] focus:outline-none focus:ring-2 focus:ring-[#E8563B]/20 ${
          error ? 'border-red-500 focus:ring-red-500/20' : ''
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
