const express = require('express');
const empcontroller = require('../controller/employeecontroller');

const router = express.Router();

router.get('/getDesignationList', empcontroller.getDesignationList);
router.post('/getLastEmpID', empcontroller.getLastEmpID);
router.post('/saveEmpDetails', empcontroller.saveEmpDetails);
router.post('/getEmployeeList', empcontroller.getEmployeeList);
router.post('/updateEmpDetails', empcontroller.updateEmployee);
router.post('/deleteSelEmployee', empcontroller.deleteSelEmployee);
router.post('/assignTaskToOther', empcontroller.assignTaskToOther);

module.exports = router;
