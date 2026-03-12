/**
 * Project Routes
 * CRUD operations for user projects
 * All routes require authentication
 */

const express = require('express');
const pool = require('../config/db');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

// All project routes require authentication
router.use(authMiddleware);

// ==================== CREATE PROJECT ====================
router.post('/', async (req, res, next) => {
  try {
    const { projectName, description } = req.body;

    if (!projectName) {
      return res.status(400).json({ error: 'Project name is required.' });
    }

    const result = await pool.query(
      `INSERT INTO projects (user_id, project_name, description)
       VALUES ($1, $2, $3)
       RETURNING id, project_name, description, status, created_at`,
      [req.user.id, projectName, description || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// ==================== LIST USER PROJECTS ====================
router.get('/', async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, 
             COUNT(c.id) AS calculation_count
      FROM projects p
      LEFT JOIN calculations c ON c.project_id = p.id
      WHERE p.user_id = $1
    `;
    const params = [req.user.id];
    let paramIndex = 2;

    if (status) {
      query += ` AND p.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (search) {
      query += ` AND p.project_name ILIKE $${paramIndex}`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` GROUP BY p.id ORDER BY p.updated_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const result = await pool.query(query, params);

    // Get total count for pagination
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM projects WHERE user_id = $1',
      [req.user.id]
    );

    res.json({
      projects: result.rows,
      total: parseInt(countResult.rows[0].count, 10),
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
  } catch (err) {
    next(err);
  }
});

// ==================== GET SINGLE PROJECT ====================
router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT p.*,
              json_agg(
                json_build_object(
                  'id', c.id,
                  'calculator_type', c.calculator_type,
                  'input_data', c.input_data,
                  'result_data', c.result_data,
                  'notes', c.notes,
                  'created_at', c.created_at
                ) ORDER BY c.created_at DESC
              ) FILTER (WHERE c.id IS NOT NULL) AS calculations
       FROM projects p
       LEFT JOIN calculations c ON c.project_id = p.id
       WHERE p.id = $1 AND p.user_id = $2
       GROUP BY p.id`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// ==================== UPDATE PROJECT ====================
router.put('/:id', async (req, res, next) => {
  try {
    const { projectName, description, status } = req.body;

    const result = await pool.query(
      `UPDATE projects
       SET project_name = COALESCE($1, project_name),
           description = COALESCE($2, description),
           status = COALESCE($3, status)
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [projectName, description, status, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// ==================== DELETE PROJECT ====================
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    res.json({ message: 'Project deleted successfully.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
