DELIMITER $$
Drop PROCEDURE IF exists SP_SaveEmpData;
CREATE PROCEDURE SP_SaveEmpData (
    IN p_emp_name VARCHAR(100),
    IN p_department VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_phone VARCHAR(20),
    IN p_created_by VARCHAR(100)
)
BEGIN
    INSERT INTO employee (
        emp_name,
        department,
        email,
        phone,
        created_by,
        created_at,
        password
    ) VALUES (
        p_emp_name,
        p_department,
        p_email,
        p_phone,
        p_created_by,
        NOW(),
        p_phone
    );

    INSERT INTO notification ( type, notification, created_by) VALUES ("Add", CONCAT(emp_name," successfully inserted."), 1);
    SELECT * FROM employee WHERE emp_id = LAST_INSERT_ID();
END$$

DELIMITER ;
