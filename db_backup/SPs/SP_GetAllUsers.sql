/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 24/06/2025
 DESC: It is used to get all users
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //
DROP PROCEDURE IF EXISTS `SP_GetAllUsers`;

CREATE PROCEDURE `SP_GetAllUsers`()
BEGIN

    SELECT 
        user_id, emp_id, name, email, mobile_number , usertype_id, designation, date_of_joining, salary, incentive_percentage, address, image_url, created_by, created_at
    FROM
        users 
    WHERE isDeleted = 0 AND designation NOT IN ("Admin");
   
END//

DELIMITER ;

