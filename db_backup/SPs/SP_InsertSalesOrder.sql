/* ----------------------------------------------------------------------------------------------------------------- 
   NAME: Hariharan S
   DATE: 10/07/2025
   DESC: It is used to save lead entries to the leads table.
----------------------------------------------------------------------------------------------------------------- */
DELIMITER //

DROP PROCEDURE IF EXISTS `SP_InsertSalesOrder`;

CREATE PROCEDURE SP_InsertSalesOrder(
     IN p_order_id VARCHAR(50),
    IN p_leads_id VARCHAR(50),
    IN p_direct_pickup INT,
    IN p_additional_number VARCHAR(20),
    IN p_address TEXT,
    IN p_district VARCHAR(50),
    IN p_state VARCHAR(50),
    IN p_country VARCHAR(50),
    IN p_courier VARCHAR(50),
    IN p_order_value DECIMAL(10,2),
    IN p_discount DECIMAL(10,2),
    IN p_approved_by VARCHAR(100),
    IN p_payment_mode VARCHAR(50),
    IN p_wallet DECIMAL(10,2),
    IN p_total_value DECIMAL(10,2),
    IN p_amount_to_pay DECIMAL(10,2),
    IN p_medication_period VARCHAR(50),
    IN p_receipt_image_url TEXT,
    IN p_transaction_id VARCHAR(100),
    IN p_date_time DATETIME,
    IN p_user_id INT(11),
    IN p_cat_id INT(11),
    IN p_qty INT(11),
    IN rec_id VARCHAR(1000)
)
BEGIN
     INSERT INTO sales (
        order_id, leads_id, direct_pickup, additional_number, address,
        district, state, country, courier, order_value, discount,
        approved_by, payment_mode, wallet, total_value, amount_to_pay,
        medication_period, receipt_image_url, transaction_id, date_time, created_by, order_name, quantity, Product_id
    ) VALUES (
        p_order_id, p_leads_id, p_direct_pickup, p_additional_number, p_address,
        p_district, p_state, p_country, p_courier, p_order_value, p_discount,
        p_approved_by, p_payment_mode, p_wallet, p_total_value, p_amount_to_pay,
        p_medication_period, p_receipt_image_url, p_transaction_id, p_date_time, p_user_id , p_cat_id, p_qty, rec_id
    );

END //

DELIMITER ;
