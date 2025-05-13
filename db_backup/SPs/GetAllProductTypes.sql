/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Ajithkumar
 DATE: 09/05/2025
 DESC: It is used to check mail
 ----------------------------------------------------------------------------------------------------------------- */

DELIMITER $$

CREATE PROCEDURE SP_GetAllProductTypes()
BEGIN
    SELECT 
        product_type_id AS product_type_id ,
        type_name AS label,
        type_name AS value,
        code 
        
    FROM product_types;
END $$

DELIMITER ;

CALL GetAllProductTypes();