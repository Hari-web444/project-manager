/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 25/06/2025
 DESC: It is used to get all lead details
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //
DROP PROCEDURE IF EXISTS `SP_GetAllLeadDetails`;

CREATE PROCEDURE `SP_GetAllLeadDetails`()
BEGIN
    
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
    LEFT JOIN users AS US ON US.user_id = LD.created_by;

    
END//
DELIMITER ;
