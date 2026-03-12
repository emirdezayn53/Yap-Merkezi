/**
 * Authentication Routes
 * POST /api/auth/signup  - Register a new user
 * POST /api/auth/login   - Login and receive JWT
 * GET  /api/auth/me      - Get current user profile
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// Helper: generate JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// ==================== SIGNUP ====================
router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, fullName, company } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    // Check if user already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // Hash password and create user
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, company)
       VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, company, created_at`,
      [email.toLowerCase(), passwordHash, fullName || null, company || null]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        company: user.company,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ==================== LOGIN ====================
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user by email
    const result = await pool.query(
      'SELECT id, email, password_hash, full_name, company FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        company: user.company,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ==================== GET CURRENT USER ====================
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, email, full_name, company, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      company: user.company,
      createdAt: user.created_at,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
