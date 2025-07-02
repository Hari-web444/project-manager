const express = require('express');
const leadcontroller = require('../controller/leadcontroller');

const router = express.Router();

router.post('/getAllLeadDetails', leadcontroller.getallleads);
router.post('/InsertLeadBulk', leadcontroller.uploadBulkLeads);
module.exports = router;