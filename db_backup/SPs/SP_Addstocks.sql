DELIMITER $$

CREATE PROCEDURE SP_Addstocks(
  IN p_stock_product_id VARCHAR(30),
  IN p_stock_quantity INT,
  IN p_min_stock_qty INT,
  IN p_stock_status ENUM('Available', 'Not Available', 'Low Stock')
)
BEGIN
  INSERT INTO stock (
    stock_product_id,
    stock_quantity,
    min_stock_qty,
    stock_status
  )
  VALUES (
    p_stock_product_id,
    p_stock_quantity,
    p_min_stock_qty,
    p_stock_status
  );
END $$

DELIMITER ;
