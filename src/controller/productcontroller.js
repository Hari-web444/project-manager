const { getPool } = require('../database/db');
const db = getPool();
const { getAwsSecrets } = require("../utilities/vaultClient");
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


exports.AddProduct = async (req, res) => {
    try {
      const { productId,productName,productBrand,productCategory,formFactor,ptype,
            package_quantity,units,price,product_dsc,quantity,min_stock, userId } = req.body;

      const stock_status = 'Available';
      const imagePath = req.file?.key || null;
      
      const values = [ productId, productName, productBrand  ,  productCategory, formFactor, ptype, package_quantity,
                       units, price, product_dsc, quantity, min_stock,imagePath,  stock_status, userId
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
};



exports.GetProduct = async (req, res) => {
  const { brand } = req.body;
    if (!brand) {
      return res.status(400).json({ message: 'Brand is required' });
    }
  const sql = 'CALL SP_GetProductsByBrand(?)';
  db.query(sql, [brand], async (err, result) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'Internal server error', error: err });
    }
    const products = result[0];
    try {
      const aws = await getAwsSecrets();
      const enrichedProducts = products.map((p) => ({
        ...p,
        imageUrl: p.product_img
          ? `https://${aws.bucket}.s3.${aws.region}.amazonaws.com/${p.product_img}`
          : null,
      }));
      return res.status(200).json(enrichedProducts);
    } catch (e) {
      console.warn('⚠️ Failed to enrich product images:', e.message);
      return res.status(200).json(products); 
    }
  });
};


exports.GetProductCount = (req, res) => {
  const sql = 'CALL SP_GetProductBrandCounts()';
  db.query(sql, (error, results) => {
    if (error) {
      console.error('Error executing stored procedure:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    const counts = results[0][0]; 
    return res.json({
      totalCount: counts.total_count,
      vaithyarPoovaCount: counts.vaithyar_poova_count,
      gramiyamCount: counts.gramiyam_count,
    });
  });
};



exports.EditeProduct = (req, res) => {

  const { product_recid } = req.params;
  const { productId,productName, productBrand, productCategory, formFactor, ptype, package_quantity,  units,
          price,product_dsc, quantity,min_stock,
        } = req.body;

  const product_img = req.file?.key || null;      
  const sql = 'CALL SP_EditProduct(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  const values = [ product_recid, productId, productName, productBrand, productCategory, formFactor, ptype,
                   package_quantity, units, price, product_dsc, quantity, min_stock, product_img
                 ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Edit failed:', err);
      return res.status(500).json({ message: 'Internal Server Error', error: err });
    }

    res.status(200).json({ message: 'Product updated successfully', result });
  });
};





exports.DeleteProduct = (req, res) => {
  const { product_recid } = req.params;

  if (!product_recid) {
    return res.status(400).json({ message: 'Product ID (recid) is required in params' });
  }

  const sql = 'CALL SP_DeleteProduct(?)';

  db.query(sql, [product_recid], (err, result) => {
    if (err) {
      console.error('Delete error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }

    return res.status(200).json({ message: 'Product deleted successfully', result });
  });
};



exports.EditeProductinventry = (req, res) => {
  const { product_recid } = req.params;
  const { quantity, selling_price } = req.body;

  if (!quantity || !selling_price) {
    return res.status(400).json({ message: "Quantity and Selling Price are required" });
  }

  const sql = 'CALL SP_EditProductinventry(?, ?, ?)';
  const values = [product_recid, quantity, selling_price];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Edit failed:', err);
      return res.status(500).json({ message: 'Internal Server Error', error: err });
    }
    res.status(200).json({ success: true, message: 'Product updated successfully', result });
  });
};
