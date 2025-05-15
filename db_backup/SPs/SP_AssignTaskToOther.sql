
/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 15/05/2025
 DESC: It is used delete the specific employee 
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //

DROP PROCEDURE IF EXISTS `SP_AssignTaskToOther`;

CREATE PROCEDURE `SP_AssignTaskToOther`(
     IN iEmp_recid INT(11)
    ,IN iAssign_id INT(11)
)
BEGIN
    
    INSERT INTO assigned_task (emp_recid, assign_id) 
    VALUES (iEmp_recid, iAssign_id);
    
END//

DELIMITER ;

