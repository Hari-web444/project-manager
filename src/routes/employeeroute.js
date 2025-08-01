const express = require('express');
const router = express.Router();
const empController = require('../controllers/employeecontroller');

router.get('/getEmployeeData', empController.getemployee);
router.post('/saveEmployees', empController.saveemployee);
router.post('/updateEmployee', empController.updateEmployee);
router.post('/deleteEmployee', empController.deleteEmployee);

module.exports = router;
