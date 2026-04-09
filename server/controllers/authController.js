import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

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

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, passwordHash });

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
    console.error('Registration error:', err);
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

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

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
    console.error('Login error:', err);
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

/**
 * GET /api/auth/me
 * Return the current user from the JWT cookie.
 */
export const me = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user: { id: user._id, name: user.name, email: user.email, targetRoles: user.targetRoles } });
  } catch (err) {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

/**
 * PUT /api/auth/update
 * Update the user's email, password, or targetRoles.
 */
export const updateProfile = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { email, password, targetRoles } = req.body;

    if (email) user.email = email;
    if (targetRoles) user.targetRoles = targetRoles;
    
    if (password) {
      const salt = await bcrypt.genSalt(12);
      user.passwordHash = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: { id: user._id, name: user.name, email: user.email, targetRoles: user.targetRoles }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error during profile update' });
  }
};
