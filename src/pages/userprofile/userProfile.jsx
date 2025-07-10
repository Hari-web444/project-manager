import React, { useEffect, useState } from 'react';
import '../../assets/styles/user-profile.css';
import { useAuth } from '../../components/context/Authcontext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import configModule from '../../../config.js';
import SvgContent from '../../components/svgcontent.jsx';
import Pagination from "../../components/Pagination/index.jsx";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import UploadModal from './upload-userprofile.jsx';
import { PropagateLoader } from 'react-spinners';

function UserProfile() {
  const { user } = useAuth();
  const [needLoading, setNeedLoading] = useState(false);
  const [leadDetails, setLeadDetails] = useState([]);
  const [categories, setCatagories] = useState([]);
  const [nILeadDetails, setNILeadDetails] = useState([]);
  const config = configModule.config();
  const [status, setStatus] = useState("active");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const isActive = status === "active";
  const [showDropdown, setShowDropdown] = useState(false);

  const getPageDetails = async (objStatus = '') => {
    setNeedLoading(true);
    try {
      const response = await axios.post(`${config.apiBaseUrl}getAllLeadDetails`, {
        fileredData: objStatus
      });
      
      const result = response.data;

      if (response.status === 200) {
        setLeadDetails(result?.leads?.length > 0 ? result.leads.filter(itm => itm.disposition !== "Not interested") : []);
        setNILeadDetails(result?.leads?.length > 0 ? result.leads.filter(itm => itm.disposition === "Not interested") : []);
        setCatagories(result?.categories);
      } else {
        toast.error("Failed to fetch designation list: " + result.message);
      }
    } catch (error) {
      setLeadDetails([]);
      toast.error("Error fetching designation list: " + (error.response?.data?.message || error.message));
    } finally {
      setNeedLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getPageDetails();
    }
  }, [user]);

  const formatDateTime = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid date";
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const allLeads = isActive ? leadDetails : nILeadDetails;

  const filteredLeads = allLeads.filter((item) => {
    const matchSearch = `${item.lead_id} ${item.lead_name} ${item.mobile_number} ${item.category} ${item.created_by} ${item.created_at} ${item.disposition} ${item.disposition_date}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const itemDate = new Date(item.created_at);
    const matchDate =
      (!startDate || itemDate >= new Date(startDate.setHours(0, 0, 0, 0))) &&
      (!endDate || itemDate <= new Date(endDate.setHours(23, 59, 59, 999)));

    return matchSearch && matchDate;
  });

  const indexOfLastLeads = currentPage * itemsPerPage;
  const indexOfFirstLeads = indexOfLastLeads - itemsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLeads, indexOfLastLeads);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSelect = (status) => {
    setShowDropdown(false);
    getPageDetails(status);
  };

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
        <div className='header-divpart-el gap-2'>
          <p className='mb-0 header-titlecount-el'>Total user profiles : 1050</p>
          <div className="status-toggle-up">
            <label htmlFor="status-active" className="custom-radio">
              <input
                type="radio"
                name="status"
                id="status-active"
                value="active"
                checked={status === "active"}
                onChange={(e) => setStatus(e.target.value)}
              />
              <span className="radio-button"></span> Active
            </label>

            <label htmlFor="status-inactive" className="custom-radio">
              <input
                type="radio"
                name="status"
                id="status-inactive"
                value="inactive"
                checked={status === "inactive"}
                onChange={(e) => setStatus(e.target.value)}
              />
              <span className="radio-button"></span> In-active
            </label>
          </div>
        </div>

        <div className="search-add-wrapper">
          <input
            type="text"
            placeholder="Search"
            className="search-input-up"
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
          <div className="filter-container-up">
            <button className="btn-top-up" onClick={toggleDropdown}>
              <SvgContent svg_name="btn_filter" width={20} height={20} />
              <span className="visible-label-up">Filter</span>
            </button>

            {showDropdown && (
              <div className="dropdown-up">
                <div className="dropdown-header-up">Filter</div>
                <ul className="dropdown-list-up">
                  {categories.map((option) => (
                    <li key={option.category_id} onClick={() => handleSelect(option.category_name)} className="dropdown-item-up">
                      {option.category_name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button className="btn-top-up" onClick={() => setShowUploadModal(true)} >
            <SvgContent svg_name="btn_upload" width={20} height={20} />
            <span className='visible-label-up'>Upload</span>
          </button>

          <UploadModal
            show={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            onUpload={(file) => {
              console.log("Uploading file:", file);
              setShowUploadModal(false);
            }}
          />

        </div>
      </div>

      <div className='phone-header-div-el'>
        <div className='d-flex justify-content-between align-items-center mb-2'>
          <p className='mb-0 header-titlecount-el'>Total user profiles : 1050</p>
          <div className='d-flex gap-2'>
            <button className="btn-top-up"><SvgContent svg_name="btn_calendar" width={20} height={20} /></button>
            <button className="btn-top-up"><SvgContent svg_name="btn_filter" width={20} height={20} /></button>
            <button className="btn-top-up"><SvgContent svg_name="btn_upload" width={20} height={20} /></button>
          </div>
        </div>

        <div className="search-add-wrapper justify-content-between mb-3">
          <div className="status-toggle-up">
            <label htmlFor="status-active-mobile" className="custom-radio">
              <input
                type="radio"
                name="mbstatus"
                id="status-active-mobile"
                value="active"
                checked={status === "active"}
                onChange={(e) => setStatus(e.target.value)}
              />
              <span className="radio-button"></span> Active : 920
            </label>

            <label htmlFor="status-inactive-mobile" className="custom-radio">
              <input
                type="radio"
                name="mbstatus"
                id="status-inactive-mobile"
                value="inactive"
                checked={status === "inactive"}
                onChange={(e) => setStatus(e.target.value)}
              />
              <span className="radio-button"></span> In-active : 130
            </label>
          </div>
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className='body-div-el'>
        <div className='w-100 p-2 d-flex justify-content-center align-items-center' style={{ height: "calc(100% - 48px)" }}>
          {currentLeads.length > 0 ? (
            <div className='table-userpro-up w-100 h-100 overflow-auto'>
              <div className='table-head-up d-flex'>
                <div className='w-10 p-2 d-flex justify-content-center align-items-center'>S.No</div><span style={{ color: "#129347" }}> | </span>
                <div className='w-10 p-2 d-flex justify-content-center align-items-center'>Cus ID</div><span style={{ color: "#129347" }}> | </span>
                <div className='w-14 p-2 d-flex justify-content-center align-items-center'>Name</div><span style={{ color: "#129347" }}> | </span>
                <div className='w-12 p-2 d-flex justify-content-center align-items-center'>Mobile</div><span style={{ color: "#129347" }}> | </span>
                <div className='w-12 p-2 d-flex justify-content-center align-items-center'>Category</div><span style={{ color: "#129347" }}> | </span>
                <div className='w-10 p-2 d-flex justify-content-center align-items-center'>Date</div><span style={{ color: "#129347" }}> | </span>
                <div className='w-10 p-2 d-flex justify-content-center align-items-center'>Handle by</div><span style={{ color: "#129347" }}> | </span>
                <div className='w-12 p-2 d-flex justify-content-center align-items-center'>Disposition</div><span style={{ color: "#129347" }}> | </span>
                <div className='w-10 p-2 d-flex justify-content-center align-items-center'>Entry Date</div>
              </div>
              <div className='table-body-up d-flex'>
                {currentLeads.map((lead, index) => (
                  <div className='table-bodydiv-up' key={lead.lead_recid || index}>
                    <div className='w-10 p-2 d-flex justify-content-center align-items-center'>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </div>
                    <div className='w-10 p-2 d-flex justify-content-center align-items-center'>
                      {lead.lead_id}
                    </div>
                    <div className='w-14 p-2 d-flex justify-content-center align-items-center'>
                      {lead.lead_name}
                    </div>
                    <div className='w-12 p-2 d-flex justify-content-center align-items-center'>
                      {lead.mobile_number}
                    </div>
                    <div className='w-12 p-2 d-flex justify-content-center align-items-center'>
                      {lead.category}
                    </div>
                    <div className='w-10 p-2 d-flex justify-content-center align-items-center'>
                      {formatDateTime(lead.created_at)}
                    </div>
                    <div className='w-10 p-2 d-flex justify-content-center align-items-center'>
                      {lead.created_by}
                    </div>
                    <div className='w-12 p-2 d-flex justify-content-center align-items-center'>
                      {lead.disposition}
                    </div>
                    <div className='w-10 p-2 d-flex justify-content-center align-items-center'>
                      {formatDateTime(lead.disposition_date)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>No data found</div>
          )}
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
            count={filteredLeads.length}
            page={currentPage}
            pageSize={itemsPerPage}
            onChange={(pageNo) => setCurrentPage(pageNo)}
          />
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

export default UserProfile;
