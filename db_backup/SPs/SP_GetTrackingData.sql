
/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 01/07/2025
 DESC: It is used to get user activity details
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //

DROP PROCEDURE IF EXISTS `SP_GetTrackingData`;

CREATE PROCEDURE `SP_GetTrackingData`(
    IN startDate VARCHAR(50),
    IN endDate VARCHAR(50),
    IN sFilterData VARCHAR(50)
)
BEGIN
    DECLARE sCondition VARCHAR(1000) DEFAULT '';

    -- Check if both dates are provided
    IF (startDate IS NOT NULL AND startDate != '') AND (endDate IS NOT NULL AND endDate != '') THEN
        SET sCondition = CONCAT("WHERE DATE(O.date_time) BETWEEN '", startDate, "' AND '", endDate, "' ");
    END IF;

    IF sFilterData != null OR sFilterData != "" THEN 
        SET sCondition = CONCAT(sCondition, IF(sCondition <> "", CONCAT(" AND status = '",sFilterData,"' ") , CONCAT(" WHERE status = '",sFilterData,"' ")));
    END IF;

    -- Query for Admin user
        SET @sQuery = CONCAT("
                SELECT 
                    O.order_recid            AS order_recid
                    ,O.leads_id               AS leads_id
                    ,O.direct_pickup          AS direct_pickup
                    ,O.additional_number      AS additional_number
                    ,O.address                AS address
                    ,O.district               AS district
                    ,O.state                  AS state
                    ,O.country                AS country
                    ,O.courier                AS courier
                    ,O.order_id               AS order_id
                    ,O.order_name             AS order_name
                    ,O.order_value            AS order_value
                    ,O.discount               AS discount
                    ,O.approved_by            AS approved_by
                    ,O.payment_mode           AS payment_mode
                    ,O.wallet                 AS wallet
                    ,O.total_value            AS total_value
                    ,O.quantity               AS quantity
                    ,O.product_id             AS product_id
                    ,O.amount_to_pay          AS amount_to_pay
                    ,O.medication_period      AS medication_period
                    ,O.receipt_image_url      AS receipt_image_url
                    ,O.transaction_id         AS transaction_id
                    ,O.stick_type             AS stick_type
                    ,O.date_time              AS date_time
                    ,O.status                 AS status
                    ,O.created_by             AS created_by
                    ,O.salescol               AS lead_id
                    ,U.lead_id                 AS emp_id
                    ,U.lead_name                   AS lead_name
                FROM
                    sales AS O
                LEFT JOIN leads AS U ON U.lead_id = O.leads_id
                ", IFNULL(sCondition, ''), "
                ORDER BY O.order_recid DESC");

            -- EXECUTE THE DYNAMIC SQL
            PREPARE stmt FROM @sQuery;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;


END//

DELIMITER ;