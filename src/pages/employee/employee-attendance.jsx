import React, { useState, useEffect, useRef } from 'react';
import { PropagateLoader } from 'react-spinners';
import '../../assets/styles/branches.css';
import { useAuth } from '../../components/context/Authcontext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import configModule from '../../../config.js';
import Pagination from "../../components/Pagination/index.jsx";
import SvgContent from '../../components/svgcontent.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function EmployeeAttendance() {
  const [userAttendanceDataList, setUserAttendanceDataList] = useState([]);
  const [needLoading, setNeedLoading] = useState(false);
  const { user } = useAuth();
  const user_typecode = user?.user_typecode;
  const config = configModule.config();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterData, setFilterData] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const getUserAttendanceData = async (objStatus = '') => {
    setNeedLoading(true);

    try {
      const response = await axios.post(`${config.apiBaseUrl}getUserAttendanceData`, {
        user_typecode: user_typecode || "",
        startDate: startDate?.toISOString().split('T')[0] || '',
        endDate: endDate?.toISOString().split('T')[0] || '',
        filterData: objStatus || ''
      });

      const result = response.data;
      if (response.status === 200) {
        setUserAttendanceDataList(result.data);
      } else {
        toast.error("Failed to fetch userAttendance details: " + result.message);
        console.error("Failed to fetch userAttendance details: " + result.message);
      }
    } catch (error) {
      toast.error(
        "Error fetching attendance details: " +
        (error.response?.data?.message || error.message)
      );
    } finally {
      setNeedLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getUserAttendanceData();
    }
  }, [user]);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const indexOfLastUserAttendance = currentPage * itemsPerPage;
  const indexOfFirstUserAttendance = indexOfLastUserAttendance - itemsPerPage;
  const paginatedUserAttendancees = userAttendanceDataList.slice(indexOfFirstUserAttendance, indexOfLastUserAttendance);

  const currentUserAttendancees = paginatedUserAttendancees.filter((item) =>
    `${item.attendance_id} ${item.emp_id} ${item.emp_name} ${item.designation} ${item.work_type} ${item.status}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSelect = (status) => {
    setFilterData(status);
    setShowDropdown(false);
    getUserAttendanceData(status);
  };

  const options = ['Present', 'Late', 'Leave', 'Permission', 'Absent'];


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
      <div className='header-div-el'>
        <div className='header-divpart-el'>
          <p className='mb-0 header-titlecount-el'>Attendance Report : {currentUserAttendancees.length || 0}</p>
          <div className="d-flex align-items-center">
            <button>
              <p className='mb-0 nav-btn-top'>
                Employee &gt; Attendance
              </p>
            </button>
          </div>
        </div>
        <div className="search-add-wrapper">
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            style={{ padding: "5px 12px" }}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn-top-up" onClick={() => setShowDateFilter(!showDateFilter)} >
            <SvgContent svg_name="btn_calendar" width={20} height={20} />
            <span className='visible-label-up'>Sort</span>
          </button>
          {showDateFilter && (
            <div className="date-filter-popup">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Start Date"
                className="form-control form-btncontrol-up mb-2"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="End Date"
                className="form-control form-btncontrol-up mb-3"
              />
              <button
                className="btn btn-sm btn-primary w-100 apply-filter-st"
                onClick={() => {
                  setCurrentPage(1);
                  setShowDateFilter(false);
                  getUserAttendanceData();
                }}
              >
                Apply Filter
              </button>
            </div>
          )}
          {/* <button className="btn-top-up btn-bg-filled" >
            <SvgContent svg_name="btn_filter" stroke="white" width={20} height={20} />
            <span className='visible-label-up'>Filter</span>
          </button> */}

          <div className="filter-container-up">
            <button className="btn-top-up btn-bg-filled" onClick={toggleDropdown}>
              <SvgContent svg_name="btn_filter" stroke="white" width={20} height={20} />
              <span className="visible-label-up">Filter</span>
            </button>

            {showDropdown && (
              <div className="dropdown-up">
                <div className="dropdown-header-up">Filter</div>
                <ul className="dropdown-list-up">
                  {options.map((option) => (
                    <li key={option} onClick={() => handleSelect(option)} className="dropdown-item-up">
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='body-div-el'>
        <div className='h-100 w-100 p-2 pb-0'>
          <div className='table-common-st'>
            <div className='tb-header-row-st display-flex' style={{ minWidth: "1112px" }}>
              <div className='brcommon-col-st w-10'>
                S no
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-10'>
                Emp ID
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-15'>
                Emp name
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-15'>
                Designation
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-10'>
                Duration
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-10'>
                Work type
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-10'>
                Login
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-10'>
                Logoff
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-10'>
                Status
              </div> <span style={{ color: "#129347" }}> | </span>
            </div>

            <div className='tb-body-row-st' style={{ minWidth: "1112px" }}>
              {currentUserAttendancees && currentUserAttendancees.length > 0 ? (currentUserAttendancees.map((item, index) => (
                <div className='display-flex br-rowst' key={item.attendance_id}>
                  <div className='brcommon-col-st w-10'>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </div>
                  <div className='brcommon-col-st w-10'>
                    {item.emp_id}
                  </div>
                  <div className='brcommon-col-st w-15'>
                    {item.emp_name}
                  </div>
                  <div className='brcommon-col-st w-15'>
                    {item.designation}
                  </div>
                  <div className='brcommon-col-st w-10'>
                    {item.duration}
                  </div>
                  <div className='brcommon-col-st w-10'>
                    {item.work_type}
                  </div>
                  <div className='brcommon-col-st w-10'>
                    {item.login_time}
                  </div>
                  <div className='brcommon-col-st w-10'>
                    {item.logoff_time}
                  </div>
                  <div className='brcommon-col-st w-10'>
                    {item.status}
                  </div>
                </div>
              ))) : (
                <div className='tb-body-row-st display-flex'>
                  No Attendance list
                </div>
              )}

            </div>
          </div>
          <div className='footer-tab-st'>
            <label htmlFor="hfg" className="me-2">
              Results per page{" "}
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="row-per-page-select"
                style={{ width: "60px" }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </label>
            <Pagination
              count={userAttendanceDataList.length}
              page={currentPage}
              pageSize={itemsPerPage}
              onChange={(pageNo) => setCurrentPage(pageNo)}
            />
          </div>
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

export default EmployeeAttendance;
