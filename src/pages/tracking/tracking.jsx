import React, { useState, useEffect, useRef } from 'react';
import { PropagateLoader } from 'react-spinners';
import '../../assets/styles/tracking.css';
import { useAuth } from '../../components/context/Authcontext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import configModule from '../../../config.js';
import Pagination from "../../components/Pagination/index.jsx";
import SvgContent from '../../components/svgcontent.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Tracking() {
  const [trackingDetails, setTrackingDetails] = useState([]);
  const [trackingPend, setTrackingPend] = useState([]);
  const [needLoading, setNeedLoading] = useState(false);
  const { user } = useAuth();
  const config = configModule.config();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getOrderDetailsForTrack = async (objStatus = null) => {
    setNeedLoading(true);

    try {
      const response = await axios.post(`${config.apiBaseUrl}getOrderDetailsForTrack`, {
        startDate: startDate?.toISOString().split('T')[0] || '',
        endDate: endDate?.toISOString().split('T')[0] || '',
        filterData: objStatus || ''
      });

      const result = response.data;
      if (response.status === 200) {
        setTrackingDetails(result.data);
        setTrackingPend(result?.data?.length > 0 ? result.data.filter(itm => itm.status === "Pending") : []);
      } else {
        toast.error("Failed to fetch tracking details: " + result.message);
        console.error("Failed to fetch tracking details: " + result.message);
      }
    } catch (error) {
      toast.error(
        "Error fetching user acivity details: " +
        (error.response?.data?.message || error.message)
      );
    } finally {
      setNeedLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getOrderDetailsForTrack(null);
    }
  }, [user]);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const indexOfLastTracking = currentPage * itemsPerPage;
  const indexOfFirstTracking = indexOfLastTracking - itemsPerPage;
  const paginatedTracking = trackingDetails.slice(indexOfFirstTracking, indexOfLastTracking);

  const currentTracking = paginatedTracking.filter((item) =>
    `${item.attendance_id} ${item.order_id} ${item.lead_name} ${item.order_value} `
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSelect = (status) => {
    setShowDropdown(false);
    getOrderDetailsForTrack(status);
  };

  const options = ['Approved', 'Decline', 'Pending', 'Processing', 'Shipped', 'Delevered'];

  const formatDateTime = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid date";
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
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
      <div className='header-div-tr'>
        <div className='header-divpart-el'>
          <div className='d-flex gap-2'>
            <p className='mb-0 header-titlecount-el'>Total Order : {trackingDetails.length || 0}</p>
            <p className='mb-0 header-titlecount-el'>Pending Order : {trackingPend.length || 0}</p>
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
                  getOrderDetailsForTrack(null);
                }}
              >
                Apply Filter
              </button>
            </div>
          )}

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
      <div className='body-div-tr'>
        <div className='h-100 w-100 p-2 pb-0'>
          <div className='table-common-st'>
            <div className='tb-header-row-st display-flex' style={{ minWidth: "1112px" }}>
              <div className='brcommon-col-st w-10'>
                S no
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-15'>
                Order ID
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-15'>
                Name
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-10'>
                Order Value
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-10'>
                Date
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-10'>
                Status
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-20'>
                Tracking ID
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-10'>
                Action
              </div>
            </div>

            <div className='tb-body-row-st' style={{ minWidth: "1112px" }}>
              {currentTracking && currentTracking.length > 0 ? (currentTracking.map((item, index) => (
                <div className='display-flex br-rowst' key={item.order_id}>
                  <div className='brcommon-col-st w-10'>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </div>
                  <div className='brcommon-col-st w-15'>
                    {item.order_id}
                  </div>
                  <div className='brcommon-col-st w-15'>
                    {item.lead_name}
                  </div>
                  <div className='brcommon-col-st w-10'>
                    {item.order_value}
                  </div>
                  <div className='brcommon-col-st w-10'>
                    {formatDateTime(item.date_time)}
                  </div>
                  <div className='brcommon-col-st w-10'>
                    {item.status}
                  </div>
                  <div className='brcommon-col-st w-20'>
                    ''
                  </div>
                  <div className='brcommon-col-st w-10'>
                    <button className="" onClick={() => {
                      setSelectedOrder(item);
                      setShowOrderModal(true);
                    }}>
                      View
                    </button>
                  </div>
                </div>
              ))) : (
                <div className='tb-body-row-st display-flex'>
                  No tracking list
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
              count={trackingDetails.length}
              page={currentPage}
              pageSize={itemsPerPage}
              onChange={(pageNo) => setCurrentPage(pageNo)}
            />
          </div>
        </div>
      </div>
      {showOrderModal && selectedOrder && (
        <div className="tracking-modal-overlay">
          <div className="tracking-modal-content">
            <div className="tracking-modal-header">
              <h5>Tracking Summary</h5>
              <button onClick={() => setShowOrderModal(false)}>✖</button>
            </div>
            <div className="tracking-modal-body">
              <h6>Order Details</h6>
              <p><strong>Order ID:</strong> {selectedOrder.order_id}</p>
              <p><strong>Tracking Date:</strong> {formatDateTime(selectedOrder.date_time)}</p>

              <h6>Client Info</h6>
              <p><strong>Client ID:</strong> {selectedOrder.leads_id}</p>
              <p><strong>Name:</strong> {selectedOrder.lead_name}</p>
              <p><strong>Mobile:</strong> {selectedOrder.additional_number}</p>

              <h6>Delivery Info</h6>
              <p><strong>Address:</strong> {selectedOrder.address}</p>
              <p><strong>District:</strong> {selectedOrder.district}</p>
              <p><strong>State:</strong> {selectedOrder.state}</p>
              <p><strong>Courier:</strong> {selectedOrder.courier}</p>

              <h6>Payment Info</h6>
              <p><strong>Value:</strong> ₹{selectedOrder.order_value}</p>
              <p><strong>Discount:</strong> ₹{selectedOrder.discount}</p>
              <p><strong>Approved by:</strong> {selectedOrder.approved_by}</p>
              <p><strong>Courier charge:</strong> ₹{selectedOrder.wallet}</p>
              <p><strong>Total Value:</strong> ₹{selectedOrder.total_value}</p>

              <h6>Status</h6>
              <p><strong>Current Status:</strong> {selectedOrder.status}</p>
              <p><strong>Updated By:</strong> {selectedOrder.created_by}</p>
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

export default Tracking;
