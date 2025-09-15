const path = require('path');
const dotenv = require('dotenv');

const dotenvPath = path.join(__dirname, '..', '.env');
const dotenvResult = dotenv.config({ path: dotenvPath });

if (dotenvResult.error) {
  console.error('Error loading .env file:', dotenvResult.error);
} else if (dotenvResult.parsed) {
  console.log('Successfully loaded .env variables.');
  console.log('dotenvResult.parsed:', dotenvResult.parsed);
} else {
  console.log('dotenv.config() returned no parsed variables.');
}

console.log('JWT_SECRET in server.js after dotenv.config():', process.env.JWT_SECRET);

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database'); // Import sequelize from the new config file

const app = express();

// Test the database connection
sequelize.authenticate()
  .then(() => console.log('SQLite database connected.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Sync models with the database (create tables if they don't exist)
sequelize.sync()
  .then(() => console.log('Database synchronized.'))
  .catch(err => console.error('Error synchronizing database:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/results', require('./routes/results'));
app.use('/api/certificates', require('./routes/certificates'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { sequelize };