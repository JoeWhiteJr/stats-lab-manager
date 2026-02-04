const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all projects
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT p.*, u.name as creator_name,
        (SELECT COUNT(*) FROM action_items WHERE project_id = p.id) as total_actions,
        (SELECT COUNT(*) FROM action_items WHERE project_id = p.id AND completed = true) as completed_actions
      FROM projects p
      JOIN users u ON p.created_by = u.id
    `;
    const params = [];

    if (status) {
      query += ' WHERE p.status = $1';
      params.push(status);
    }

    query += ' ORDER BY p.updated_at DESC';

    const result = await db.query(query, params);
    res.json({ projects: result.rows });
  } catch (error) {
    next(error);
  }
});

// Get single project
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT p.*, u.name as creator_name
      FROM projects p
      JOIN users u ON p.created_by = u.id
      WHERE p.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Project not found' } });
    }

    res.json({ project: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Create project
router.post('/', authenticate, requireRole('admin', 'project_lead'), [
  body('title').trim().notEmpty(),
  body('description').optional().trim()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Validation failed', details: errors.array() } });
    }

    const { title, description, header_image } = req.body;

    const result = await db.query(
      'INSERT INTO projects (title, description, header_image, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description || null, header_image || null, req.user.id]
    );

    res.status(201).json({ project: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Update project
router.put('/:id', authenticate, requireRole('admin', 'project_lead'), [
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim(),
  body('status').optional().isIn(['active', 'completed', 'archived']),
  body('progress').optional().isInt({ min: 0, max: 100 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: { message: 'Validation failed', details: errors.array() } });
    }

    const { title, description, header_image, status, progress } = req.body;

    const existing = await db.query('SELECT id FROM projects WHERE id = $1', [req.params.id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Project not found' } });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined) { updates.push(`title = $${paramCount++}`); values.push(title); }
    if (description !== undefined) { updates.push(`description = $${paramCount++}`); values.push(description); }
    if (header_image !== undefined) { updates.push(`header_image = $${paramCount++}`); values.push(header_image); }
    if (status !== undefined) { updates.push(`status = $${paramCount++}`); values.push(status); }
    if (progress !== undefined) { updates.push(`progress = $${paramCount++}`); values.push(progress); }

    if (updates.length === 0) {
      return res.status(400).json({ error: { message: 'No fields to update' } });
    }

    values.push(req.params.id);
    const result = await db.query(
      `UPDATE projects SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    res.json({ project: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Delete project
router.delete('/:id', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const result = await db.query('DELETE FROM projects WHERE id = $1 RETURNING id', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Project not found' } });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
