require('dotenv-flow').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

console.log('🌍 Environment:', NODE_ENV);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('❌ Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// API routes
const admin = require('./src/routes/adminroute.js');
const employee = require('./src/routes/employeeroute.js');
const product = require('./src/routes/productroute');
const branch = require('./src/routes/branchroute.js');
app.use('/', admin,product);
app.use('/', employee);
app.use('/', branch);

// Health check
app.get('/', (req, res) => {
  res.send('✅ Vaithiyar Poova API is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
