/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 15/07/2025
 DESC: It is used to get all user designation
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //
DROP PROCEDURE IF EXISTS `SP_GetAllTodoList`;

CREATE PROCEDURE `SP_GetAllTodoList`(
    IN userId INT(11),
    IN sType VARCHAR(50)
)
BEGIN

    IF sType = "Leads" THEN 
        SELECT * FROM leads WHERE disposition IN ("Follow up","Call back") AND created_by = userId;
    ELSE 
        SELECT * FROM leads WHERE disposition = sType AND created_by = userId;
    END IF;

   
END//

DELIMITER ;