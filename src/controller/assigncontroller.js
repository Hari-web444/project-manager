const { getPool } = require('../database/db');
const db = getPool();


exports.getAssignPages = async (req, res) => {
    const sqlPg = `CALL SP_GetAllPages()`;
    const sqlUd = `CALL SP_GetAllUserType()`;
    const sqlUsers = `CALL SP_GetAllUsers()`;

    try {
        db.query(sqlPg, (errPg, resultPg) => {
            if (errPg) {
                console.error('Error getting pages:', errPg);
                return res.status(500).json({ message: 'Failed to get page lists' });
            }

            db.query(sqlUd, (errUt, resultUt) => {
                if (errUt) {
                    console.error('Error getting user types:', errUt);
                    return res.status(500).json({ message: 'Failed to get user type lists' });
                }

                db.query(sqlUsers, (errUsr, resultUsr) => {
                    if (errUsr) {
                        console.error('Error getting users:', errUsr);
                        return res.status(500).json({ message: 'Failed to get user lists' });
                    }

                    res.status(200).json({
                        pages: resultPg[0],
                        userTypes: resultUt[0],
                        users: resultUsr[0],
                    });
                });
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};