import React, { useEffect, useState, useRef } from 'react';
import '../../assets/styles/user-profile.css';
import { useAuth } from '../../components/context/Authcontext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import configModule from '../../../config.js';
import SvgContent from '../../components/svgcontent.jsx';
import Pagination from "../../components/Pagination/index.jsx";
import 'react-datepicker/dist/react-datepicker.css';
import { PropagateLoader } from 'react-spinners';
import viewicon from '../../assets/images/viewicon.svg';
import printer from '../../assets/images/printer.svg';
import OrderDetailModal from './order-modal.jsx';
import '../../assets/styles/orders.css';

function Orders() {
  const { user } = useAuth();
  const printRef = useRef();
  const [needLoading, setNeedLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [nILeadDetails, setNILeadDetails] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const config = configModule.config();
  const [status, setStatus] = useState("active");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHistoryClicked, setIsHistoryClicked] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const isActive = status === "active";
  const [showDropdown, setShowDropdown] = useState(false);

  const categories = ["Pending", "Approved"];

  const getOrderDetails = async () => {
    setNeedLoading(true);

    try {
      const response = await axios.get(`${config.apiBaseUrl}getOrderDetails`);

      const result = response.data;

      if (response.status === 200) {
        setOrderDetails(result?.data?.length > 0 ? result.data.filter(itm => itm.status === "Pending") : []);
        setNILeadDetails(result?.shopes || []);
      } else {
        toast.error("Failed to fetch designation list: " + result.message);
      }
    } catch (error) {
      setOrderDetails([]);
      toast.error("Error fetching designation list: " + (error.response?.data?.message || error.message));
    } finally {
      setNeedLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getOrderDetails();
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

  const filteredLeads = orderDetails.filter((item) => {
    const matchSearch = `${item.order_id} ${item.order_name} ${item.order_qty} ${item.order_value} ${item.order_date} ${item.order_type} ${item.status} `
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
    getOrderDetails(status);
  };

  const handlePrint = (order) => {
    setSelectedOrder(order); // set for the print component to update

    setTimeout(() => {
      const printContents = printRef.current?.innerHTML;
      if (!printContents) return;

      const printWindow = window.open('', '', 'width=900,height=700');
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Order</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h4 { margin-bottom: 8px; border-bottom: 1px solid #ccc; }
              p { margin: 4px 0; }
              img { max-width: 100%; border: 1px solid #ccc; margin-top: 10px; }
            </style>
          </head>
          <body>
            ${printContents}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 300);
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
          <div className='d-flex align-items-center gap-2 flex-wrap'>
            <p className='mb-0 header-titlecount-el'>Total orders : 1050</p>
            <p className='mb-0 header-titlecount-el'>Pending approvals : 15 </p>
          </div>
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
              <span className="radio-button"></span> Persons
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
              <span className="radio-button"></span> Shops
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
        
          <button className="btn-top-up" >
            <SvgContent svg_name="history" width={20} height={20} />
            <span className='visible-label-up'>History</span>
          </button>

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
                <div className='w-10 p-2 d-flex text-center justify-content-center align-items-center'>S.No</div><span style={{ color: "#129347" }}> | </span>
                <div className='w-10 p-2 d-flex text-center justify-content-center align-items-center'>Order ID</div><span style={{ color: "#129347" }}> | </span>
                <div className='w-14 p-2 d-flex text-center justify-content-center align-items-center'>Order Name</div><span style={{ color: "#129347" }}> | </span>
                <div className='w-12 p-2 d-flex text-center justify-content-center align-items-center'>Quantity</div><span style={{ color: "#129347" }}> | </span>
                <div className='w-12 p-2 d-flex text-center justify-content-center align-items-center'>Value</div><span style={{ color: "#129347" }}> | </span>
                <div className='w-10 p-2 d-flex text-center justify-content-center align-items-center'>Date</div><span style={{ color: "#129347" }}> | </span>
                <div className='w-10 p-2 d-flex text-center justify-content-center align-items-center'>Type</div><span style={{ color: "#129347" }}> | </span>
                <div className='w-12 p-2 d-flex text-center justify-content-center align-items-center'>Status</div><span style={{ color: "#129347" }}> | </span>
                <div className='w-10 p-2 d-flex text-center justify-content-center align-items-center'>Action</div>
              </div>
              <div className='table-body-up d-flex'>
                {currentLeads.map((item, index) => (
                  <div className='table-bodydiv-up' key={item.order_recid || index}>
                    <div className='w-10 p-2 d-flex text-center  justify-content-center align-items-center'>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </div>
                    <div className='w-10 p-2 d-flex text-center  justify-content-center align-items-center'>
                      {item.order_id}
                    </div>
                    <div className='w-14 p-2 d-flex text-center  justify-content-center align-items-center'>
                      {item.order_name}
                    </div>
                    <div className='w-12 p-2 d-flex justify-content-center align-items-center'>
                      {item.quantity}
                    </div>
                    <div className='w-12 p-2 d-flex justify-content-center align-items-center'>
                      {item.order_value}
                    </div>
                    <div className='w-10 p-2 d-flex justify-content-center align-items-center'>
                      {formatDateTime(item.order_date)}
                    </div>
                    <div className='w-10 p-2 d-flex justify-content-center align-items-center'>
                      {item.order_type}
                    </div>
                    <div className='w-12 p-2 d-flex justify-content-center align-items-center'>
                      {item.status}
                    </div>
                    <div className='w-10 p-2 d-flex justify-content-center align-items-center gap-3'>
                      <button
                        onClick={() => {
                          setSelectedOrder(item);
                          setIsHistoryClicked(true);
                        }}
                        className="icon-button"
                        aria-label="View Order"
                      >
                        <img src={viewicon} alt="view" />
                      </button>

                      <button
                        onClick={() => handlePrint(item)}
                        className="icon-button"
                        aria-label="Print Order"
                      >
                        <img src={printer} alt="printer" />
                      </button>

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

      {isHistoryClicked && selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setIsHistoryClicked(false)} type="view" />
      )}

      <div style={{ display: 'none' }}>
        <div ref={printRef}>
          <OrderDetailModal order={selectedOrder} onClose={() => { }} type="print" />
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

export default Orders;
