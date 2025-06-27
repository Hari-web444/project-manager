/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 13/05/2025
 DESC: It is used save the employee data
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //

DROP PROCEDURE IF EXISTS `SP_SaveEmpDetails`;

CREATE PROCEDURE `SP_SaveEmpDetails`(
    IN p_emp_id VARCHAR(50),
    IN p_emp_name VARCHAR(100),
    IN p_designation VARCHAR(100),
    IN p_mobile_number VARCHAR(20),
    IN p_email VARCHAR(100),
    IN p_date_of_joining DATE,
    IN p_salary DECIMAL(20,2),
    IN p_incentive_percentage DECIMAL(5,2),
    IN p_address TEXT,
    IN p_created_by VARCHAR(50),
    IN p_image_url TEXT,
    IN p_des_id INT(11)
)
BEGIN

     INSERT INTO users (
        emp_id, name, designation, mobile_number, email,
        date_of_joining, salary, incentive_percentage, address, created_by , image_url, password , usertype_id
    )
    VALUES (
        p_emp_id, p_emp_name, p_designation, p_mobile_number, p_email,
        p_date_of_joining, p_salary, p_incentive_percentage, p_address, p_created_by , p_image_url , SHA2(p_mobile_number, 256) , p_des_id
    );

    SELECT * FROM users ORDER BY 1 DESC LIMIT 1;

END//

DELIMITER ;

