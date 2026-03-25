const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Generate unique claim number
const generateClaimNumber = () => {
  return 'CLM-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Get all claims
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM claims ORDER BY submitted_date DESC'
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get claim by ID
router.get('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM claims WHERE id = ?', [req.params.id]);
    connection.release();
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Claim not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new claim
router.post('/', async (req, res) => {
  const { description, amount, user_id } = req.body;
  
  if (!description || !amount) {
    return res.status(400).json({ error: 'Description and amount are required' });
  }

  const claimNumber = generateClaimNumber();

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO claims (claim_number, description, amount, user_id) VALUES (?, ?, ?, ?)',
      [claimNumber, description, amount, user_id || null]
    );
    connection.release();
    res.status(201).json({
      id: result.insertId,
      claim_number: claimNumber,
      description,
      amount,
      status: 'Pending',
      message: 'Claim submitted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update claim status
router.put('/:id', async (req, res) => {
  const { status, description, amount } = req.body;
  
  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE claims SET status = ?, description = ?, amount = ? WHERE id = ?',
      [status || 'Pending', description, amount, req.params.id]
    );
    connection.release();
    res.json({ message: 'Claim updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete claim
router.delete('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM claims WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Claim deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
