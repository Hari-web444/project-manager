import React, { useState, useEffect, useRef } from 'react';
import { PropagateLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import configModule from '../../config.js';
import SvgContent from '../components/svgcontent.jsx';
import AddEmployeeModal from './AddEmployeeModal';
import { jwtDecode } from 'jwt-decode';

function ProjectManager() {
  const [currentDataList, setCurrentDataList] = useState([]);
  const [needLoading, setNeedLoading] = useState(false);
  const config = configModule.config();
  const [showModal, setShowModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [decodedToken, setDecodedToken] = useState(null);
  const [selectedItems, setSelectedItems] = useState('');
  const [deleteConfirmPopup, setDeleteConfirmPopup] = useState(false);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleOpen = () => {
    setSelectedEmployee(null);
    setShowModal(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    getEmployeeList();
  }

  const getEmployeeList = async () => {
    setNeedLoading(true);
    try {
      const response = await axios.get(`${config.apiBaseUrl}getEmployeeData`);

      const result = response.data;
      if (response.status === 200) {
        setCurrentDataList(result.data);
      } else {
        toast.error("Failed to fetch branch details: " + result.message);
        console.error("Failed to fetch branch details: " + result.message);
      }
    } catch (error) {
      toast.error(
        "Error fetching branch details: " +
        (error.response?.data?.message || error.message)
      );
    } finally {
      setNeedLoading(false);
    }
  };

  useEffect(() => {
    getEmployeeList();
  }, []);

  const filteredDataList = currentDataList.filter((employee) => {
    const matchesDepartment = departmentFilter ? employee.department === departmentFilter : true;
    const matchesSearch = searchTerm
      ? employee.emp_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesDepartment && matchesSearch;
  });


  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded.username);  // Store in state
        console.log('Decoded Token:', decoded); // Optional: log it
      } catch (err) {
        console.error('Invalid token:', err);
        toast.error('Invalid auth token');
      }
    }
  }, []);

  const handleDelete = (item) => {
    setSelectedItems(item);
    setDeleteConfirmPopup(true);
  };

  const handleDeleteToConfirm = async (e) => {
    e.preventDefault();

    try {
        const url = `${config.apiBaseUrl}deleteEmployee`;
      
      const response = await axios.post(url, {
        emp_id: selectedItems.emp_id,
        emp_name: selectedItems.emp_name
      });

      if (response.status === 200) {
        toast.success(`Employee deleted successfully!`);
        
        setTimeout(() => setDeleteConfirmPopup(false), 2000);
        getEmployeeList();
      } else {
        toast.error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Employee delete error:', error);
      toast.error(
        error?.response?.data?.message || 'Server error while processing request'
      );
    }
  };

  return (
    <div className='common-body-st'>
      {needLoading && (
        <div className='loading-container w-100 h-100'>
          <PropagateLoader
            height="100"
            width="100"
            color="#6639ba"
            radius="10"
          />
        </div>
      )}
      <div className='header-div-el'>
        <div className='position-relative'>
          <input
            type="text"
            placeholder="Search"
            className="search-input-st"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SvgContent svg_name="search" width={24} height={24} className="search-svg-st" />
        </div>

        <div className='d-flex gap-2 align-items-center'>
          <select
            className="filter-select-st mb-0"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {[...new Set(currentDataList.map(emp => emp.department))].map(dep => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
          {decodedToken === "Admin" && (<button className="add-button-st" style={{ minWidth: "120px" }} onClick={handleOpen}>Add new</button>)}
        </div>
      </div>
      <div className='body-div-el'>
        <div className='h-100 w-100 p-2 pb-0'>
          <div className="table-common-st">
            <div className="tb-header-row-st display-flex">
              <div className={`brcommon-col-st display-flex ${decodedToken === 'employee' ? 'w-10' : 'w-8'}`}>S no</div>
              <span style={{ color: "rgb(144 82 255)" }}>|</span>

              <div className={`brcommon-col-st display-flex ${decodedToken === 'employee' ? 'w-10' : 'w-8'}`}>Emp ID</div>
              <span style={{ color: "rgb(144 82 255)" }}>|</span>

              <div className={`brcommon-col-st display-flex ${decodedToken === 'employee' ? 'w-20' : 'w-15'}`}>Emp name</div>
              <span style={{ color: "rgb(144 82 255)" }}>|</span>

              <div className={`brcommon-col-st display-flex ${decodedToken === 'employee' ? 'w-20' : 'w-15'}`}>Department</div>
              <span style={{ color: "rgb(144 82 255)" }}>|</span>

              <div className="brcommon-col-st display-flex w-25">Email</div>
              <span style={{ color: "rgb(144 82 255)" }}>|</span>

              <div className={`brcommon-col-st display-flex ${decodedToken === 'employee' ? 'w-20' : 'w-15'}`}>Phone</div>
              {decodedToken === "Admin" && (
                <>
                  <span style={{ color: "rgb(144 82 255)" }}>|</span>
                  <div className="brcommon-col-st display-flex w-14">Action</div>
                </>
              )}
            </div>

            <div className="tb-body-row-st">
              {filteredDataList.length > 0 ? (
                filteredDataList.map((item, index) => (
                  <div className="display-flex br-rowst" key={item.emp_id}>
                    <div className={`brcommon-col-st display-flex ${decodedToken === 'employee' ? 'w-10' : 'w-8'}`}>
                      {index + 1}
                    </div>

                    <div className={`brcommon-col-st display-flex ${decodedToken === 'employee' ? 'w-10' : 'w-8'}`}>
                      {item.emp_id}
                    </div>

                    <div className={`brcommon-col-st display-flex ${decodedToken === 'employee' ? 'w-20' : 'w-15'}`}>
                      {item.emp_name}
                    </div>

                    <div className={`brcommon-col-st display-flex ${decodedToken === 'employee' ? 'w-20' : 'w-15'}`}>
                      {item.department}
                    </div>

                    <div className="brcommon-col-st display-flex w-25">
                      {item.email}
                    </div>

                    <div className={`brcommon-col-st display-flex ${decodedToken === 'employee' ? 'w-20' : 'w-15'}`}>
                      {item.phone}
                    </div>

                    {decodedToken === "Admin" && (
                      <div className="brcommon-col-st gap-2 display-flex w-14 position-relative">
                        <div className="three-dot-btn" onClick={() => handleEdit(item)}>
                          <SvgContent svg_name="edit" width={24} height={24} />
                        </div>
                        <div className="three-dot-btn" onClick={() => handleDelete(item)}>
                          <SvgContent svg_name="delete" width={24} height={24} />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="w-100 h-100 overflow-auto display-flex">
                  No employee list
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <AddEmployeeModal
          onClose={handleClose}
          initialData={selectedEmployee}
          onSuccess={getEmployeeList}
        />
      )}

      {deleteConfirmPopup && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h4 className='mb-3'>Delete employee</h4>
            <p>Are you sure to delete</p>

            <div className='foot-empst mt-3'>
              <button type="button" className='cancel-st-emp' onClick={()=> setDeleteConfirmPopup(false)}>Cancel</button>
              <button type="submit" onClick={handleDeleteToConfirm}>Delete</button>
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

export default ProjectManager;
