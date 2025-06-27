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
  const [branchDataList, setBranchDataList] = useState([]);
  const [needLoading, setNeedLoading] = useState(false);
  const { user } = useAuth();
  const user_typecode = user?.user_typecode;
  const userId = user?.userId;
  const config = configModule.config();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const getBranchDetails = async () => {
    setNeedLoading(true);
    try {
      const response = await axios.post(`${config.apiBaseUrl}getBranchDetails`, {
        userId: userId,
        user_typecode: user_typecode
      });

      const result = response.data;
      if (response.status === 200) {
        setBranchDataList(result.data);
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
    if (user) {
      getBranchDetails();
    }
  }, [user]);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const indexOfLastBranch = currentPage * itemsPerPage;
  const indexOfFirstBranch = indexOfLastBranch - itemsPerPage;
  const paginatedBranches = branchDataList.slice(indexOfFirstBranch, indexOfLastBranch);

  const currentBranches = paginatedBranches.filter((item) =>
    `${item.branch_id} ${item.branch_name} ${item.branch_in_charge} ${item.location} ${item.phone_number}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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
          <p className='mb-0 header-titlecount-el'>Attendance Report : {currentBranches.length || 0}</p>
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
                }}
              >
                Apply Filter
              </button>
            </div>
          )}
          <button className="btn-top-up btn-bg-filled" >
            <SvgContent svg_name="btn_filter" stroke="white" width={20} height={20} />
            <span className='visible-label-up'>Filter</span>
          </button>
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
                Date
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
            </div>

            <div className='tb-body-row-st' style={{ minWidth: "1112px" }}>
              {currentBranches && currentBranches.length > 0 ? (currentBranches.map((item, index) => (
                <div className='display-flex br-rowst' key={item.branch_id}>
                  <div className='brcommon-col-st w-10'>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </div>
                  <div className='brcommon-col-st w-15'>
                    {item.branch_id}
                  </div>
                  <div className='brcommon-col-st w-15'>
                    {item.branch_name}
                  </div>
                  <div className='brcommon-col-st w-15'>
                    {item.branch_in_charge}
                  </div>
                  <div className='brcommon-col-st w-15'>
                    {item.phone_number}
                  </div>
                  <div className='brcommon-col-st w-20'>
                    {item.location}
                  </div>
                  <div
                    className="brcommon-col-st w-10 cursor-pointer position-relative">
                    <button onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBranch(item);
                    }} >
                      <SvgContent svg_name="threedots" />
                    </button>
                  </div>
                </div>
              ))) : (
                <div className='tb-body-row-st display-flex'>
                  No branch list
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
              count={branchDataList.length}
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
