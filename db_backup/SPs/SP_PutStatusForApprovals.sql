/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 14/07/2025
 DESC: It is used to get all products by IDs
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //

DROP PROCEDURE IF EXISTS `SP_PutStatusForApprovals`;

CREATE PROCEDURE `SP_PutStatusForApprovals`(
    IN sStatus  VARCHAR(50),
    IN orderId  INT(11)
)
BEGIN
        
    SET SQL_SAFE_UPDATES = 0;
        UPDATE sales 
        SET status = sStatus
        WHERE order_recid = orderId ;
	SET SQL_SAFE_UPDATES = 1;
END //

DELIMITER ;
