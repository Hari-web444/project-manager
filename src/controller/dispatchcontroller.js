
const { getPool } = require('../database/db');
const db = getPool();


exports.getalldirectory = async (req, res) => {

    const sqlPg = `CALL SP_GetAllDirectory()`;

    try {
        db.query(sqlPg, (errPg, resultPg) => {
            if (errPg) {
                console.error('Error getting leads:', errPg);
                return res.status(500).json({ message: 'Failed to get leads' });
            }

            res.status(200).json({
                leads: resultPg[0]
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.savealldirectory = async (req, res) => {
    const {
        title,
        name,
        mobile,
        additional_mobile,
        email,
        address,
        country,
        state,
        city,
        userId
    } = req.body.payload;

    const sqlPg = `CALL SP_SaveAllDirectory(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        title,
        name,
        mobile,
        additional_mobile || null,
        email || null,
        address,
        country,
        state,
        city,
        userId
    ];

    try {
        db.query(sqlPg, values, (errPg, resultPg) => {
            if (errPg) {
                console.error('Error saving directory:', errPg);
                return res.status(500).json({ message: 'Failed to save directory' });
            }

            res.status(200).json({
                message: 'Directory saved successfully',
                result: resultPg[0] || [],
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};  