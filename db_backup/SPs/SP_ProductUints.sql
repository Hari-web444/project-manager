/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Ajithkumar
 DATE: 09/05/2025
 DESC: It is used to check mail
 ----------------------------------------------------------------------------------------------------------------- */

DELIMITER $$

CREATE PROCEDURE SP_ProductUints()
BEGIN
    SELECT 
        brand_id ,
        brand_name AS label,
        brand_name AS value,
        code 
        
    FROM brands;
END $$

DELIMITER ;

CALL SP_ProductUints();