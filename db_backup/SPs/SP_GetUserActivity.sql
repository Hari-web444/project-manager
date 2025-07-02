
/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 01/07/2025
 DESC: It is used to get user activity details
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //

DROP PROCEDURE IF EXISTS `SP_GetUserActivity`;

CREATE PROCEDURE `SP_GetUserActivity`(
    IN usertype_code VARCHAR(10),
    IN startDate VARCHAR(50),
    IN endDate VARCHAR(50),
    IN sFilterData VARCHAR(50)
)
BEGIN
    DECLARE sCondition VARCHAR(1000) DEFAULT '';

    -- Check if both dates are provided
    IF (startDate IS NOT NULL AND startDate != '') AND (endDate IS NOT NULL AND endDate != '') THEN
        SET sCondition = CONCAT("WHERE AT.date BETWEEN '", startDate, "' AND '", endDate, "' ");
    END IF;

    IF sFilterData != null OR sFilterData != "" THEN 
        SET sCondition = CONCAT(sCondition, IF(sCondition <> "", CONCAT(" AND status = '",sFilterData,"' ") , CONCAT(" WHERE status = '",sFilterData,"' ")));
    END IF;

    -- Query for Admin user
    IF usertype_code = "AD" THEN
        SET @sQuery = CONCAT("
        SELECT 
            AT.attendance_id    AS attendance_id,
            US.emp_id           AS emp_id,
            AT.emp_name         AS emp_name,
            AT.designation      AS designation,
            AT.work_type        AS work_type,
            AT.duration         AS duration,
            AT.date             AS date,
            AT.login_time       AS login_time,
            AT.logoff_time      AS logoff_time,
            AT.status           AS status
        FROM
            attendance AS AT
        LEFT JOIN users AS US ON US.user_id = AT.emp_id 
        ", IFNULL(sCondition, ''), "
        ORDER BY AT.attendance_id DESC");

        -- SELACT @sQuery;
        PREPARE stmt FROM @sQuery;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

END//

DELIMITER ;