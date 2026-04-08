const variants = {
  success:
    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  warning:
    'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  default:
    'bg-[#222] text-[#ccc] border border-[#333]',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

// Ready for: no further connections needed
