/**
 * Calculation Routes
 * POST /api/calculations       - Run and save a calculation
 * GET  /api/calculations        - Get user's calculation history
 * GET  /api/calculations/:id    - Get a single calculation
 * DELETE /api/calculations/:id  - Delete a calculation
 */

const express = require('express');
const pool = require('../config/db');
const { authMiddleware } = require('../middleware/auth.middleware');
const { runCalculation } = require('../utils/calculators');

const router = express.Router();

router.use(authMiddleware);

// Valid calculator types
const VALID_TYPES = [
  'concrete_volume',
  'rebar_weight',
  'excavation_volume',
  'wall_materials',
  'construction_cost',
];

// ==================== RUN & SAVE CALCULATION ====================
router.post('/', async (req, res, next) => {
  try {
    const { calculatorType, inputData, projectId, notes } = req.body;

    // Validate calculator type
    if (!VALID_TYPES.includes(calculatorType)) {
      return res.status(400).json({
        error: `Invalid calculator type. Must be one of: ${VALID_TYPES.join(', ')}`,
      });
    }

    if (!inputData || typeof inputData !== 'object') {
      return res.status(400).json({ error: 'inputData is required and must be an object.' });
    }

    // If projectId is provided, verify it belongs to the user
    if (projectId) {
      const projectCheck = await pool.query(
        'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
        [projectId, req.user.id]
      );
      if (projectCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Project not found.' });
      }
    }

    // Run the calculation
    const resultData = runCalculation(calculatorType, inputData);

    // Save to database
    const result = await pool.query(
      `INSERT INTO calculations (user_id, project_id, calculator_type, input_data, result_data, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        req.user.id,
        projectId || null,
        calculatorType,
        JSON.stringify(inputData),
        JSON.stringify(resultData),
        notes || null,
      ]
    );

    res.status(201).json({
      calculation: result.rows[0],
      result: resultData,
    });
  } catch (err) {
    // If it's a calculator validation error, return 400
    if (err.message.startsWith('Unknown calculator type')) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// ==================== GET CALCULATION HISTORY ====================
router.get('/', async (req, res, next) => {
  try {
    const { calculatorType, projectId, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM calculations WHERE user_id = $1';
    const params = [req.user.id];
    let paramIndex = 2;

    if (calculatorType) {
      query += ` AND calculator_type = $${paramIndex}`;
      params.push(calculatorType);
      paramIndex++;
    }

    if (projectId) {
      query += ` AND project_id = $${paramIndex}`;
      params.push(projectId);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const result = await pool.query(query, params);

    // Total count
    let countQuery = 'SELECT COUNT(*) FROM calculations WHERE user_id = $1';
    const countParams = [req.user.id];
    if (calculatorType) {
      countQuery += ' AND calculator_type = $2';
      countParams.push(calculatorType);
    }
    const countResult = await pool.query(countQuery, countParams);

    res.json({
      calculations: result.rows,
      total: parseInt(countResult.rows[0].count, 10),
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
  } catch (err) {
    next(err);
  }
});

// ==================== GET SINGLE CALCULATION ====================
router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM calculations WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Calculation not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// ==================== DELETE CALCULATION ====================
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM calculations WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Calculation not found.' });
    }

    res.json({ message: 'Calculation deleted successfully.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
