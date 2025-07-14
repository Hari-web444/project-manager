/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 12/07/2025
 DESC: It is used to get all products
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //
DROP PROCEDURE IF EXISTS `SP_GetAllProductSale`;

CREATE PROCEDURE `SP_GetAllProductSale`(
    IN sFilterData VARCHAR(1000)
)

BEGIN

    DECLARE sCondition VARCHAR(1000) DEFAULT '';

    IF sFilterData != null OR sFilterData != "" THEN 
        SET sCondition = CONCAT(" WHERE UPPER(product_category) = UPPER('",sFilterData,"')");
    END IF;

     SET @sQuery = CONCAT("
        SELECT 
            product_recid, product_id, product_name, brand, product_category, form_factor, product_type, package_quantity, units, selling_price, product_description, quantity, min_stock_quantity, product_img, stock_status, created_by, updated_quantity, created_at, is_deleted, updated_at
        FROM
            product  ", IFNULL(sCondition, ''), " ORDER BY product_recid DESC ");

    -- SELECT @sQuery;
        PREPARE stmt FROM @sQuery;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;

END//
DELIMITER ;
