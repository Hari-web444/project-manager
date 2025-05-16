const express = require('express');
const productcontroller = require('../controller/productcontroller');

const router = express.Router();

router.get('/getAllProductTypes', productcontroller.GetAllProductTypes);
router.get('/getformfactor', productcontroller.GetFormfactors);
router.get('/productUints', productcontroller.ProductUints);
router.get('/productCategory', productcontroller.ProductCategory);
router.get('/productBrand', productcontroller.ProductBrand);
router.post('/getLastProductid', productcontroller.getLastProductID);
router.post('/addProduct', productcontroller.AddProduct);
router.post('/getProduct', productcontroller.GetProduct);
router.post('/getProductcount', productcontroller.GetProductCount);
router.put('/editproduct/:product_recid', productcontroller.EditeProduct);
router.delete('/product/:product_recid', productcontroller.DeleteProduct);
module.exports = router;
