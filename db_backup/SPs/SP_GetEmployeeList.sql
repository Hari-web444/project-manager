/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 13/05/2025
 DESC: It is used get the employee list
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //
DROP PROCEDURE IF EXISTS `SP_GetEmployeeList`;
CREATE PROCEDURE `SP_GetEmployeeList`(
    IN userId INT(11),
    IN user_typecode VARCHAR(20)
)
BEGIN

    IF user_typecode = 'AD' THEN
        SELECT 
        user_id, emp_id, name, designation, mobile_number, email, date_of_joining, salary, incentive_percentage, address, image_url, created_by, created_at, isDeleted
        FROM users WHERE designation NOT IN ("Admin")
        ORDER BY created_at DESC ;
    ELSE
        SELECT 
        user_id, emp_id, name, designation, mobile_number, email, date_of_joining, salary, incentive_percentage, address, image_url, created_by, created_at, isDeleted
        FROM users
        WHERE designation NOT IN ("Admin") AND created_by = userId 
        ORDER BY created_at DESC ;
    END IF;


END//

DELIMITER ;

