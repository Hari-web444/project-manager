const { getPool } = require('../database/db');
const db = getPool();
const { getAwsSecrets } = require("../utilities/vaultClient");

exports.getallorder = async (req, res) => {

    const sqlPg = `CALL SP_GetAllSalesByCl()`;

    try {
        db.query(sqlPg, async (errPg, resultPg) => {
            if (errPg) {
                console.error('Error getting sales:', errPg);
                return res.status(500).json({ message: 'Failed to get sales' });
            }
            const orderdata =resultPg[0];

            const aws = await getAwsSecrets();

            const getOrderData = orderdata.map((item) => ({
                ...item,
                receipt_image_url: item.receipt_image_url
                  ? `https://${aws.bucket}.s3.${aws.region}.amazonaws.com/${item.receipt_image_url}`
                  : null,
              }));

            res.status(200).json({
                data: getOrderData
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getallorderdis = async (req, res) => {

    const sqlPg = `CALL SP_GetAllSalesByDis()`;

    try {
        db.query(sqlPg, (errPg, resultPg) => {
            if (errPg) {
                console.error('Error getting sales:', errPg);
                return res.status(500).json({ message: 'Failed to get sales' });
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

exports.getproductdata = async (req, res) => {
    const { product_id } = req.body;

    const sqlPg = `CALL SP_GetProductData('${product_id}')`;

    try {
        db.query(sqlPg, (errPg, resultPg) => {
            if (errPg) {
                console.error('Error getting products:', errPg);
                return res.status(500).json({ message: 'Failed to get products' });
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

exports.putstatus = async (req, res) => {
    const { status , order_id } = req.body;

    const sqlPg = `CALL SP_PutStatusForApprovals('${status}', ${order_id})`;

    try {
        db.query(sqlPg, (errPg, resultPg) => {
            if (errPg) {
                console.error('Error getting products:', errPg);
                return res.status(500).json({ message: 'Failed to get products' });
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