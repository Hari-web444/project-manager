/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 19/05/2025
 DESC: It is used save the branch list
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //

DROP PROCEDURE IF EXISTS `SP_SaveBranchDetails`;

CREATE PROCEDURE `SP_SaveBranchDetails`(
    IN p_branch_id VARCHAR(50),
    IN p_branch_name VARCHAR(100),
    IN p_branch_type VARCHAR(50),
    IN p_branch_in_charge VARCHAR(100),
    IN p_branch_incharge_recid INT(11),
    IN p_email VARCHAR(100),
    IN p_phone_number VARCHAR(20),
    IN p_address TEXT,
    IN p_country VARCHAR(100),
    IN p_state VARCHAR(100),
    IN p_district VARCHAR(100),
    IN p_location VARCHAR(100),
    IN p_rent DECIMAL(10,2),
    IN p_opening_date DATETIME,
    IN p_assign_brand_gramiyam BOOLEAN,
    IN p_assign_brand_vaithyar BOOLEAN
)
BEGIN
    INSERT INTO branches (
        branch_id,
        branch_name,
        branch_type,
        branch_in_charge,
        branch_incharge_recid,
        email,
        phone_number,
        address,
        country,
        state,
        district,
        location,
        rent,
        opening_date,
        assign_brand_gramiyam,
        assign_brand_vaithyar,
        created_at
    ) VALUES (
        p_branch_id,
        p_branch_name,
        p_branch_type,
        p_branch_in_charge,
        p_branch_incharge_recid,
        p_email,
        p_phone_number,
        p_address,
        p_country,
        p_state,
        p_district,
        p_location,
        p_rent,
        p_opening_date,
        p_assign_brand_gramiyam,
        p_assign_brand_vaithyar,
        NOW()
    );

    SELECT * FROM branches ORDER BY 1 DESC;
END//

DELIMITER ;


