const express = require('express');
const assigncontroller = require('../controller/assigncontroller');

const router = express.Router();

router.get('/getAssignDetails', assigncontroller.getAssignPages);

module.exports = router;