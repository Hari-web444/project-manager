const { getPool } = require('../database/db');
const db = getPool();
const { getAwsSecrets } = require("../utilities/vaultClient");

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
    const { userId } = req.body;

    const sqlPg = `CALL SP_GetAllLeadDetailsbyid('${userId}')`;
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

exports.updateDisposition = async (req, res) => {
    const { key, id , followup_date } = req.body;

    const sqlPg = `CALL SP_UpdateDisposition('${key}', ${id} , '${followup_date}')`;

    try {
        db.query(sqlPg, (errPg, resultPg) => {
            if (errPg) {
                console.error('Error getting leads:', errPg);
                return res.status(500).json({ message: 'Failed to get leads' });
            }
            res.status(200).json({
                data: resultPg[0]
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getallproducts = async (req, res) => {
    const { type } = req.body;

    const sqlPg = `CALL SP_GetAllProductSale('${type}')`;

    try {
        db.query(sqlPg, async (errPg, resultPg) => {
            if (errPg) {
                console.error('Error getting leads:', errPg);
                return res.status(500).json({ message: 'Failed to get leads' });
            }

            const aws = await getAwsSecrets();
            const products = resultPg[0];
            const enrichedProducts = products.map((p) => ({
                ...p,
                imageUrl: p.product_img
                    ? `https://${aws.bucket}.s3.${aws.region}.amazonaws.com/${p.product_img}`
                    : null,
            }));

            res.status(200).json({
                data: enrichedProducts
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createprofileData = async (req, res) => {
    const { customer_id, name, age, genderName, categoryName, mobile, email, userId } = req.body.profileData;

    const sqlPg = `CALL SP_CreateProfileData('${customer_id}','${name}','${age}','${genderName}','${categoryName}','${mobile}','${email}', ${userId})`;

    try {
        db.query(sqlPg, async (errPg, resultPg) => {
            if (errPg) {
                console.error('Error getting leads:', errPg);
                return res.status(500).json({ message: 'Failed to get leads' });
            }

            res.status(200).json({
                data: resultPg[0]
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.insertSalesOrder = async (req, res) => {
    const data = req.body;

    const {
        order_id, leads_id, direct_pickup, additional_number,
        address, district, state, country, courier,
        order_value, discount, approved_by, payment_mode,
        wallet, total_value, amount_to_pay, medication_period,
        transaction_id, date_time, catagory_id, quantity, user_id, rec_id, stick_type
    } = data;

    const imagePath = req.file?.key || null;

    const sql = `
        CALL SP_InsertSalesOrder(
            '${order_id}', '${leads_id}', ${direct_pickup}, '${additional_number}',
            '${address}', '${district}', '${state}', '${country}', '${courier}',
            ${order_value}, ${discount || 0}, '${approved_by}', '${payment_mode}',
            ${wallet || 0}, ${total_value}, ${amount_to_pay}, '${medication_period}',
            '${imagePath}', '${transaction_id}',  '${date_time}', ${user_id}, ${catagory_id}, ${quantity}, '${rec_id}', '${stick_type}'
        )
    `;

    try {
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error inserting sales order:', err);
                return res.status(500).json({ message: 'Failed to insert sales order' });
            }

            return res.status(200).json({ message: 'Sales order inserted successfully' });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getLatestOrderId = async (req, res) => {
    const sql = "SELECT order_id FROM sales ORDER BY order_recid DESC LIMIT 1";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching last order_id:", err);
            return res.status(500).json({ message: "Failed to get latest order ID" });
        }

        let nextOrderId = "VPO001";
        if (result.length > 0 && result[0].order_id) {
            const lastId = parseInt(result[0].order_id.replace("VPO", "")) || 0;
            nextOrderId = "VPO" + String(lastId + 1).padStart(3, "0");
        }

        res.status(200).json({ nextOrderId });
    });
};

exports.getadminbranchlist = async (req, res) => {
    const { userId } = req.body;

    const sqlPg = `CALL SP_GetAllAdBranchList(${userId})`;

    try {
        db.query(sqlPg, (errPg, resultPg) => {
            if (errPg) {
                console.error('Error getting leads:', errPg);
                return res.status(500).json({ message: 'Failed to get leads' });
            }
            res.status(200).json({
                data: resultPg[0]
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};