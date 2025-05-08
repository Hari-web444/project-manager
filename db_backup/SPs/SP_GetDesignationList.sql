/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 08/05/2025
 DESC: It is used get the designation list
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //

DROP PROCEDURE IF EXISTS `SP_GetDesignationList`;

CREATE PROCEDURE `SP_GetDesignationList`()
BEGIN

    SELECT 
          usertype_id   AS designation_id
        , CONCAT(user_typecode ," - ",user_type)     AS label
        , user_type     AS value
        , user_typecode AS code
    FROM
        usertype
    WHERE 
        user_typecode != "AD";

END//

DELIMITER ;

