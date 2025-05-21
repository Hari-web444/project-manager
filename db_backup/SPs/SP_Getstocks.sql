DELIMITER //

CREATE PROCEDURE SP_Getstocks(IN in_brand VARCHAR(150))
BEGIN
    SELECT 
        s.stock_recid,
        s.stock_product_id,
        p.product_name,
        p.product_category,
        p.selling_price,
        p.units,
        s.stock_quantity,
        s.updated_qty,
        s.min_stock_qty,
        s.stock_status,
        s.created_at,
        s.updated_at
    FROM stock s
    JOIN product p ON s.stock_product_id = p.product_id
    WHERE p.brand = in_brand OR in_brand IS NULL OR in_brand = ''
    ORDER BY s.stock_recid DESC;
END //

DELIMITER ;
  