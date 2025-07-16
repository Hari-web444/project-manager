const express = require('express');
const ordercontroller = require('../controller/ordercontroller');

const router = express.Router();

router.get('/getOrderDetails', ordercontroller.getallorder);
router.get('/getOrderListDis', ordercontroller.getallorderdis);
router.post('/getProductData', ordercontroller.getproductdata);
router.post('/putStatus', ordercontroller.putstatus);
module.exports = router;