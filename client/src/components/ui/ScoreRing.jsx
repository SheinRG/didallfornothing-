import { motion } from 'framer-motion';

/**
 * ScoreRing — SVG circle that animates filling based on a score prop (0–10).
 * Uses primary-600 for the active stroke.
 */
export default function ScoreRing({ score = 0, label = '', size = 100 }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-primary-100 dark:text-surface-800"
        />
        {/* Animated score arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="text-primary-600"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </svg>
      <div className="flex flex-col items-center -mt-[calc(50%+0.5rem)] mb-8">
        <span className="text-2xl font-medium text-surface-900 dark:text-surface-50">
          {score}
        </span>
      </div>
      {label && (
        <span className="text-xs font-medium text-surface-400 dark:text-surface-200">
          {label}
        </span>
      )}
    </div>
  );
}

// Ready for: no further connections needed
