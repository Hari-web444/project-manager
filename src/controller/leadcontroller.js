const { getPool } = require('../database/db');
const db = getPool();


exports.getallleads = async (req, res) => {
    const { fileredData } = req.body;

    const sqlPg = `CALL SP_GetAllLeadDetails('${fileredData}')`;
    const cgSql = `CALL SP_GetAllcatagories()`;

    try {
        db.query(sqlPg, (errPg, resultPg) => {
            if (errPg) {
                console.error('Error getting leads:', errPg);
                return res.status(500).json({ message: 'Failed to get leads' });
            }

            db.query(cgSql, (errCg, resultCg) => {
                if (errCg) {
                    console.error('Error getting categories:', errCg);
                    return res.status(500).json({ message: 'Failed to get categories' });
                }

                res.status(200).json({
                    leads: resultPg[0],
                    categories: resultCg[0]
                });
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getallleadsforcl = async (req, res) => {
    const { fileredData } = req.body;

    const sqlPg = `CALL SP_GetAllLeadDetails('${fileredData}')`;
    const cgSql = `CALL SP_GetAllcatagories()`;

    try {
        db.query(sqlPg, (errPg, resultPg) => {
            if (errPg) {
                console.error('Error getting leads:', errPg);
                return res.status(500).json({ message: 'Failed to get leads' });
            }

            db.query(cgSql, (errCg, resultCg) => {
                if (errCg) {
                    console.error('Error getting categories:', errCg);
                    return res.status(500).json({ message: 'Failed to get categories' });
                }

                res.status(200).json({
                    leads: resultPg[0],
                    categories: resultCg[0]
                });
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.uploadBulkLeads = async (req, res) => {
    try {
        const leads = req.body.leads;

        if (!Array.isArray(leads) || leads.length === 0) {
            return res.status(400).json({ message: 'No leads provided.' });
        }

        const values = leads.map((lead) => ([
            lead.lead_id,
            lead.lead_name,
            lead.age,
            lead.gender,
            lead.category,
            lead.mobile_number,
            lead.email,
            lead.created_by,
            lead.disposition,
            lead.disposition_date,
            lead.created_at
        ]));

        const sql = `
        INSERT INTO leads (
          lead_id,
          lead_name,
          age,
          gender,
          category,
          mobile_number,
          email,
          created_by,
          disposition,
          disposition_date,
          created_at
        ) VALUES ?
      `;

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error("DB Error:", err);
                return res.status(500).json({ message: "Database insert failed", error: err });
            }

            return res.status(200).json({
                message: "Bulk leads inserted successfully",
                inserted_count: result.affectedRows
            });
        });

    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};