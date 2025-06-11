const { getPool } = require('../database/db');
const db = getPool();

exports.insertLeave = async (req, res) => {
  try {
    const { from_date, to_date, leave_type, duration, reason, user_status = 'Pending', created_by,user_id } = req.body;
    if (!from_date || !to_date || !leave_type || !duration || !reason || !created_by) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const values = [from_date, to_date, leave_type, duration, reason, user_status, created_by,user_id];
    const sql = 'CALL SP_InsertLeaveRequest(?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error insertin’ leave:', err);
        return res.status(500).json({ message: 'Database error while insertin’ leave.' });
      }
      res.status(200).json({ message: 'Leave inserted successfully.' });
    });

  } catch (err) {
    console.error('Error insertin’ leave:', err);
    res.status(500).json({ message: 'Server error while insertin’ leave.' });
  }
};


exports.insertPermission = async (req, res) => {
  try {
    const { from_time, to_time, reason, user_status = 'Pending', created_by,user_id } = req.body;

    if (!from_time || !to_time || !reason || !created_by) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const sql = 'CALL SP_InsertPermissionRequest(?, ?, ?, ?, ?, ?)';
    const values = [from_time, to_time, reason, user_status, created_by,user_id];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error inserting permission:', err);
        return res.status(500).json({ message: 'Server error while submitting permission.' });
      }

      return res.status(200).json({ message: 'Permission request submitted successfully.' });
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ message: 'Unexpected server error.' });
  }
};


exports.getstatus = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return res.status(400).json({ message: 'user_id is required.' });
    }
    const sql = 'CALL SP_GetUserPermissionStatus(?)';
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching user status:', err);
        return res.status(500).json({ message: 'Server error while fetching status.' });
      }
      return res.status(200).json({
        message: 'User permission status fetched successfully.',
        data: results[0]
      });
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ message: 'Unexpected server error.' });
  }
};
