export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`rounded-xl border border-primary-200/20 bg-white p-6 dark:bg-surface-800 dark:border-primary-200/10 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Ready for: no further connections needed
