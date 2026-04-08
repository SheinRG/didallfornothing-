export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-[#111]/80 backdrop-blur-md border border-[#222] rounded-3xl p-8 shadow-2xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Ready for: no further connections needed
