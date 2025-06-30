const { getPool } = require('../database/db');
const db = getPool();

exports.getUAttendanceData = async (req, res) => {
    const { user_typecode } = req.body;

    const sql = `CALL SP_GetAttendanceData('${user_typecode}')`;

    try {
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error getting branch:', err);
                return res.status(500).json({ message: 'Failed to get branch list' });
            }
            res.status(200).json({ data: result[0] });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};