
import  { useState, useEffect,  } from 'react';
import './App.css';
import { Routes, Route, Navigate,  } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "react-datepicker/dist/react-datepicker.css";
import PrivateRoute from './components/auth/PrivateRoute.jsx';
import { useAuth } from './components/context/Authcontext.jsx';
import configModule from '../config.js';
import AdminPage from './admin/admin.jsx';
import MainLayout from './mainlayout.jsx';
import Dashboard from './pages/dashboard/dashboard.jsx';
import Leads from './pages/leads/leads.jsx';
import TodoList from './pages/todo/todo-list.jsx';
import Products from './pages/products/products.jsx';
import Clients from './pages/clientslist/clients.jsx';
import Tracking from './pages/tracking/tracking.jsx';
import Profile from './pages/profile/profile.jsx';
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
import NotFound from './components/notfoun.jsx';
import Logoutmodal from './components/logoutmodal.jsx';
import UserProfile from './pages/userprofile/userProfile.jsx';
import Orders from './pages/orders/orders.jsx';
import Orderlist from './pages/orders/order-list.jsx';
import Directory from './pages/directory/directory.jsx';
import PurchasePage from './pages/purchases/purchase.jsx';
import CalendarWithHolidayMarker from './pages/calendar/calendar.jsx';
import CreativeService from './pages/creative-services/creative-services.jsx';
import Credits from './pages/credits/credits.jsx';
import Payroll from './pages/payroll/payroll.jsx';
import RandD from './pages/randd/randd.jsx';
import AddToCart from './pages/leads/addtocart.jsx';

function App() {

  const [menuItems, setMenuItems] = useState(false);
  const [isShowAlertpopup, setIsShowAlertpopup] = useState(false);
  const config = configModule.config();
  const { user } = useAuth();
  const usertype_id = user?.usertype_id;

  const getSidebarList = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}GetSidebarList`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const formatSidebarMenu = (mainList, subList) => {
    return mainList.map(main => {
      const subMenuItems = subList
        .filter(sub => sub.menu_id === main.menu_id)
        .map(sub => ({ path: sub.path, name: sub.name }));

      const menuItem = {
        path: main.path,
        name: main.name,
        icon: main.icon,
        ...(main.exact === 1 && { exact: true }),
        ...(subMenuItems.length > 0 && { subMenu: subMenuItems })
      };
      return menuItem;
    });
  };

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AdminPage pathURL="/login" />} />
        <Route path="/login" element={<AdminPage pathURL="/login" />} />
        <Route path="/forgot-password" element={<AdminPage pathURL="/forgot-password" />} />

        {/* Protected Routes with Sidebar */}
        <Route element={<MainLayout menuItems={menuItems} />}>
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/leads" element={<PrivateRoute><Leads /></PrivateRoute>} />
          <Route path="/todo" element={<PrivateRoute><TodoList /></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
          <Route path="/employee" element={<Navigate to="/employee/list" replace />} />
          <Route path="/products/add" element={<PrivateRoute><AddProducts /></PrivateRoute>} />
          <Route path="/clients" element={<PrivateRoute><Clients /></PrivateRoute>} />
          <Route path="/tracking" element={<PrivateRoute><Tracking /></PrivateRoute>} />
          <Route path="/user-profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
          <Route path="/accounts" element={<PrivateRoute><Accounts /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><Orders/></PrivateRoute>} />
          <Route path="/directory" element={<PrivateRoute><Directory/></PrivateRoute>} />
          <Route path="/purchase" element={<PrivateRoute><PurchasePage/></PrivateRoute>} />
          <Route path="/orders-list" element={<PrivateRoute><Orderlist/></PrivateRoute>} />
          <Route path="/stocks" element={<PrivateRoute><Stocks /></PrivateRoute>} />
          <Route path="/branches" element={<PrivateRoute><Branches /></PrivateRoute>} />
          <Route path="/branches/view" element={<PrivateRoute><ViewBranch /></PrivateRoute>} />
          <Route path="/employee/list" element={<PrivateRoute><EmployeeList /></PrivateRoute>} />
          <Route path="/employee/list/add-edit" element={<PrivateRoute><AddEmployee /></PrivateRoute>} />
          <Route path="/employee/assign" element={<PrivateRoute><EmployeeAssign /></PrivateRoute>} />
          <Route path="/employee/attendance" element={<PrivateRoute><EmployeeAttendance /></PrivateRoute>} />
          <Route path="/employee/leave-permissions" element={<PrivateRoute><EmployeeLeavePermission /></PrivateRoute>} />
          <Route path="/calendar" element={<PrivateRoute><CalendarWithHolidayMarker /></PrivateRoute>} />
          <Route path="/creative-service" element={<PrivateRoute><CreativeService /></PrivateRoute>} />
          <Route path="/credits" element={<PrivateRoute><Credits /></PrivateRoute>} />
          <Route path="/payroll" element={<PrivateRoute><Payroll /></PrivateRoute>} />
          <Route path="/randd" element={<PrivateRoute><RandD /></PrivateRoute>} />
          <Route path="/lead/add-to-card" element={<PrivateRoute><AddToCart /></PrivateRoute>} />
        </Route>

        {/* 404 fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Logout modal */}
      {isShowAlertpopup && (
        <Logoutmodal oncloses={() => setIsShowAlertpopup(false)} />
      )}
    </>
  );
}

export default App;
