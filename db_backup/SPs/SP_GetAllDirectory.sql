/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 10/07/2025
 DESC: It is used to get all directies
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //
DROP PROCEDURE IF EXISTS `SP_GetAllDirectory`;

CREATE PROCEDURE `SP_GetAllDirectory`()
BEGIN
    
    SELECT * FROM directory;
    
END//
DELIMITER ;
