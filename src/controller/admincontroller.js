const db = require('../database/db');
const nodemailer = require("nodemailer");

function generateOtp() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

async function sendOtpEmail(email, otp) {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'info@neurolinkai.ai',
                pass: 'jeni krmv vawt hvfg'
            }
        });
        let mailOptions = {
            from: '"NeuroLink" <info@neurolinkai.ai>',
            to: email,
            subject: 'Email verification code',
            html: `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Email Verification Code</title>
                  <style>
                      body { font-family: 'Montserrat', sans-serif; background-color: #F4F4F4; margin: 0; padding: 0; }
                      .email-container { max-width: 550px; margin: 0 auto; background-color: #FFFFFF; padding: 15px; border-radius: 7px; border: 1px solid rgb(214, 214, 214); box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px; }
                      .email-header { text-align: center; padding: 10px 0; }
                      .email-header img { height: 40px; }
                      .email-body { padding: 15px; }
                      .otp { font-size: 2em; background-color: #b1e0c4; padding: 18px; border-radius: 8px; display: inline-block; margin: 12px; text-align: center; letter-spacing: 0.9em; }
                      .email-footer { text-align: center; font-size: 14px; color: #0B622F; padding: 10px 0 0; border-top: 1px solid #EEEEEE; }
                      .custom-color { color: #0B622F; margin: 0px 0px 0px 0px; }
                  </style>
              </head>
              <body>
                  <div class="email-container">
                      <div class="email-header">
                          <img src="https://neurolinkai.s3.ap-south-1.amazonaws.com/nl_client_doc/Frame%20logo.png" alt="neuronestai">
                      </div>
                      <div class="email-body">
                          <p>Here is your One Time Password (OTP).</p>
                          <p>Please enter this code to verify your OTP  of Vaithiyar Poova </p>
                          <div class="otp"><strong>${otp}</strong></div>
                          <p class="no-margin">Best Regards,</p>
                          <p  class="custom-color">Vaithiyar Poova  team.</p>
                      </div>
                      <div class="email-footer">
                          &copy; ${new Date().getFullYear()} Vaithiyar Poova . All rights reserved.
                      </div>
                  </div>
              </body>
              </html>`
        };
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

exports.logins = async (req, res) => {
    const { username, password } = req.body;

    try {
        const sql = 'CALL SP_LoggedInUser(?, ?)';

        db.execute(sql, [username, password], (err, result) => {
            if (err) {
                console.error('Error executing stored procedure:', err);
                return res.status(500).json({ message: 'Server error' });
            }

            const rows = result[0];

            res.status(200).json({ message: 'Login successful', data: rows });

        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.checkmail = async (req, res) => {
    const { mail } = req.body;

    if (!mail) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const sql = `CALL SP_CheckMail('${mail}')`;

        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                return res.status(500).json({ message: 'Database error' });
            }

            if (results[0][0].status === 200) {
                const otp = generateOtp();

                db.query('UPDATE users SET otp = ? WHERE email = ?', [otp, mail], (err) => {
                    if (err) {
                        console.error('Database update error:', err);
                        return res.status(500).json({ error: true, message: 'Failed to update OTP' });
                    }
                    sendOtpEmail(mail, otp);
                    return res.json([{ message: 'OTP sent to your email.', status: 200 }]);
                });
            }
            else {
                res.status(200).json(results[0]);
            }

        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
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

        db.execute(sql, [count, userId], (err, result) => {
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

        db.execute(sql, [userId], (err, result) => {
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

