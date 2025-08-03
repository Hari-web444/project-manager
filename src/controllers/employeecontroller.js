const db = require('../database/db');

exports.getemployee = async (req, res) => {
  try {
    const sql = 'CALL SP_GetEmpData()';
    const sqlNot = 'CALL SP_GetNotificationData()';

    db.query(sql, (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error' });

      db.query(sqlNot, (err, resultNotify) => {
        if (err) return res.status(500).json({ message: 'Server error' });

        res.status(200).json({
          data: result[0],
          dataNotify: resultNotify[0]
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.saveemployee = async (req, res) => {
  const { emp_name, department, email, phone, created_by } = req.body;
  try {
    const sql = 'CALL SP_SaveEmpData(?,?,?,?,?)';
    db.query(sql, [emp_name, department, email, phone, created_by], (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error' });

      const io = req.app.get('io');
      io.emit('project-notification', { message: `🧑 Employee "${emp_name}" was added` });

      res.status(200).json({ data: result[0] });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateEmployee = async (req, res) => {
  const { emp_id, emp_name, department, email, phone } = req.body;

  try {
    const updateSql = 'UPDATE employee SET emp_name = ?, department = ?, email = ?, phone = ? WHERE emp_id = ?';
    const insertNotifSql = 'INSERT INTO notification (type, notification, created_by) VALUES (?, ?, ?)';

    db.query(updateSql, [emp_name, department, email, phone, emp_id], (err, result) => {
      if (err) {
        console.error('Update Error:', err);
        return res.status(500).json({ message: 'Server error while updating employee' });
      }

      const notifMessage = `${emp_name} successfully updated.`;
      db.query(insertNotifSql, ['Update', notifMessage, 1], (notifErr) => {
        if (notifErr) {
          console.error('Notification Error:', notifErr);
        }

        const io = req.app.get('io');
        io.emit('project-notification', {
          message: `✏️ Employee "${emp_name}" was updated`,
        });

        return res.status(200).json({ message: 'Employee updated successfully' });
      });
    });

  } catch (error) {
    console.error('Unexpected Error:', error);
    res.status(500).json({ message: 'Unexpected server error' });
  }
};


exports.deleteEmployee = async (req, res) => {
  const { emp_id, emp_name } = req.body;
  const deleteSql = 'UPDATE employee SET isDeleted = 1 WHERE emp_id = ?';
  const insertNotifSql = 'INSERT INTO notification (type, notification, created_by) VALUES (?, ?, ?)';

  try {
    db.query(deleteSql, [emp_id], (err, result) => {
      if (err) {
        console.error('Delete Error:', err);
        return res.status(500).json({ message: 'Server error during deletion' });
      }

      const notifMessage = `${emp_name} was deleted.`;
      db.query(insertNotifSql, ['Delete', notifMessage, 1], (notifErr) => {
        if (notifErr) {
          console.error('Notification Insert Error:', notifErr);
        }

        const io = req.app.get('io');
        io.emit('project-notification', {
          message: `🗑️ Employee "${emp_name}" was deleted`,
        });

        return res.status(200).json({ message: 'Employee deleted successfully' });
      });
    });
  } catch (error) {
    console.error('Unexpected Error:', error);
    res.status(500).json({ message: 'Unexpected server error' });
  }
};
