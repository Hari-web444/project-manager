DELIMITER $$

-- Drop the stored procedure if it already exists
DROP PROCEDURE IF EXISTS `SP_GetProductsByBrand`;

-- Create the new stored procedure
CREATE PROCEDURE `SP_GetProductsByBrand`(IN brand_name VARCHAR(100))
BEGIN
    -- Select all products where the brand matches the provided parameter
    SELECT * FROM product WHERE brand = brand_name;
END $$

DELIMITER ;


CALL SP_GetProductsByBrand('Vaithyar poova');