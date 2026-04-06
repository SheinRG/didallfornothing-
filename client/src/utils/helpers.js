/**
 * Utility helpers for the client app.
 * Add shared formatting, validation, and API helpers here.
 */

/**
 * Format a date string to a readable format.
 * @param {string} dateStr - ISO date string
 * @returns {string}
 */
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Ready for: API fetch helpers, token handling, etc.
