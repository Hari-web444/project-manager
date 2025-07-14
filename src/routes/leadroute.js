const express = require('express');
const leadcontroller = require('../controller/leadcontroller');

const router = express.Router();

router.post('/getAllLeadDetails', leadcontroller.getallleads);
router.post('/InsertLeadBulk', leadcontroller.uploadBulkLeads);
router.post('/getAllLeadsDataForCl', leadcontroller.getallleadsforcl);
router.post('/updateDisposition', leadcontroller.updateDisposition);
router.post('/getAllProductListSale', leadcontroller.getallproducts);
router.post('/createProfileData', leadcontroller.createprofileData);
router.post('/insertSalesOrder', leadcontroller.insertSalesOrder);
router.get('/getLatestOrderId', leadcontroller.getLatestOrderId);

module.exports = router;