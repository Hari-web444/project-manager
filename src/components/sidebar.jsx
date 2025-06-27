import React, { useState } from 'react';
import '../assets/styles/sidebar.css';
import main_logo from '../assets/images/main_logo.png';
import SvgContent from './svgcontent.jsx';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

function Sidebar({ menuItems }) {
  const [openSubMenu, setOpenSubMenu] = useState(() => {
    return localStorage.getItem('lastOpenSubMenu') || false;
  });

  const handleSubMenuClick = (path) => {
    setOpenSubMenu((prev) => {
      const newValue = prev === path ? null : path;
      localStorage.setItem('lastOpenSubMenu', newValue || '');
      return newValue;
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
                <NavLink to={path} end={exact} className="justify-content-between" onClick={() => handleSubMenuClick(path)}>
                  <div className='dropdown-st-sb'>
                    <SvgContent svg_name={icon} />
                    <span className="sbnone-title ">{name}</span>
                  </div>
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
Sidebar.propTypes = {
  menuItems: PropTypes.string.isRequired,
};
export default Sidebar;
