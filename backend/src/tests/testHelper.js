const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

/**
 * Create a test user directly in the DB (bypasses approval flow)
 * Returns { id, token, email, name, role }
 */
async function createTestUser({ name, firstName, lastName, email, password = 'password123', role = 'researcher' }) {
  // Support both name (legacy) and firstName/lastName
  const first = firstName || (name ? name.split(' ')[0] : 'Test');
  const last = lastName || (name && name.includes(' ') ? name.split(' ').slice(1).join(' ') : 'User');
  const passwordHash = await bcrypt.hash(password, 4); // low rounds for speed
  const result = await db.query(
    'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, first_name, last_name, role',
    [email, passwordHash, first, last, role]
  );
  const user = result.rows[0];
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return { ...user, token };
}

module.exports = { createTestUser };
