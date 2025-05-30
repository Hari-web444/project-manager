 /* ----------------------------------------------------------------------------------------------------------------- 
 NAME: Hariharan S
 DATE: 05/05/2025
 DESC: It is used to get sub application lists
 ----------------------------------------------------------------------------------------------------------------- */
DELIMITER //

DROP PROCEDURE IF EXISTS `SP_GetSubSidebarList`;

CREATE PROCEDURE `SP_GetSubSidebarList`(
   IN userTypeId      INT(11)
)
BEGIN

    SELECT 
          SM.submenu_id     AS submenu_id
        , SM.menu_id        AS menu_id
        , SM.name           AS name
        , SM.path           AS path
        , SM.created_at     AS created_at
        , IF(UM.export_btn = 1 , true, false)   AS exportVisible
        , IF(UM.sort_btn = 1 , true, false)     AS sortVisible
        , IF(UM.search_btn = 1 , true, false)   AS searchVisible
        , IF(UM.filter_btn = 1 , true, false)   AS filterVisible
        , IF(UM.edit_btn = 1 , true, false)     AS editVisible
        , IF(UM.add_btn = 1 , true, false)      AS addVisible
        , IF(UM.delete_btn = 1 , true, false)   AS deleteVisible
        , IF(UM.suffle_btn = 1 , true, false)   AS suffleVisible
        , IF(UM.view_btn = 1 , true, false)     AS viewVisible
    FROM
        user_menu AS UM
        LEFT JOIN menu AS M ON M.menu_id = UM.menu_id
        LEFT JOIN sub_menu AS SM ON  SM.submenu_id = UM.submenu_id
    WHERE
        usertype_id = userTypeId AND SM.menu_id IS NOT NULL;
   
END//

DELIMITER ;

