const variants = {
  success:
    'bg-accent-50 text-accent-600 border border-accent-200/30 dark:bg-accent-900/40 dark:text-accent-200 dark:border-accent-200/20',
  warning:
    'bg-warning-50 text-warning-600 border border-warning-200/30 dark:bg-warning-800/30 dark:text-warning-200 dark:border-warning-200/20',
  default:
    'bg-surface-50 text-surface-600 border border-surface-200/30 dark:bg-surface-800 dark:text-surface-200 dark:border-surface-200/20',
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
