/* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 05/05/2025
 DESC: It is used to get application lists
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //

DROP PROCEDURE IF EXISTS `SP_GetSidebarList`;

CREATE PROCEDURE `SP_GetSidebarList`(
   IN userTypeId      INT(11)
)
BEGIN

    SELECT 
          M.menu_id       AS menu_id
        , M.name          AS name
        , M.path          AS path
        , M.icon          AS icon
        , M.exact         AS exact
        , M.created_at    AS created_at
    FROM
        user_menu AS UM
        LEFT JOIN menu AS M ON M.menu_id = UM.menu_id
    WHERE 
        usertype_id = userTypeId;
   
END//

DELIMITER ;

