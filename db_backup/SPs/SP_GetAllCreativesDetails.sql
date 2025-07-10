
/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 08/07/2025
 DESC: It is used get the creative services
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //

DROP PROCEDURE IF EXISTS `SP_GetAllCreativesDetails`;

CREATE PROCEDURE `SP_GetAllCreativesDetails`(
    IN sFilterData VARCHAR(1000)
)
BEGIN

    DECLARE sCondition VARCHAR(1000) DEFAULT '';

    IF sFilterData != null OR sFilterData != "" THEN 
        SET sCondition = CONCAT(sCondition , CONCAT(" WHERE UPPER(status) = UPPER('",sFilterData,"') "));
    END IF;
    
    SET @sQuery = CONCAT("
    SELECT creative_id, emp_id, title, type, description, date_to_post, created_at, status
    FROM creativeservice ", IFNULL(sCondition, ''), " ORDER BY creative_id DESC ");

    -- SELACT @sQuery;
        PREPARE stmt FROM @sQuery;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    
END//
DELIMITER ;

