const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const { whatsappQueue, sendReportQueue, reminderQueue, zohoQueue} = require('./utils/queues.js');
const fs = require('fs');
const path = require('path');

// Ensure logs folder exists
const logDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, 'access.log'),
  { flags: 'a' }
);


const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullAdapter(whatsappQueue),
    new BullAdapter(sendReportQueue),
    new BullAdapter(reminderQueue),
    new BullAdapter(zohoQueue)
  ],
  serverAdapter
});

// Load environment variables
dotenv.config();

// DB Connection
const connection = require('./DB/conn.js');

// Import routes
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const dashboardRoutes = require('./routes/dashboard.js');
const jobRoutes = require('./routes/jobRoutes');

// Error handler middleware
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const port = process.env.PORT || 1111;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(morgan('dev')); // Logs HTTP requests
app.use(morgan('combined', { stream: accessLogStream }));

// Route middleware
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use(dashboardRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/admin/queues', serverAdapter.getRouter());

// Centralized error handling middleware
app.use(errorHandler);

// Start server only after DB connects
connection
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
