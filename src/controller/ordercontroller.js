const { getPool } = require('../database/db');
const db = getPool();

exports.getallorder = async (req, res) => {

    const sqlPg = `CALL SP_GetAllSalesByCl()`;

    try {
        db.query(sqlPg, (errPg, resultPg) => {
            if (errPg) {
                console.error('Error getting sales:', errPg);
                return res.status(500).json({ message: 'Failed to get sales' });
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
