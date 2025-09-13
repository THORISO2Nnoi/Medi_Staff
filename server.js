const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const staffRoutes = require('./routes/staffRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure upload folders exist
const profilePicPath = path.join(__dirname, 'uploads/profile_pics');
const certificatesPath = path.join(__dirname, 'uploads/certificates');
if (!fs.existsSync(profilePicPath)) fs.mkdirSync(profilePicPath, { recursive: true });
if (!fs.existsSync(certificatesPath)) fs.mkdirSync(certificatesPath, { recursive: true });

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/staff', staffRoutes);

// MongoDB connect
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => console.log('Server running...'));
})
.catch(err => console.error(err));
