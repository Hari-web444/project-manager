const db = require('../database/db');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
exports.GetAllProductTypes = async (req, res) => {
    try {
        const sql = 'CALL SP_GetAllProductTypes()'; 
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error fetching product types:', err);
                return res.status(500).json({ message: 'Failed to fetch product types' });
            }
            const rows = result[0];
            res.status(200).json({ data: rows });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to fetch product types' });
    }
}

exports.GetFormfactors = async (req, res) => {
    try {
        const sql = 'CALL SP_GetFormFactors()'; 
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error fetching product types:', err);
                return res.status(500).json({ message: 'Failed to fetch product types' });
            }
            const rows = result[0];
            res.status(200).json({ data: rows });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to fetch product types' });
    }
}

exports.ProductUints = async (req, res) => {
    try {
        const sql = 'CALL SP_ProductUints()'; 
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error fetching product types:', err);
                return res.status(500).json({ message: 'Failed to fetch product types' });
            }
            const rows = result[0];
            res.status(200).json({ data: rows });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to fetch product types' });
    }
}

exports.ProductCategory= async (req, res) => {
    try {
        const sql = 'CALL SP_ProductCategory()'; 
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error fetching product Category:', err);
                return res.status(500).json({ message: 'Failed to fetch product Category' });
            }
            const rows = result[0];
            res.status(200).json({ data: rows });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to fetch product Category' });
    }
}
exports.ProductBrand= async (req, res) => {
    try {
        const sql = 'CALL SP_ProductBrand()'; 
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error fetching product Brand:', err);
                return res.status(500).json({ message: 'Failed to fetch product Brand' });
            }
            const rows = result[0];
            res.status(200).json({ data: rows });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to fetch product Brand' });
    }
}

exports.getLastProductID= async (req, res) => {
    const { value } = req.body;
    
    try {
        const sql = `CALL SP_GetLastProductID(?)`;
        db.query(sql,[value], (err, result) => {
            if (err) {
                console.error('Error executing stored procedure:', err);
                return res.status(500).json({ message: 'Server error' });
            }
            const rows = result[0];
            res.status(200).json({ data: rows });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage }).single('image'); 
exports.AddProduct = async (req, res) => {
  upload(req, res, async (err) => {

    const { productId,productName,productBrand,productCategory,formFactor,ptype,package_quantity,units,price,product_dsc,quantity,min_stock, userId } = req.body;
    const stock_status = 'Available';
    const image = req.file ? req.file : null; 
    
    try {
      const imagePath = path.join(__dirname, 'uploads', image.filename);
    if (!image) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
      const values = [
        productId,
        productName,
        productBrand  ,
        productCategory,
        formFactor,
        ptype,
        package_quantity,
        units,
        price,
        product_dsc,
        quantity,
        min_stock,
        imagePath, 
        stock_status,
        userId
      ];

      const sql = `CALL SP_AddProduct(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ?)`;

      db.query(sql, values, (err, result) => {
        if (err) {   
          console.error('Error in adding product: ', err);
          return res.status(500).json({ message: 'Error adding product', error: err });
        }
        return res.status(200).json({ message: 'Product added successfully', data: result });
      });

    } catch (error) {
      console.error('Error parsing formDataToSend:', error);
      return res.status(400).json({ message: 'Invalid form data', error: error.message });
    }
  });
};



exports.GetProduct = (req, res) => {
  const { brand } = req.body;

  if (!brand) {
    return res.status(400).json({ message: 'Brand is required' });
  }
  const sql = 'CALL SP_GetProductsByBrand(?)';
  db.query(sql, [brand], (err, result) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    const products = result[0];
    if (products.length > 0) {
      return res.json(products);  
    } else {
      return res.status(404).json({ message: 'No products found for this brand' });
    }
  });
};

