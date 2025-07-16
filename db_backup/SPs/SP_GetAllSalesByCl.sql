/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 14/07/2025
 DESC: It is used to get all sales
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //
DROP PROCEDURE IF EXISTS `SP_GetAllSalesByCl`;

CREATE PROCEDURE `SP_GetAllSalesByCl`()
BEGIN
    SELECT 
    SL.order_recid         AS  order_recid
    ,SL.leads_id            AS  leads_id
    ,SL.direct_pickup           AS  direct_pickup
    ,SL.additional_number           AS  additional_number
    ,SL.address         AS  address
    ,SL.district            AS  district
    ,SL.state           AS  state
    ,SL.country         AS  country
    ,SL.courier         AS  courier
    ,SL.order_id            AS  order_id
    ,CT.lead_name          AS  order_name
    ,SL.order_value         AS  order_value
    ,SL.discount            AS  discount
    ,SL.approved_by         AS  approved_by
    ,SL.payment_mode            AS  payment_mode
    ,SL.wallet          AS  wallet
    ,SL.total_value         AS  total_value
    ,SL.quantity            AS  quantity
    ,SL.amount_to_pay           AS  amount_to_pay
    ,SL.medication_period           AS  medication_period
    ,SL.receipt_image_url           AS  receipt_image_url
    ,SL.transaction_id          AS  transaction_id
    ,SL.date_time           AS  date_time
    ,SL.status          AS  status
    ,SL.created_by          AS  created_by
    ,CT.mobile_number       AS mobile_number
    ,CT.lead_id       AS lead_id
    ,SL.product_id     AS product_id
FROM
    sales AS SL
    LEFT JOIN leads AS CT ON CT.lead_id = SL.leads_id
    WHERE status = "Pending";
END//
DELIMITER ;
