DELIMITER $$

CREATE PROCEDURE SP_GetSingleUserData(IN p_userId INT)
BEGIN
    SELECT 
        emp_id,
        name,
        email,
        mobile_number,
        date_of_joining,
        designation,
        image_url
    FROM 
        users
    WHERE 
        user_id = p_userId;
END$$

DELIMITER ;