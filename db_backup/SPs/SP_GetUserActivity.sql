
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
        SET sCondition = CONCAT("WHERE DATE(UA.created_at) BETWEEN '", startDate, "' AND '", endDate, "' ");
    END IF;

    IF sFilterData != null OR sFilterData != "" THEN 
        SET sCondition = CONCAT(sCondition, IF(sCondition <> "", CONCAT(" AND action = '",sFilterData,"' ") , CONCAT(" WHERE action = '",sFilterData,"' ")));
    END IF;

    -- Query for Admin user
    IF usertype_code = "AD" THEN
        SET @sQuery = CONCAT("
            SELECT 
                 UA.lp_recid            AS lp_recid
                ,UA.from_date           AS from_date
                ,UA.to_date         	AS to_date
                ,UA.leave_type          AS leave_type
                ,UA.action          	AS action
                ,UA.duration            AS duration
                ,UA.from_time           AS from_time
                ,UA.to_time         	AS to_time
                ,UA.Reason          	AS Reason
                ,UA.user_status         AS user_status
                ,UA.user_id         	AS user_id
                ,UA.created_by          AS created_by
                ,UA.created_at          AS created_at
                ,UA.updated_at          AS updated_at
                ,US.emp_id				AS emp_id
                ,US.name			AS emp_name
            FROM
                user_activity AS UA
            LEFT JOIN users AS US ON US.user_id = UA.created_by
            ", IFNULL(sCondition, ''), "
            ORDER BY UA.lp_recid DESC");

        -- SELACT @sQuery;
        PREPARE stmt FROM @sQuery;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

END//

DELIMITER ;