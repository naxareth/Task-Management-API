const express = require('express');
const dotenv = require('dotenv');
const { sequelize, connectDB } = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to database
connectDB();

// Import routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to TaskFlow API' });
});

// Sync database models (will create tables if they don't exist)
sequelize.sync().then(() => {
  console.log('Database synced');
}).catch(err => {
  console.error('Error syncing database:', err);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});