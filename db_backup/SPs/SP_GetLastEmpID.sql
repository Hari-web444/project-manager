/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 12/05/2025
 DESC: It is used get the employee lasr id
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //

DROP PROCEDURE IF EXISTS `SP_GetLastEmpID`;

CREATE PROCEDURE `SP_GetLastEmpID`(
    IN userId INT(11),
    IN sValue VARCHAR(100)
)
BEGIN

    SELECT 
        emp_id
    FROM
        vaithiyar_poova.employees
    WHERE
        created_by = userId AND designation = sValue
    ORDER BY created_at DESC
    LIMIT 1;

END//

DELIMITER ;

