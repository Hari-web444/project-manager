import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/sidebar.jsx';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import PrivateRoute from './components/auth/PrivateRoute.jsx';
import { useAuth } from './components/context/Authcontext.jsx';
import configModule from '../config.js';

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
import Orders from './pages/orders/orders.jsx';
import Branches from './pages/branches/branches.jsx';
import EmployeeList from './pages/employee/employee-list.jsx';
import AddEmployee from './pages/employee/addemployee-list.jsx';
import EmployeeAssign from './pages/employee/employee-assign.jsx';
import EmployeeAttendance from './pages/employee/employee-attendance.jsx';
import EmployeeLeavePermission from './pages/employee/employee-leavepermission.jsx';
import AddProducts from './pages/products/AddProducts.jsx';
import Stocks from './pages/stocks/stock.jsx';

function App() {
  const location = useLocation();
  const authPaths = ['/', '/login', '/forgot-password', '/notfound'];
  const [menuItems, setMenuItems] = useState(false);
  const config = configModule.config();
  const { user } = useAuth();
  const usertype_id = user?.usertype_id;

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
  if (user?.usertype_id) {
    getSidebarList();
  }
}, [user?.usertype_id]);


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
    <>
      {authPaths.includes(location.pathname) ? (
        <AdminPage pathURL={location.pathname === '/' ? '/login' : location.pathname} />
      ) : (
        <div className='d-flex w-100 h-100'>
          <Sidebar menuItems={menuItems} />
          <div style={{ flex: 1, background: 'rgb(228 237 230 / 54%)',width: 'calc(100% - 245px)'}}>
            <div className='page-header-common justify-content-between'>
              <div className="animated-text-container">
                <h4 className="animated-text mb-0">{path}</h4>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className='notify-tb cursor-pointer'>
                  <SvgContent svg_name="Notification" />
                </div>
                <div className='notify-tb cursor-pointer' title={user && user.user_typecode === "AD" ? "Logout" : "Profile"}>
                  {user && user.user_typecode === "AD" ? (<SvgContent svg_name="logout_ad" />) : ((<SvgContent svg_name="Profile" />))}
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
              <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
              <Route path="/accounts" element={<PrivateRoute><Accounts /></PrivateRoute>} />
              <Route path="/orders" element={<PrivateRoute><Stocks /></PrivateRoute>} />
               {/* <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} /> */}
              <Route path="/clients" element={<PrivateRoute><Clients /></PrivateRoute>} />
              <Route path="/tracking" element={<PrivateRoute><Tracking /></PrivateRoute>} />
              <Route path="/user-profile" element={<PrivateRoute><UserProfile /></PrivateRoute>}/>

              {/*  Employee's sub-items */}
              <Route path="/employee/list" element={<PrivateRoute><EmployeeList /></PrivateRoute>} />
              <Route path="/employee/list/add-edit" element={<PrivateRoute><AddEmployee /></PrivateRoute>} />
              <Route path="/employee/assign" element={<PrivateRoute><EmployeeAssign /></PrivateRoute>} />
              <Route path="/employee/attendance" element={<PrivateRoute><EmployeeAttendance /></PrivateRoute>} />
              <Route path="/employee/leave-permissions" element={<PrivateRoute><EmployeeLeavePermission /></PrivateRoute>} />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
