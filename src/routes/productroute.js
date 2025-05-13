const express = require('express');
const productcontroller = require('../controller/productcontroller');

const router = express.Router();

router.get('/getAllProductTypes', productcontroller.GetAllProductTypes);
router.get('/getformfactor', productcontroller.GetFormfactors);
router.get('/productUints', productcontroller.ProductUints);
router.get('/productCategory', productcontroller.ProductCategory);
router.get('/productBrand', productcontroller.ProductBrand);

module.exports = router;
