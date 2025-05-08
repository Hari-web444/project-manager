import React, { useState, useEffect } from "react";
import '../../assets/styles/employee.css';
import CommonSelect from "../../components/common-select.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import configModule from '../../../config.js';

function EmployeeList() {
  const [showModal, setShowModal] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);
  const [addEmployeeModal, setAddEmployeeModal] = useState(false);
  const [role, setRole] = useState(null);
  const config = configModule.config();

  const getDesignationList = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}getDesignationList`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();
      if (response.ok) {
        setRoleOptions(result.data?.length > 0 ? result.data : []);
      } else {
        toast.error("Failed to fetch designation list: " + result.message);
      }
    } catch (error) {
      toast.error("Error fetching designation list: " + error.message);
      setRoleOptions([]);
    }
  };

  useEffect(() => {
    getDesignationList();
  }, []);

  const AddEmployeeDetails = () => {
    if (!role) {
      toast.error("You need to select designation.");
      return;
    }

    setAddEmployeeModal(true);
    setShowModal(false);
  };

  return (
    <div className='common-body-st'>
      <div className='header-div-el'>
        <div className='header-divpart-el'>
          <p className='mb-0 header-titlecount-el'>Total Employee : 0</p>
          <div className="d-flex align-items-center">
            <button onClick={() => { setAddEmployeeModal(false); setShowModal(false); }}>
              <p className='mb-0 nav-btn-top'>
                Employee &gt; List
              </p>
            </button> &nbsp;
            <button>
              <p className="mb-0 nav-btn-top">
                {addEmployeeModal ? ' > Add new' : ''}
              </p>
            </button>
          </div>
        </div>
        {!addEmployeeModal && (
          <div className="search-add-wrapper">
            <input
              type="text"
              placeholder="Search"
              className="search-input"
            />
            <button className="add-button" onClick={() => setShowModal(true)}>Add new</button>
          </div>
        )}
      </div>
      <div className='body-div-el'>
        {!addEmployeeModal ? (
          <div className="w-100 h-100 inner-body-st">
            No records found
          </div>
        ) : (
          <div className="w-100 h-100 inner-body-st">
            <div>
              A
            </div>
            <div>
              B
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h5 className="mb-0 add-new-hdr">Add new employee</h5>
              <button className="close-button" >×</button>
            </div>

            <div className="modal-body">
              <div className="container commonst-select">
                <CommonSelect
                  header="Select designation"
                  name="role"
                  value={role}
                  onChange={setRole}
                  options={roleOptions}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="next-button" onClick={AddEmployeeDetails} >Next</button>
            </div>
          </div>
        </div>
      )}

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

export default EmployeeList;
