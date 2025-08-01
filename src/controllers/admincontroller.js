const jwt = require('jsonwebtoken');
const db = require('../database/db');

exports.login = async (req, res) => {
    const { username, password , userType } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        let sql = '';
        if(userType === "Admin") {
            sql = `SELECT * FROM admin_users WHERE user_name = ? AND password = ?`;
        } else {
            sql = `SELECT * FROM employee WHERE phone = ? AND password = ?`;
        }

        db.query(sql, [username, password], (err, results) => {
            if (err) {
                console.error('❌ DB Error:', err);
                return res.status(500).json({ message: 'Database error' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const user = results[0];

            const token = jwt.sign(
                { username: user.user_name },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1h' }
            );

            return res.status(200).json({
                message: 'Login successful',
                token
            });
        });
    } catch (error) {
        console.error('❌ Server Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
