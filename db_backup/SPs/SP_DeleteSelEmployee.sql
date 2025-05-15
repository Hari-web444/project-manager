
/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 15/05/2025
 DESC: It is used delete the specific employee 
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //

DROP PROCEDURE IF EXISTS `SP_DeleteSelEmployee`;

CREATE PROCEDURE `SP_DeleteSelEmployee`(
    IN emp_recid INT(11)
)
BEGIN
    UPDATE employees
    SET 
        isDeleted = 1
    WHERE
        employees.emp_recid = emp_recid
    LIMIT 1;
END//

DELIMITER ;

