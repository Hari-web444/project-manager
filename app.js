require('dotenv-flow').config();
const { authenticate } = require('./src/database/db');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(`🌍 Environment: ${NODE_ENV}`);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(' Not allowed by CORS'));
    }
  },
  credentials: true
}));

(async () => {
  try {
    await authenticate();

    const admin = require('./src/routes/adminroute.js');
    const employee = require('./src/routes/employeeroute.js');
    const product = require('./src/routes/productroute');
    const branch = require('./src/routes/branchroute.js');
    const users = require('./src/routes/userroute.js');
    const assign = require('./src/routes/assignroute.js');
    const leads = require('./src/routes/leadroute.js');
    app.use('/', admin, product, users, employee, branch, assign, leads);

    app.get('/', (req, res) => {
      res.send('✅ Vaithiyar Poova API is running!');
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
})();
