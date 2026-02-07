const express = require('express');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json({ results: [] });
    }

    const searchTerm = `%${q.trim()}%`;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Search projects (user has access to)
    const projectsQuery = isAdmin
      ? `SELECT id, title, 'project' as type, status as subtitle FROM projects WHERE title ILIKE $1 OR description ILIKE $1 LIMIT 5`
      : `SELECT DISTINCT p.id, p.title, 'project' as type, p.status as subtitle
         FROM projects p
         LEFT JOIN action_items ai ON ai.project_id = p.id
         LEFT JOIN action_item_assignees aia ON aia.action_item_id = ai.id
         WHERE (p.title ILIKE $1 OR p.description ILIKE $1)
         AND (p.created_by = $2 OR ai.assigned_to = $2 OR aia.user_id = $2)
         LIMIT 5`;

    const projectsResult = await db.query(
      projectsQuery,
      isAdmin ? [searchTerm] : [searchTerm, userId]
    );

    // Search tasks
    const tasksQuery = isAdmin
      ? `SELECT a.id, a.title, 'task' as type, p.title as subtitle, a.project_id
         FROM action_items a LEFT JOIN projects p ON a.project_id = p.id
         WHERE a.title ILIKE $1 LIMIT 5`
      : `SELECT DISTINCT a.id, a.title, 'task' as type, p.title as subtitle, a.project_id
         FROM action_items a
         LEFT JOIN projects p ON a.project_id = p.id
         LEFT JOIN action_item_assignees aia ON aia.action_item_id = a.id
         WHERE a.title ILIKE $1
         AND (p.created_by = $2 OR a.assigned_to = $2 OR aia.user_id = $2)
         LIMIT 5`;

    const tasksResult = await db.query(
      tasksQuery,
      isAdmin ? [searchTerm] : [searchTerm, userId]
    );

    // Search chat messages
    const messagesQuery = `
      SELECT m.id, SUBSTRING(m.content, 1, 100) as title, 'message' as type,
        cr.name as subtitle, m.room_id
      FROM messages m
      JOIN chat_rooms cr ON m.room_id = cr.id
      JOIN chat_members cm ON cm.room_id = cr.id AND cm.user_id = $2
      WHERE m.content ILIKE $1 AND m.deleted_at IS NULL
      ORDER BY m.created_at DESC LIMIT 5`;

    const messagesResult = await db.query(messagesQuery, [searchTerm, userId]);

    const results = [
      ...projectsResult.rows.map(r => ({ ...r, url: `/dashboard/projects/${r.id}` })),
      ...tasksResult.rows.map(r => ({ ...r, url: `/dashboard/projects/${r.project_id}` })),
      ...messagesResult.rows.map(r => ({ ...r, url: `/dashboard/chat/${r.room_id}` }))
    ];

    res.json({ results });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
