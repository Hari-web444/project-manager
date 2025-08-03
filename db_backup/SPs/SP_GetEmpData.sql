
 DELIMITER //
 DROP PROCEDURE IF EXISTS `SP_GetEmpData`;
 
 CREATE PROCEDURE `SP_GetEmpData`()
 BEGIN
     
     SELECT 
        emp_id,
        emp_name,
        department,
        email,
        phone,
        created_by,
        created_at
    FROM
        employee WHERE isDeleted = 0 ;
     
 END//
 DELIMITER ;
 