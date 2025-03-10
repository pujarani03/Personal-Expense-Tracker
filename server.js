const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB with optimized settings
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 10000,
      family: 4 // Force IPv4
    });
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

// Initial database connection
connectDB();

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/transactions', require('./routes/api/transactions'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

// Only start server if database connection is successful
mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Please try a different port.`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
    }
  });
});

// Handle database connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});