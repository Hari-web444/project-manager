import React, { useState } from 'react';
import '../assets/styles/onboard.css';
import SvgContent from '../components/svgcontent';
import admin from '../assets/images/Admin.png';
import viewer from '../assets/images/viewer.png';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/home.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import configModule from '../../config.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function OnboardControll() {
  const [userType, setUserType] = useState('');
  const [loginData, setLoginData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const config = configModule.config();

  const handleBack = () => setUserType('');

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (!username || !password) {
      toast.error("All fields required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password , userType }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        setLoginData(result.token);
        localStorage.setItem("authToken", result.token);
        console.log(loginData);
        setTimeout(() => {
          navigate('/project-management');
          setUsername('');
          setPassword('');
        }, 3000);
      } else {
        toast.error(result.message || "Login error");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className='h-100 w-100 main-luser-st display-flex'>
      {userType === '' ? (
        <div className='inner-luser-st'>
          <div className='w-50 view-st'>
            <img src={viewer} className='w-100' alt='viewer' />
            <h5 className='view-font-st' onClick={() => setUserType("Viewer")}>
              Viewer
              <SvgContent svg_name="right_arrow" />
            </h5>
          </div>
          <div className='w-50 view-st'>
            <img src={admin} className='w-100' alt='admin' />
            <h5 className='view-font-st' onClick={() => setUserType("Admin")}>
              Admin
              <SvgContent svg_name="right_arrow" />
            </h5>
          </div>
        </div>
      ) : (
        <div className='login-form-container display-flex flex-column'>
          <h4 className='fw-bold' style={{ color: "#fff", textShadow: "1px 3px 0px #4000b2" }}>{userType} Login</h4>
          <form className='login-form w-100 display-flex mt-4 flex-column gap-4'>
            <input type='text' placeholder='Username' value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username" />

            <div className='pwd-wd-st position-relative'>
              <input type={showPassword ? 'text' : 'password'} placeholder='Password' className='pwd-input-st' value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password" />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className='eys-st'
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>


            <div className="foot-form-st justify-content-end display-flex">
              <button type='button' className='back-btn-st' onClick={handleBack}>Back</button>
              <button type='submit' className='login-btn-st' disabled={loading}
                onClick={handleLogin}>
                {loading ? <span className="button-animate">Logging in...</span> : "Login"}
              </button>
            </div>
          </form>
        </div>
      )}

    {/*   <ToastContainer
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
      /> */}
    </div>
  );
}

export default OnboardControll;
