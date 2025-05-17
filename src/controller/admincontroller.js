const { getPool } = require('../database/db');
const db = getPool();
const { sendEmail } = require("../appMiddlewares/sendMail");
const jwt = require('jsonwebtoken');
require('dotenv').config();
function generateOtp() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}


exports.logins = async (req, res) => {
    const { username, password } = req.body;
    try {
        const sql = 'CALL SP_LoggedInUser(?, ?)';
        db.query(sql, [username, password], (err, result) => {
            if (err) {
                console.error('Error executing stored procedure:', err);
                return res.status(500).json({ message: 'Server error' });
            }
            const rows = result[0];
            if (rows.length > 0) {
                const user = rows[0]; 
                const loginTime = new Date().toISOString();
                console.log("Login Time: ", loginTime);
                const payload = {
                    userId: user.user_id,
                    username: user.name,
                    userType: user.user_type,
                    mobile_number: user.mobile_number,
                    usertype_id: user.usertype_id,
                    user_typecode:user.user_typecode,
                    loginTime: loginTime 
                };
                const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
                return res.status(200).json({
                    message: 'Login successful',
                    data: {  user_id: user.user_id,  name: user.name, mobile_number: user.mobile_number, user_type: user.user_type,  usertype_id: user.usertype_id,user_typecode:user.user_typecode,loginTime: loginTime },
                    token: token
                });
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.checkmail = async (req, res) => {
    const { mail } = req.body;
    if (!mail) {  return res.status(400).json({ message: 'All fields are required' });}
    try {
        const sql = `CALL SP_CheckMail('${mail}')`;
        db.query(sql, async (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            if (results[0][0].status === 200) {
                const otp = generateOtp();
                db.query('UPDATE users SET otp = ? WHERE email = ?', [otp, mail], async (err) => {
                    if (err) {
                        console.error('Database update error:', err);
                        return res.status(500).json({ error: true, message: 'Failed to update OTP' });
                    }
                    try {
                        await sendEmail(mail, {
                            template: "otp_template",
                            otp: otp,
                        });
                        return res.json([{ message: 'OTP sent to your email.', status: 200 }]);
                    } catch (error) {
                        console.error('Error sending OTP email:', error);
                        return res.status(500).json({ message: 'Failed to send OTP email' });
                    }
                });
            } else {   return res.status(200).json(results[0]); }
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


exports.verifyOTP = async (req, res) => {
    const { otpValue } = req.body;

    if (!otpValue) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const sql = `CALL SP_verifyOTP('${otpValue}')`;

        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({ message: 'Database error' });
            }

            res.status(200).json(results[0]);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }

};

exports.setpwd = async (req, res) => {
    const { pwd, mail } = req.body;

    try {
        const query = `UPDATE users SET password = SHA2(?, 256) WHERE email = ?`;

        db.query(query, [pwd, mail], (err, result) => {
            if (err) {
                console.error('Error updating password:', err);
                res.status(500).send({ error: 'Error updating password' });
            } else if (result.affectedRows === 0) {
                res.status(404).send({ error: 'User not found' });
            } else {
                res.send({ success: true, message: 'Password updated successfully' });
            }
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).send({ error: 'Server error' });
    }
};

exports.putLeadCount = async (req, res) => {
    const { count, userId } = req.body;

    try {
        const sql = 'CALL SP_PutLeadCount(?, ?)';

        db.query(sql, [count, userId], (err, result) => {
            if (err) {
                console.error('Error executing stored procedure:', err);
                return res.status(500).json({ message: 'Server error' });
            }

            const rows = result[0];

            res.status(200).json({ message: 'Lead count update', data: rows });

        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 

exports.checkLeadCount = async (req, res) => {
    const { userId } = req.body;
    try {
        const sql = 'CALL SP_CheckLeadCount(?)';

        db.query(sql, [userId], (err, result) => {
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

exports.getSidebarList = async (req, res) => {
    const { usertype_id } = req.body;

    try {
        const sqlMain = `CALL SP_GetSidebarList(${usertype_id})`;
        const sqlSub = `CALL SP_GetSubSidebarList(${usertype_id})`;

        const mainList = await new Promise((resolve, reject) => {
            db.query(sqlMain, (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });

        const subList = await new Promise((resolve, reject) => {
            db.query(sqlSub, (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });

        res.status(200).json({
            mainList,
            subList
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

