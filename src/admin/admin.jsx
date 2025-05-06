import React from 'react';
import '../assets/styles/admin.css';
import main_logo from '../assets/images/main_logo.png';
import LoginPage from './login.jsx';
import ForgotPwd from './forgot-pwd.jsx';
import { ToastContainer } from 'react-toastify';

const AdminPage = ({ pathURL }) => {

    return (
        <div className="login-container-ad">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <div className="card p-4 login-div-main">
                <img src={main_logo} className="login-logo-sb" alt="Logo" />
                {(!pathURL || pathURL === "/login") && <LoginPage />}
                {(!pathURL || pathURL === "/forgot-password") && <ForgotPwd />}
            </div>
        </div>
    );
};

export default AdminPage;