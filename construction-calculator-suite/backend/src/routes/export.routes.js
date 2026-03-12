/**
 * PDF Export Routes
 * GET /api/export/calculation/:id  - Export a single calculation as PDF
 * GET /api/export/project/:id      - Export all project calculations as PDF
 */

const express = require('express');
const PDFDocument = require('pdfkit');
const pool = require('../config/db');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

// Helper: format calculator type for display
function formatType(type) {
  return type
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Helper: write key-value pairs to PDF
function writeDataBlock(doc, title, data, x, startY) {
  let y = startY;
  doc.fontSize(12).font('Helvetica-Bold').text(title, x, y);
  y += 20;
  doc.font('Helvetica').fontSize(10);

  for (const [key, value] of Object.entries(data)) {
    const label = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    doc.text(`${label}: ${value}`, x, y);
    y += 16;
  }
  return y + 10;
}

// ==================== EXPORT SINGLE CALCULATION ====================
router.get('/calculation/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM calculations WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Calculation not found.' });
    }

    const calc = result.rows[0];
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=calculation-${calc.id.slice(0, 8)}.pdf`
    );
    doc.pipe(res);

    // Header
    doc.fontSize(20).font('Helvetica-Bold').text('Construction Calculator Suite', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(14).text(formatType(calc.calculator_type), { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(9).font('Helvetica').text(
      `Generated: ${new Date(calc.created_at).toLocaleString()}`,
      { align: 'center' }
    );
    doc.moveDown(1);

    // Divider
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(1);

    // Input data
    let y = doc.y;
    y = writeDataBlock(doc, 'Input Parameters', calc.input_data, 50, y);

    // Result data
    y = writeDataBlock(doc, 'Results', calc.result_data, 50, y);

    // Notes
    if (calc.notes) {
      doc.fontSize(12).font('Helvetica-Bold').text('Notes', 50, y);
      y += 20;
      doc.font('Helvetica').fontSize(10).text(calc.notes, 50, y);
    }

    doc.end();
  } catch (err) {
    next(err);
  }
});

// ==================== EXPORT PROJECT CALCULATIONS ====================
router.get('/project/:id', async (req, res, next) => {
  try {
    // Verify project ownership
    const projectResult = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const project = projectResult.rows[0];

    // Get all calculations for this project
    const calcResult = await pool.query(
      'SELECT * FROM calculations WHERE project_id = $1 ORDER BY created_at DESC',
      [req.params.id]
    );

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=project-${project.project_name.replace(/\s+/g, '-')}.pdf`
    );
    doc.pipe(res);

    // Title page
    doc.fontSize(22).font('Helvetica-Bold').text('Construction Calculator Suite', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(16).text(`Project: ${project.project_name}`, { align: 'center' });
    doc.moveDown(0.3);
    if (project.description) {
      doc.fontSize(10).font('Helvetica').text(project.description, { align: 'center' });
      doc.moveDown(0.3);
    }
    doc.fontSize(9).text(
      `Created: ${new Date(project.created_at).toLocaleString()} | Calculations: ${calcResult.rows.length}`,
      { align: 'center' }
    );
    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(1);

    // Each calculation
    for (const calc of calcResult.rows) {
      doc.fontSize(13).font('Helvetica-Bold').text(formatType(calc.calculator_type));
      doc.fontSize(8).font('Helvetica').text(new Date(calc.created_at).toLocaleString());
      doc.moveDown(0.5);

      let y = doc.y;
      y = writeDataBlock(doc, 'Inputs', calc.input_data, 60, y);
      y = writeDataBlock(doc, 'Results', calc.result_data, 60, y);

      doc.moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(545, doc.y).dash(3, { space: 3 }).stroke();
      doc.undash();
      doc.moveDown(1);

      // Add new page if too close to bottom
      if (doc.y > 680) {
        doc.addPage();
      }
    }

    doc.end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
