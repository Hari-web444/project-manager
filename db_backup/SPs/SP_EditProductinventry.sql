
DELIMITER //
DROP PROCEDURE IF EXISTS `SP_EditProductinventry`;
CREATE PROCEDURE SP_EditProductinventry(
    IN p_product_recid INT,
    IN p_added_quantity INT,
    IN p_selling_price DECIMAL(10, 2)
)
BEGIN
    DECLARE current_quantity INT;

    -- Get existing quantity
    SELECT quantity INTO current_quantity
    FROM product
    WHERE product_recid = p_product_recid;

    -- Update product
    UPDATE product
    SET 
        quantity = current_quantity + p_added_quantity,
        updated_quantity = p_added_quantity,
        selling_price = p_selling_price,
        updated_at = NOW()
    WHERE product_recid = p_product_recid;
END //

DELIMITER ;
