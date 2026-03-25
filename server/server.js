const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const pool = require('./config/db');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
const userRoutes = require('./routes/users');
const claimsRoutes = require('./routes/claims');
const groceryRoutes = require('./routes/grocery');
const chartRoutes = require('./routes/charts');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Server is running', timestamp: new Date() });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/claims', claimsRoutes);
app.use('/api/grocery', groceryRoutes);
app.use('/api/charts', chartRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
