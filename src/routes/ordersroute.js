const express = require('express');
const ordercontroller = require('../controller/ordercontroller');

const router = express.Router();

router.get('/getOrderDetails', ordercontroller.getallorder);
module.exports = router;