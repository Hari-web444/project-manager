const db = require('../database/db');

exports.getemployee = async (req, res) => {
  try {
    const sql = 'CALL SP_GetEmpData()';
    db.query(sql, (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.status(200).json({ data: result[0] });
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
    const sql = 'UPDATE employee SET emp_name = ?, department = ?, email = ?, phone = ? WHERE emp_id = ?';
    db.query(sql, [emp_name, department, email, phone, emp_id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error' });

      const io = req.app.get('io');
      io.emit('project-notification', { message: `✏️ Employee "${emp_name}" was updated` });

      res.status(200).json({ message: 'Employee updated successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { emp_id , emp_name } = req.body;

  try {
    const sql = 'UPDATE employee SET isDeleted = 1 WHERE emp_id = ?';
    db.query(sql, [emp_id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error' });

      const io = req.app.get('io');
      io.emit('project-notification', { message: `✏️ Employee "${emp_name}" was deleted` });

      res.status(200).json({ message: 'Employee deleted successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};