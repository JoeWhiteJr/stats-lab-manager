const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Get all published projects (no auth required)
router.get('/projects', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const offset = Math.max(parseInt(req.query.offset) || 0, 0);

    const countResult = await db.query('SELECT COUNT(*) FROM published_projects');
    const total = parseInt(countResult.rows[0].count);

    const result = await db.query(`
      SELECT
        pp.id,
        pp.project_id,
        pp.published_title,
        pp.published_description,
        pp.published_image,
        pp.published_status,
        pp.published_at
      FROM published_projects pp
      ORDER BY pp.published_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    res.json({ projects: result.rows, total, limit, offset });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
