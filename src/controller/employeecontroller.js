const { getPool } = require('../database/db');
const db = getPool();

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

exports.getLastEmpID = async (req, res) => {
    const { userId, value } = req.body;

    try {
        const sql = `CALL SP_GetLastEmpID(${userId}, '${value}')`;

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

exports.saveEmpDetails = async (req, res) => {
    const { formData, userId } = req.body;

    const {
        emp_id, emp_name, email, mobile_number, address,
        salary, incentive_percentage, date_of_joining, designation
    } = formData;

    const sql = `CALL SP_SaveEmpDetails(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        emp_id,
        emp_name,
        designation,
        mobile_number,
        email,
        date_of_joining,
        salary,
        incentive_percentage,
        address,
        null,
        userId
    ];

    try {
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error inserting employee:', err);
                return res.status(500).json({ message: 'Failed to save employee' });
            }
            res.status(200).json({ message: 'Employee saved successfully', data: result });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getEmployeeList = async (req, res) => {
    const { userId, user_typecode } = req.body;

    const sql = `CALL SP_GetEmployeeList(?, ?)`;

    const values = [userId, user_typecode];

    try {
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error getting employee:', err);
                return res.status(500).json({ message: 'Failed to get employee list' });
            }
            res.status(200).json({ data: result[0] });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { updates } = req.body;

        if (!Array.isArray(updates) || updates.length === 0) {
            return res.status(400).json({ message: 'No updates provided.' });
        }

        const emp_recid = updates[0].emp_recid;

        const query = (sql, values) =>
            new Promise((resolve, reject) => {
                db.query(sql, values, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });

        for (const { key, newValue } of updates) {
            const sql = `UPDATE employees SET ${key} = ? WHERE emp_recid = ?`;
            await query(sql, [newValue, emp_recid]);
        }

        res.status(200).json({ message: 'Employee updated successfully.' });
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.deleteSelEmployee = async (req, res) => {
    const { emp_recid } = req.body;

    const sql = `CALL SP_DeleteSelEmployee(${emp_recid})`;
    
    try {
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error getting employee:', err);
                return res.status(500).json({ message: 'Failed to get employee list' });
            }
            res.status(200).json({ data: result[0] });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.assignTaskToOther = async (req, res) => {
    const { emp_recid , assign_id} = req.body;

    const sql = `CALL SP_AssignTaskToOther(${emp_recid}, ${assign_id})`;
    
    try {
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error getting employee:', err);
                return res.status(500).json({ message: 'Failed to get employee list' });
            }
            res.status(200).json({ data: result[0] });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



