const express = require('express');
const leadcontroller = require('../controller/leadcontroller');
const setupS3Uploader = require('../appMiddlewares/s3Upload');

const router = express.Router();

setupS3Uploader().then(upload => {
    router.post('/getAllLeadDetails', leadcontroller.getallleads);
    router.post('/InsertLeadBulk', leadcontroller.uploadBulkLeads);
    router.post('/getAllLeadsDataForCl', leadcontroller.getallleadsforcl);
    router.post('/updateDisposition', leadcontroller.updateDisposition);
    router.post('/getAllProductListSale', leadcontroller.getallproducts);
    router.post('/createProfileData', leadcontroller.createprofileData);
    router.post('/insertSalesOrder', upload.single('receipt_image_url'), leadcontroller.insertSalesOrder);
    router.get('/getLatestOrderId', leadcontroller.getLatestOrderId);
    router.post('/getADBranchList', leadcontroller.getadminbranchlist);
});

module.exports = router;