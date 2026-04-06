import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for the /api/feedback endpoint.
 * 10 requests per hour per IP address.
 */
export const feedbackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many feedback requests — please try again in an hour.',
  },
});

// Ready for: no further connections needed
