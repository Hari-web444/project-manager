const { getPool } = require('../database/db');
const db = getPool();

exports.getLocationDetails = async (req, res) => {

    const sql = `CALL SP_GetCountryDetails()`;

    try {
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error getting branch:', err);
                return res.status(500).json({ message: 'Failed to get branch list' });
            }
            res.status(200).json({ data: result[0] });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStateByCoutry = async (req, res) => {
    const { country_id } = req.body;

    const sql = `CALL SP_GetStateByCoutry('${country_id}')`;

    try {
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error getting branch:', err);
                return res.status(500).json({ message: 'Failed to get branch list' });
            }
            res.status(200).json({ data: result[0] });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCityByState = async (req, res) => {
    const { state_id } = req.body;

    const sql = `CALL SP_GetCityByState('${state_id}')`;

    try {
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error getting branch:', err);
                return res.status(500).json({ message: 'Failed to get branch list' });
            }
            res.status(200).json({ data: result[0] });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getLastBranchId = async (req, res) => {
    const { state, location } = req.body;

    const sqlBranch = `CALL SP_GetLastBranchId('${state}', '${location}')`;

    try {
        db.query(sqlBranch, (err, branchResult) => {
            if (err) {
                console.error('Error getting branch:', err);
                return res.status(500).json({ message: 'Failed to get branch ID list' });
            }

            res.status(200).json({
                branchData: branchResult[0]
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getBranchHeadList = async (req, res) => {
    const sqlHead = `CALL SP_GetBranchHead()`;

    try {
        db.query(sqlHead, (err, headResult) => {
            if (err) {
                console.error('Error getting branch head:', err);
                return res.status(500).json({ message: 'Failed to get branch head' });
            }

            res.status(200).json({
                headData: headResult[0]
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.saveBranchDetails = async (req, res) => {
    const {
        address,
        assignBrandasGramiyam,
        assignBrandasVaithyar,
        branch_id,
        branch_in_charge,
        branch_incharge_recid,
        branch_name,
        branch_type,
        country,
        district,
        email,
        location,
        opening_date,
        phone_number,
        rent,
        state
    } = req.body;

    const sql = `CALL SP_SaveBranchDetails(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        db.query(
            sql,
            [
                branch_id,
                branch_name,
                branch_type,
                branch_in_charge,
                branch_incharge_recid,
                email,
                phone_number,
                address,
                country,
                state,
                district,
                location,
                rent,
                opening_date,
                assignBrandasGramiyam,
                assignBrandasVaithyar
            ],
            (err, branchResult) => {
                if (err) {
                    console.error('Error saving branch details:', err);
                    return res.status(500).json({ message: 'Failed to save branch details' });
                }

                res.status(200).json({
                    message: 'Branch details saved successfully',
                    data: branchResult[0]
                });
            }
        );
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getBranchDetails = async (req, res) => {
    const { userId, user_typecode } = req.body;

    const sqlBranch = `CALL SP_GetBranchDetails(${userId}, '${user_typecode}')`;

    try {
        db.query(sqlBranch, (err, branchResult) => {
            if (err) {
                console.error('Error getting branch:', err);
                return res.status(500).json({ message: 'Failed to get branch ID list' });
            }

            res.status(200).json({
                data: branchResult[0],
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateBranchDetails = async (req, res) => {
    try {
        const { updates } = req.body;

        if (!Array.isArray(updates) || updates.length === 0) {
            return res.status(400).json({ message: 'No updates provided.' });
        }

        const branch_id = updates[0].branch_id;

        const query = (sql, values) =>
            new Promise((resolve, reject) => {
                db.query(sql, values, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });

        for (const { key, newValue } of updates) {
            const sql = `UPDATE branches SET ${key} = ? WHERE branch_id = ?`;
            await query(sql, [newValue, branch_id]);
        }

        res.status(200).json({ message: 'Employee updated successfully.' });
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.deleteSelBranchList = async (req, res) => {
    const { branch_id } = req.body;

    const sqlBranch = `CALL SP_DelSelBranchList('${branch_id}')`;

    try {
        db.query(sqlBranch, (err, branchResult) => {
            if (err) {
                console.error('Error getting branch:', err);
                return res.status(500).json({ message: 'Failed to get branch ID list' });
            }

            res.status(200).json({
                data: branchResult[0],
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};