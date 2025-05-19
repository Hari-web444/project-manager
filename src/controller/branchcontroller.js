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
    const sqlHead = `CALL SP_GetBranchHead()`;

    try {
        db.query(sqlBranch, (err, branchResult) => {
            if (err) {
                console.error('Error getting branch:', err);
                return res.status(500).json({ message: 'Failed to get branch ID list' });
            }

            db.query(sqlHead, (err, headResult) => {
                if (err) {
                    console.error('Error getting branch head:', err);
                    return res.status(500).json({ message: 'Failed to get branch head' });
                }

                res.status(200).json({
                    branchData: branchResult[0],
                    headData: headResult[0]
                });
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

    const sql = `CALL SP_SaveBranchDetails(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
        db.query(
            sql,
            [
                branch_id,
                branch_name,
                branch_type,
                branch_in_charge,
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
