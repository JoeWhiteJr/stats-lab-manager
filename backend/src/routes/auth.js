const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticate, generateToken } = require('../middleware/auth');
const { logActivity } = require('./users');

const router = express.Router();

// Register - disabled, users must apply and be approved by an admin
// New accounts are created via the application approval flow (see routes/applications.js)
router.post('/register', (req, res) => {
  res.status(403).json({ error: { message: 'Registration is closed. Please submit an application at /apply.' } });
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Validation failed', details: errors.array() } });
    }

    const { email, password } = req.body;

    const result = await db.query(
      'SELECT id, email, password_hash, name, role, is_super_admin, avatar_url FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    const token = generateToken(user.id);

    // Log login activity for streak tracking
    logActivity(user.id, 'login');

    res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role, is_super_admin: user.is_super_admin, avatar_url: user.avatar_url },
      token
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Logout (client-side token removal, but we can add token blacklisting later)
router.post('/logout', authenticate, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Request password reset
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Valid email is required' } });
    }

    const { email } = req.body;
    const user = await db.query('SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL', [email]);

    // Always return success to prevent email enumeration
    if (user.rows.length === 0) {
      return res.json({ message: 'If an account exists with that email, a reset link has been generated.' });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.rows[0].id, token, expiresAt]
    );

    // In a real app, this would send an email. For now, log the token.
    console.log(`Password reset token for ${email}: ${token}`);

    res.json({ message: 'If an account exists with that email, a reset link has been generated.' });
  } catch (error) {
    next(error);
  }
});

// Reset password with token
router.post('/reset-password', [
  body('token').notEmpty(),
  body('password').isLength({ min: 8 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Token and password (min 8 chars) are required' } });
    }

    const { token, password } = req.body;

    const result = await db.query(
      'SELECT * FROM password_reset_tokens WHERE token = $1 AND used_at IS NULL AND expires_at > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: { message: 'Invalid or expired reset token' } });
    }

    const resetToken = result.rows[0];
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, resetToken.user_id]);

    // Mark token as used
    await db.query('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1', [resetToken.id]);

    res.json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
