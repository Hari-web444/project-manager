const express = require('express');
const creativecontroller = require('../controller/creativescontroller');

const router = express.Router();

router.post('/getCreativeServices', creativecontroller.getallcreatives);
router.post('/saveCreativeService', creativecontroller.savecreativeservice);
module.exports = router;