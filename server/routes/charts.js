const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all saved datasets
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT id, dataset_name, dataset_type, user_id, created_at FROM saved_datasets ORDER BY created_at DESC'
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dataset by ID
router.get('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM saved_datasets WHERE id = ?',
      [req.params.id]
    );
    connection.release();
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Dataset not found' });
    }
    // Parse JSON data if stored as string
    const dataset = rows[0];
    if (typeof dataset.data === 'string') {
      dataset.data = JSON.parse(dataset.data);
    }
    res.json(dataset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save new dataset
router.post('/', async (req, res) => {
  const { dataset_name, dataset_type, data, user_id } = req.body;
  
  if (!dataset_name || !dataset_type || !data) {
    return res.status(400).json({ error: 'Dataset name, type, and data are required' });
  }

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO saved_datasets (dataset_name, dataset_type, data, user_id) VALUES (?, ?, ?, ?)',
      [dataset_name, dataset_type, JSON.stringify(data), user_id || null]
    );
    connection.release();
    res.status(201).json({
      id: result.insertId,
      dataset_name,
      dataset_type,
      message: 'Dataset saved successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update dataset
router.put('/:id', async (req, res) => {
  const { dataset_name, data } = req.body;
  
  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE saved_datasets SET dataset_name = ?, data = ? WHERE id = ?',
      [dataset_name, JSON.stringify(data), req.params.id]
    );
    connection.release();
    res.json({ message: 'Dataset updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete dataset
router.delete('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM saved_datasets WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Dataset deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
