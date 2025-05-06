require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json({ limit: '8mb' }));
app.use(express.urlencoded({ limit: '8mb', extended: true }));
app.use(cookieParser());

//APIs
const admin = require('./src/routes/adminroute.js');

app.use('/', admin);

app.get('/', (req, res) => {
  res.send('API is running >>>');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
