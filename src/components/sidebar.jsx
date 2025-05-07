import React, { useState, useEffect } from 'react';
import '../assets/styles/sidebar.css';
import main_logo from '../assets/images/main_logo.png';
import SvgContent from './svgcontent.jsx';
import configModule from '../../config.js';
import { useLocation, useNavigate ,NavLink} from 'react-router-dom';
import { useAuth } from '../components/context/Authcontext.jsx';

function Sidebar() {
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [menuItems, setMenuItems] = useState(false);
  const config = configModule.config();
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();
  const usertype_id = user?.usertype_id;
  

  const handleSubMenuClick = (path) => {
    const clickedMenu = menuItems.find(item => item.path === path);

    if (!clickedMenu || !clickedMenu.subMenu || clickedMenu.subMenu.length === 0) {
      return; // No submenu to open
    }

    // If it's already open, close it
    if (openSubMenu === path) {
      setOpenSubMenu(null);
    } else {
      setOpenSubMenu(path);

      // Navigate to first sub-item if current path isn't already a sub-item
      const firstSubPath = clickedMenu.subMenu[0].path;
      if (location.pathname !== firstSubPath) {
        navigate(firstSubPath);
      }
    }
  };

  const getSidebarList = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}GetSidebarList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ usertype_id: parseInt(usertype_id) })
      });

      const result = await response.json();
      if (response.ok) {
        const sidebarMenu = formatSidebarMenu(result.mainList, result.subList);
        setMenuItems(sidebarMenu);
      } else {
        console.error("Server error:" + result.message);
      }
    } catch (error) {
      console.error("Server error:" + error.message);
    }
  };

  useEffect(() => {
    if(user){ 
        getSidebarList();
      }
  }, [usertype_id]);

  const formatSidebarMenu = (mainList, subList) => {
    return mainList.map(main => {
      const subMenuItems = subList
        .filter(sub => sub.menu_id === main.menu_id)
        .map(sub => ({
          path: sub.path,
          name: sub.name
        }));

      const menuItem = {
        path: main.path,
        name: main.name,
        icon: main.icon,
      };

      if (main.exact === 1) {
        menuItem.exact = true;
      }

      if (subMenuItems.length > 0) {
        menuItem.subMenu = subMenuItems;
      }

      return menuItem;
    });
  };


  return (
    <div className="sidebar">
      <div className="logo mb-3 text-center">
        <img src={main_logo} className="main-logo-sb" alt="Logo" />
      </div>
      <nav className="sidebar-nav overflow-auto">
        {Array.isArray(menuItems) && menuItems.map(({ path, name, icon, exact, subMenu }) => (
          <div key={name}>
            {subMenu ? (
              <div className="submenu-header">
                <NavLink to={path} end={exact} onClick={() => handleSubMenuClick(path)}>
                  <SvgContent svg_name={icon} />
                  <span className="sbnone-title ">{name}</span>

                  <span className={`submenu-arrow sbsubitem-title ${openSubMenu === path ? 'open' : ''}`}>
                    {openSubMenu === path ? (
                      <SvgContent svg_name="dropdownUp" />
                    ) : (
                      <SvgContent svg_name="dropdownDown" />
                    )}
                  </span>

                </NavLink>

                {openSubMenu && (
                  <div className='open-submenu'>
                    {subMenu.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                          `submenu-item ${isActive ? 'submenu-item-active' : ''}`
                        }
                        style={{ paddingLeft: "0px" }}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>


            ) : (
              <NavLink to={path} end={exact}>
                <SvgContent svg_name={icon} />
                <span className="sbnone-title">{name}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
