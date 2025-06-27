/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 23/06/2025
 DESC: It is used to get all user designation
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //
DROP PROCEDURE IF EXISTS `SP_GetAllUserType`;

CREATE PROCEDURE `SP_GetAllUserType`()
BEGIN

    SELECT 
        usertype_id, user_type, user_typecode
    FROM
        usertype  ;
   
END//

DELIMITER ;