const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const Papa = require('papaparse');

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const classRoutes = require('./routes/classRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();
const port = process.env.PORT || 5555;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001'
}));
app.use(helmet());


// API routes
app.use('/api/admin', adminRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/class', classRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/attendance', attendanceRoutes);


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected...');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to MongoDB:', err);
  });

module.exports = app;
