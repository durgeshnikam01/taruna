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
  origin: process.env.NODE_ENV === 'production'
    ? false
    : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/proposals', require('./routes/proposalRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/pricing', require('./routes/pricingRoutes'));

// Error Handler
const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

// Serve frontend in production
const frontendDist = path.join(__dirname, '../frontend/dist');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(frontendDist, 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running on port ' + (process.env.PORT || 5001));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
