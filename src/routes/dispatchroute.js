const express = require('express');
const directorycontroller = require('../controller/dispatchcontroller');

const router = express.Router();

router.get('/getDirectoryDetails', directorycontroller.getalldirectory);
router.post('/saveDirectoryDetails', directorycontroller.savealldirectory);
module.exports = router;