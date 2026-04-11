import jwt from 'jsonwebtoken';

/**
 * Protect routes by verifying the JWT stored in an httpOnly cookie.
 * Attaches the decoded payload (userId, email) to req.user.
 */
const protect = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated — no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = decoded; // { userId, email, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authenticated — invalid token' });
  }
};

export default protect;

// Ready for: no further connections needed
