const { getPool } = require('../database/db');
const db = getPool();


exports.getallorder = async (req, res) => {
    const { fileredData } = req.body;

    const sqlPg = `CALL SP_GetAllOrderDetails('${fileredData}')`;

    try {
        db.query(sqlPg, (errPg, resultPg) => {
            if (errPg) {
                console.error('Error getting leads:', errPg);
                return res.status(500).json({ message: 'Failed to get leads' });
            }

            res.status(200).json({
                data: resultPg[0]
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};