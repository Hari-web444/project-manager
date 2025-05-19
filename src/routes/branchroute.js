const express = require('express');
const brcontroller = require('../controller/branchcontroller');

const router = express.Router();

router.get('/getLocationDetails', brcontroller.getLocationDetails);
router.post('/getStateByCoutry', brcontroller.getStateByCoutry);
router.post('/getCityByState', brcontroller.getCityByState);
router.post('/getLastBranchId', brcontroller.getLastBranchId);
router.post('/saveBranchDetails', brcontroller.saveBranchDetails);

module.exports = router;