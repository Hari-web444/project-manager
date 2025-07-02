/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 25/06/2025
 DESC: It is used to get all lead details
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //
DROP PROCEDURE IF EXISTS `SP_GetAllLeadDetails`;

CREATE PROCEDURE `SP_GetAllLeadDetails`(
    IN sFilterData VARCHAR(100)
)
BEGIN

    DECLARE sCondition VARCHAR(1000) DEFAULT '';

    IF sFilterData != null OR sFilterData != "" THEN 
        SET sCondition = CONCAT(sCondition, IF(sCondition <> "", CONCAT(" AND category = '",sFilterData,"' ") , CONCAT(" WHERE UPPER(category) = UPPER('",sFilterData,"') ")));
    END IF;

     SET @sQuery = CONCAT("
    SELECT 
        LD.lead_recid AS lead_recid,
        LD.lead_id AS lead_id,
        LD.lead_name AS lead_name,
        LD.age AS age,
        LD.gender AS gender,
        LD.category AS category,
        LD.mobile_number AS mobile_number,
        LD.email AS email,
        US.emp_id AS created_by,
        LD.disposition AS disposition,
        LD.disposition_date AS disposition_date,
        LD.created_at AS created_at
    FROM
        leads AS LD 
    LEFT JOIN users AS US ON US.user_id = LD.created_by ", IFNULL(sCondition, ''), " ");

    -- SELACT @sQuery;
        PREPARE stmt FROM @sQuery;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;

    
END//
DELIMITER ;
