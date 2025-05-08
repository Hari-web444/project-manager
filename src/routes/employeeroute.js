const express = require('express');
const empcontroller = require('../controller/employeecontroller');

const router = express.Router();

router.get('/getDesignationList', empcontroller.getDesignationList);

module.exports = router;
