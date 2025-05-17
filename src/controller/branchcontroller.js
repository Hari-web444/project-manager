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
    const { state, city } = req.body;

    const sql = `CALL SP_GetLastBranchId('${state}', '${city}')`;

    try {
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error getting branch:', err);
                return res.status(500).json({ message: 'Failed to get branch ID list' });
            }
            res.status(200).json({ data: result[0] });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};