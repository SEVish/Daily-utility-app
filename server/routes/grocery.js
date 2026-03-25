const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all grocery items (optionally filtered by user)
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    let query = 'SELECT * FROM grocery_items ORDER BY category, name';
    const [rows] = await connection.execute(query);
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get grocery items by category
router.get('/category/:category', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM grocery_items WHERE category = ? ORDER BY name',
      [req.params.category]
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new grocery item
router.post('/', async (req, res) => {
  const { name, category, user_id } = req.body;
  
  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO grocery_items (name, category, user_id) VALUES (?, ?, ?)',
      [name, category, user_id || null]
    );
    connection.release();
    res.status(201).json({
      id: result.insertId,
      name,
      category,
      is_completed: false,
      message: 'Item added successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle grocery item completion
router.put('/:id/toggle', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    // First, get current status
    const [rows] = await connection.execute('SELECT is_completed FROM grocery_items WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const newStatus = !rows[0].is_completed;
    await connection.execute('UPDATE grocery_items SET is_completed = ? WHERE id = ?', [newStatus, req.params.id]);
    connection.release();
    res.json({ message: 'Item toggled successfully', is_completed: newStatus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update grocery item
router.put('/:id', async (req, res) => {
  const { name, category, is_completed } = req.body;
  
  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE grocery_items SET name = ?, category = ?, is_completed = ? WHERE id = ?',
      [name, category, is_completed, req.params.id]
    );
    connection.release();
    res.json({ message: 'Item updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete grocery item
router.delete('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM grocery_items WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
