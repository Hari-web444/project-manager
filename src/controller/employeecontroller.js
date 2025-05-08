const db = require('../database/db');

exports.getDesignationList = async (req, res) => {
    try {
        const sql = 'CALL SP_GetDesignationList()'; 

        db.query(sql, (err, result) => {
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