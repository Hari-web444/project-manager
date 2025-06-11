import React, { useRef, useEffect, useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from './components/sidebar.jsx';
import SvgContent from './components/svgcontent.jsx';
import useWindowWidth from './components/windows-width.jsx';
import { useAuth } from './components/context/Authcontext.jsx';
import Logoutmodal from './components/logoutmodal.jsx';
import PropTypes from 'prop-types';

const pathTitles = {
  '/dashboard': 'Dashboard',
  '/leads': 'Leads',
  '/todo': 'To do list',
  '/products': 'Products',
  '/products/add': 'Add Products',
  '/clients': 'Clients',
  '/tracking': 'Tracking',
  '/user-profile': 'UserProfile',
  '/profile': 'Profile',
  '/orders': 'Orders',
  '/inventory': 'Inventory',
  '/accounts': 'Accounts',
  '/branches': 'Branches',
  '/branches/view': 'Branch View',
  '/employee/list': 'Employee List',
  '/employee/list/add-edit': 'Add/Edit Employee',
  '/employee/assign': 'Assign Employee',
  '/employee/attendance': 'Employee Attendance',
  '/employee/leave-permissions': 'Leave & Permission',
};

function MainLayout({ menuItems }) {
  const location = useLocation();
  const width = useWindowWidth();
  const sidebarRef = useRef(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isShowAlertpopup, setIsShowAlertpopup] = useState(false);
  const { user } = useAuth();
  const path = pathTitles[location.pathname] || '';

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarVisible(false);
      }
    };

    if (sidebarVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarVisible]);

  return (
    <div className='d-flex w-100 h-100'>
      {/* Sidebar - Desktop */}
      {width > 1024 && <Sidebar menuItems={menuItems} />}

      {/* Sidebar - Mobile */}
      {width <= 1024 && sidebarVisible && (
        <div className='sidebar-div' ref={sidebarRef}>
          <button className='close-sidemenu' onClick={toggleSidebar} style={{ zIndex: 99999 }}>
            <SvgContent svg_name="close" />
          </button>
          <Sidebar menuItems={menuItems} />
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, background: 'rgb(228 237 230 / 54%)', width: 'calc(100% - 245px)' }}>
        <div className='page-header-common justify-content-between'>
          <div className="animated-text-container tabphone-view-container">
            <button className='sidemenu-hide' onClick={toggleSidebar}>
              <SvgContent svg_name="sidemenu" height={20} width={20} />
            </button>
            <h4 className="animated-text mb-0">{path}</h4>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className='notify-tb cursor-pointer'>
              <SvgContent svg_name="Notification" />
            </div>
            <div className='notify-tb cursor-pointer' title={user?.user_typecode === "AD" ? "Logout" : "Profile"}>
              {user?.user_typecode === "AD" ? (
                <button onClick={() => setIsShowAlertpopup(true)}>
                  <SvgContent svg_name="logout_ad" />
                </button>
              ) : (
                <Link to='/profile'>
                  <SvgContent svg_name="Profile" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <Outlet />
      </div>

      {isShowAlertpopup && (
        <Logoutmodal oncloses={() => setIsShowAlertpopup(false)} />
      )}
    </div>
  );
}
MainLayout.propTypes = {
  menuItems: PropTypes.array.isRequired,
};
export default MainLayout;
