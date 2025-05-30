import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Sidebar from './components/sidebar.jsx';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import PrivateRoute from './components/auth/PrivateRoute.jsx';
import { useAuth } from './components/context/Authcontext.jsx';
import configModule from '../config.js';
import useWindowWidth from './components/windows-width.jsx';

import SvgContent from './components/svgcontent.jsx';
import AdminPage from './admin/admin.jsx';
import Dashboard from './pages/dashboard/dashboard.jsx';
import Leads from './pages/leads/leads.jsx';
import TodoList from './pages/todo/todo-list.jsx';
import Products from './pages/products/products.jsx';
import Clients from './pages/clientslist/clients.jsx';
import Tracking from './pages/tracking/tracking.jsx';
import UserProfile from './pages/userprofile/user-profile.jsx';
import Accounts from './pages/accounts/accounts.jsx';
import Inventory from './pages/inventory/inventory.jsx';
import Branches from './pages/branches/branches.jsx';
import ViewBranch from './pages/branches/viewbranch.jsx';
import EmployeeList from './pages/employee/employee-list.jsx';
import AddEmployee from './pages/employee/addemployee-list.jsx';
import EmployeeAssign from './pages/employee/employee-assign.jsx';
import EmployeeAttendance from './pages/employee/employee-attendance.jsx';
import EmployeeLeavePermission from './pages/employee/employee-leavepermission.jsx';
import AddProducts from './pages/products/AddProducts.jsx';
import Stocks from './pages/stocks/stock.jsx';

function App() {
  const width = useWindowWidth();
  const location = useLocation();
  const authPaths = ['/', '/login', '/forgot-password', '/notfound'];
  const [menuItems, setMenuItems] = useState(false);
  const [isShowAlertpopup, setIsShowAlertpopup] = useState(false);
  const config = configModule.config();
  const { user } = useAuth();
  const usertype_id = user?.usertype_id;
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarRef = useRef(null);


  const pathTitles = {
    '/dashboard': 'Dashboard',
    '/leads': 'Leads',
    '/todo': 'To do list',
    '/products': 'Products',
    '/products/add': 'Addproducts',
    '/clients': 'Clients',
    '/tracking': 'Tracking',
    '/user-profile': 'UserProfile',
    '/orders': 'Orders',
    '/inventory': 'Inventory',
    '/accounts': 'Accounts',
    '/branches': 'Branches',
    '/branches/view': 'Branches',
    '/employee/list': 'Employee List',
    '/employee/list/add-edit': 'Employee Add/Edit List',
    '/employee/assign': 'Employee Assign',
    '/employee/attendance': 'Employee Attendance',
    '/employee/leave-permissions': 'Leave and Permission',
  };

  const path = pathTitles[location.pathname] || 'Dashboard';

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
        const sidebarMenu = formatSidebarMenu(result.data.mainList, result.data.subList);
        localStorage.setItem("authPermissions", result.token);
        setMenuItems(sidebarMenu);
      } else {
        console.error("Server error:" + result.message);
      }
    } catch (error) {
      console.error("Server error:" + error.message);
    }
  };

  useEffect(() => {
    if (user?.usertype_id) {
      getSidebarList();
    }
  }, [user?.usertype_id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setSidebarVisible(false); // or call toggleSidebar() if you prefer
      }
    };

    if (sidebarVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarVisible]);


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

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <>
      {authPaths.includes(location.pathname) ? (
        <AdminPage pathURL={location.pathname === '/' ? '/login' : location.pathname} />
      ) : (
        <div className='d-flex w-100 h-100'>
          {width > 1024 && <Sidebar menuItems={menuItems} />}
          <div style={{ flex: 1, background: 'rgb(228 237 230 / 54%)', width: 'calc(100% - 245px)' }}>
            {(width < 1024 && sidebarVisible) && (
              <div className='sidebar-div'>
                <button className='close-sidemenu' onClick={toggleSidebar} style={{ zIndex: "99999" }}>
                  <SvgContent svg_name="close" />
                </button>

                <Sidebar menuItems={menuItems} />
              </div>
            )}
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
                <div className='notify-tb cursor-pointer' title={user && user.user_typecode === "AD" ? "Logout" : "Profile"}>
                  {user && user.user_typecode === "AD" ? (<button onClick={() => setIsShowAlertpopup(true)}><SvgContent svg_name="logout_ad" /></button>) : ((<SvgContent svg_name="Profile" />))}
                </div>
              </div>
            </div>

            <Routes>
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/leads" element={<PrivateRoute><Leads /></PrivateRoute>} />
              <Route path="/todo" element={<PrivateRoute><TodoList /></PrivateRoute>} />
              <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
              <Route path="/products/add" element={<PrivateRoute><AddProducts /></PrivateRoute>} />
              <Route path="/employee" element={<Navigate to="/employee/list" replace />} />
              <Route path="/branches" element={<PrivateRoute><Branches /></PrivateRoute>} />
              <Route path="/branches/view" element={<PrivateRoute><ViewBranch /></PrivateRoute>} />
              <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
              <Route path="/accounts" element={<PrivateRoute><Accounts /></PrivateRoute>} />
              <Route path="/orders" element={<PrivateRoute><Stocks /></PrivateRoute>} />
              {/* <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} /> */}
              <Route path="/clients" element={<PrivateRoute><Clients /></PrivateRoute>} />
              <Route path="/tracking" element={<PrivateRoute><Tracking /></PrivateRoute>} />
              <Route path="/user-profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />

              {/*  Employee's sub-items */}
              <Route path="/employee/list" element={<PrivateRoute><EmployeeList /></PrivateRoute>} />
              <Route path="/employee/list/add-edit" element={<PrivateRoute><AddEmployee /></PrivateRoute>} />
              <Route path="/employee/assign" element={<PrivateRoute><EmployeeAssign /></PrivateRoute>} />
              <Route path="/employee/attendance" element={<PrivateRoute><EmployeeAttendance /></PrivateRoute>} />
              <Route path="/employee/leave-permissions" element={<PrivateRoute><EmployeeLeavePermission /></PrivateRoute>} />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>

          {isShowAlertpopup && (
            <div className="modal-overlay modal-overlay-position">
              <div className="modal-container">
                <div className="modal-header mb-3">
                  <h5 className="mb-0 add-new-hdr">Logout</h5>
                </div>
                <div className="modal-body mb-2">
                  <div className="container commonst-select">
                    <p>Are you sure to logout ?</p>
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="cancel-button" onClick={() => setIsShowAlertpopup(false)}>No, Vendaam</button>
                  <button className="next-button" onClick={() => { navigate("/login"); localStorage.removeItem('authToken'); setIsShowAlertpopup(false); }} >Seri Ok</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
