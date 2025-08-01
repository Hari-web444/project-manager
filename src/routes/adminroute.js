const express = require('express');
const router = express.Router();
const authController = require('../controllers/admincontroller');

router.post('/login', authController.login);

module.exports = router;
