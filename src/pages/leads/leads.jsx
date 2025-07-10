import React, { useState, useEffect } from 'react';
import '../../assets/styles/leads.css';
import { useAuth } from '../../components/context/Authcontext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import configModule from '../../../config.js';
import { PropagateLoader } from 'react-spinners';

function Leads() {
  const { user } = useAuth();
  const userId = user?.userId;
  const [searchNumber, setSearchNumber] = useState("");
  const [needLoading, setNeedLoading] = useState(false);
  const config = configModule.config();

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setSearchNumber(value);
    }
  };

  const getLeadsPage = async () => {
    setNeedLoading(true);
    try {
      const response = await axios.post(`${config.apiBaseUrl}getAllLeadsDataForCl`, {
        userId: userId
      });

      const result = response.data;

      if (response.status === 200) {
        console.log("success");
      } else {
        toast.error("Failed to fetch designation list: " + result.message);
      }
    } catch (error) {
      toast.error("Error fetching designation list: " + (error.response?.data?.message || error.message));
    } finally {
      setNeedLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getLeadsPage();
    }
  }, [user]);

  return (
    <div className='common-body-st'>
      {needLoading && (
        <div className='loading-container w-100 h-100'>
          <PropagateLoader
            height="100"
            width="100"
            color="#0B9346"
            radius="10"
          />
        </div>
      )}
      <div className='w-100 h-100 p-3'>
        <div className="mobile-search-container d-flex shadow-sm rounded ">
          <div className='mobilename-label-st'>
            <h5 className="mb-2">Enter mobile number</h5>
            <p className="text-muted mb-0 small">(To check existing entries)</p>
          </div>
          <div className="d-flex align-items-center gap-3 " style={{ width: "calc(100% - 272px)" }}>
            <input
              type="text"
              className="form-control-st mobile-input"
              placeholder="Enter mobile number"
              value={searchNumber}
              onChange={handleChange}
            />
            <div className='d-flex gap-2 align-items-center mobilebtn-label-st '>
              <button className="search-btn-lead">Search</button>
              <button className="search-btn-lead">
                Create Profile
              </button>
            </div>
          </div>
        </div>
        <div className='body-containerlead-st'>
          No items found
        </div>
      </div>
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
    </div>
  );
}

export default Leads;
