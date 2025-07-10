const { getPool } = require('../database/db');
const db = getPool();


exports.getallcreatives = async (req, res) => {
    const { filterData } = req.body;

    const sqlPg = `CALL SP_GetAllCreativesDetails('${filterData}')`;

    try {
        db.query(sqlPg, (errPg, resultPg) => {
            if (errPg) {
                console.error('Error getting service:', errPg);
                return res.status(500).json({ message: 'Failed to get service' });
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

exports.savecreativeservice = async (req, res) => {
    const { empID, title, type, description, dateToPost } = req.body.data;

    const sqlPg = `CALL SP_SaveCreativeServices('${empID}', '${title}', '${type}', '${description}', '${dateToPost}')`;

    try {
        db.query(sqlPg, (errPg, resultPg) => {
            if (errPg) {
                console.error('Error getting service:', errPg);
                return res.status(500).json({ message: 'Failed to get service' });
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