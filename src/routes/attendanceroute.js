const express = require('express');
const attcontroller = require('../controller/attendancecontroller');

const router = express.Router();

router.post('/getUserAttendanceData', attcontroller.getUAttendanceData);

module.exports = router;
