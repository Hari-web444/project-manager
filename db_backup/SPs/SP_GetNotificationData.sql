
 DELIMITER //
 DROP PROCEDURE IF EXISTS `SP_GetNotificationData`;
 
 CREATE PROCEDURE `SP_GetNotificationData`()
 BEGIN
     
     SELECT 
        not_recid, type, notification, created_at, created_by
    FROM
        notification ORDER BY 1 DESC;
     
 END//
 DELIMITER ;
 
