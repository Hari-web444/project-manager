const db = require('../database/db');


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