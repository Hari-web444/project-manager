/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 21/05/2025
 DESC: It is used get the branch list
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //

DROP PROCEDURE IF EXISTS `SP_GetBranchDetails`;

CREATE PROCEDURE `SP_GetBranchDetails`(
    IN userId INT(11),
    IN user_code VARCHAR(20)
)
BEGIN

    IF user_code = "AD" THEN
        SELECT 
            branch_recid,
            branch_id,
            branch_name,
            branch_type,
            phone_number,
            branch_in_charge,
            branch_incharge_recid,
            country,
            state,
            district,
            email,
            opening_date,
            rent,
            location,
            address,
            assign_brand_vaithyar,
            assign_brand_gramiyam,
            created_at
        FROM
            branches 
        WHERE isDeleted = 0
        ORDER BY 1 DESC;
    ELSE
        SELECT 
            branch_recid,
            branch_id,
            branch_name,
            branch_type,
            phone_number,
            branch_in_charge,
            branch_incharge_recid,
            country,
            state,
            district,
            email,
            opening_date,
            rent,
            location,
            address,
            assign_brand_vaithyar,
            assign_brand_gramiyam,
            created_at
        FROM
            branches 
        WHERE 
            isDeleted = 0 AND branch_incharge_recid = userId
        ORDER BY 1 DESC;

    END IF;

END//

DELIMITER ;

