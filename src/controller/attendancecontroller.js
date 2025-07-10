const { getPool } = require('../database/db');
const db = getPool();

exports.getUAttendanceData = async (req, res) => {
    const { user_typecode, startDate , endDate , filterData } = req.body;

    const sql = `CALL SP_GetAttendanceData('${user_typecode}', '${startDate}', '${endDate}', '${filterData}')`;

    try {
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error getting attendance:', err);
                return res.status(500).json({ message: 'Failed to get attendance list' });
            }
            res.status(200).json({ data: result[0] });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserActivity = async (req, res) => {
    const { user_typecode, startDate , endDate , filterData } = req.body;

    const sql = `CALL SP_GetUserActivity('${user_typecode}', '${startDate}', '${endDate}', '${filterData}')`;
    
    try {
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error getting user activity:', err);
                return res.status(500).json({ message: 'Failed to get user activity list' });
            }
            res.status(200).json({ data: result[0] });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.sendApprovalStatus = async (req, res) => {
    const { status, id } = req.body;

    const sql = `UPDATE user_activity SET user_status = ? WHERE lp_recid = ?`;

    try {
        db.query(sql, [status, id], (err, result) => {
            if (err) {
                console.error('Error updating user activity:', err);
                return res.status(500).json({ message: 'Failed to update user activity' });
            }
            res.status(200).json({ message: 'User status updated successfully', result });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
