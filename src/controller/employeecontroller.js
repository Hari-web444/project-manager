const db = require('../database/db');

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
        empId, empName, email, mobile, address,
        salary, incentive, dateOfJoining, designation
    } = formData;

    const sql = `INSERT INTO employees 
        ( emp_id, emp_name, designation, mobile_number, email, date_of_joining, salary, incentive_percentage, address, image_url, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        empId,
        empName,
        designation,
        mobile,
        email,
        dateOfJoining,
        salary,
        incentive,
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
