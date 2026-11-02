const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5001;

// Enable Cross-Origin Resource Sharing (allows Vite frontend to communicate with Express)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parser middleware (allows Express to read incoming JSON requests)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic test/health-check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ArjuVisuals API is running successfully'
  });
});

// Start listening for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

