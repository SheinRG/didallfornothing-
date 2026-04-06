import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// TODO: Import User model and use real DB operations when mongoose is connected
// import User from '../models/User.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * POST /api/auth/register
 * Hash password with bcrypt, create user, return JWT in httpOnly cookie.
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // TODO: Check if user already exists in DB
    // const existingUser = await User.findOne({ email });
    // if (existingUser) return res.status(409).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // TODO: Save user to DB
    // const user = await User.create({ name, email, passwordHash });
    const user = { _id: 'mock_user_id', name, email }; // mock

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );

    res.cookie('token', token, COOKIE_OPTIONS);
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * POST /api/auth/login
 * Verify password, return JWT in httpOnly cookie.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // TODO: Find user in DB
    // const user = await User.findOne({ email });
    // if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    // const isMatch = await bcrypt.compare(password, user.passwordHash);
    // if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Mock user for now
    const user = { _id: 'mock_user_id', name: 'Demo User', email };

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    );

    res.cookie('token', token, COOKIE_OPTIONS);
    res.status(200).json({
      message: 'Logged in successfully',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * POST /api/auth/logout
 * Clear the httpOnly cookie.
 */
export const logout = (_req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.status(200).json({ message: 'Logged out successfully' });
};

// Ready for: real User model DB operations (find, create)
