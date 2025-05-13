const express = require('express');
const empcontroller = require('../controller/employeecontroller');

const router = express.Router();

router.get('/getDesignationList', empcontroller.getDesignationList);
router.post('/getLastEmpID', empcontroller.getLastEmpID);
router.post('/saveEmpDetails', empcontroller.saveEmpDetails);

module.exports = router;
