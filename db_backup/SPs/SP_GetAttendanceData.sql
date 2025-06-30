
/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 30/05/2025
 DESC: It is used to get attendance details
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //

DROP PROCEDURE IF EXISTS `SP_GetAttendanceData`;

CREATE PROCEDURE `SP_GetAttendanceData`(
    IN usertype_code VARCHAR(10)
)
BEGIN

    IF usertype_code = "AD" THEN
        
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
        ORDER BY attendance_id DESC;
        
    END IF;

END//

DELIMITER ;

