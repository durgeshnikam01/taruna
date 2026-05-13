require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/proposals', require('./routes/proposalRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/pricing', require('./routes/pricingRoutes'));

// API Welcome Route
app.get('/', (req, res) => {
  res.json({ message: "Taruna Proposals API is running..." });
});

// 404 Route Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found"
  });
});

// Global Error Handler
const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
