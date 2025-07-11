const express = require('express');
const ordercontroller = require('../controller/ordercontroller');

const router = express.Router();

router.post('/getOrderDetails', ordercontroller.getallorder);
module.exports = router;