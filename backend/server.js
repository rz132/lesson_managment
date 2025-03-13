require('dotenv').config(); // .env فائل کے لیے

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // Path module for handling file paths
const lessonsRoutes = require('./routes/lessons');
const ordersRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Failed to connect to MongoDB Atlas:', err));

// Serve static files from the Vue.js app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// API Routes
app.use('/api', lessonsRoutes);
app.use('/api', ordersRoutes);

// All other routes serve the Vue.js app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});