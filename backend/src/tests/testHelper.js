const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

/**
 * Create a test user directly in the DB (bypasses approval flow)
 * Returns { id, token, email, name, role }
 */
async function createTestUser({ name, email, password = 'password123', role = 'researcher' }) {
  const passwordHash = await bcrypt.hash(password, 4); // low rounds for speed
  const result = await db.query(
    'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
    [email, passwordHash, name, role]
  );
  const user = result.rows[0];
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return { ...user, token };
}

module.exports = { createTestUser };
