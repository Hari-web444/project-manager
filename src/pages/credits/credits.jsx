import React, { useEffect, useState } from 'react';
import '../../assets/styles/user-profile.css';
import { useAuth } from '../../components/context/Authcontext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SvgContent from '../../components/svgcontent.jsx';
import Pagination from "../../components/Pagination/index.jsx";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { PropagateLoader } from 'react-spinners';
import viewicon from '../../assets/images/viewicon.svg';

function Credits() {
  const { user } = useAuth();
  const [needLoading, setNeedLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [status, setStatus] = useState("active");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const generatedData = Array.from({ length: 25 }, (_, index) => {
      const empId = `EMP${Math.floor(1000 + Math.random() * 9000)}`;
      const orderId = `ORD${Math.floor(10000 + Math.random() * 90000)}`;
      const amount = `₹ ${[11000, 12000, 12500, 13000][Math.floor(Math.random() * 4)].toLocaleString()}`;
      const orderDate = `0${Math.floor(1 + Math.random() * 9)}-07-2025`;
      const collectionDate = `1${Math.floor(5 + Math.random() * 5)}-07-2025`;
      const status = Math.random() > 0.5 ? "Pending" : "Received";
      return {
        sno: (index + 1).toString().padStart(2, '0'),
        empId,
        orderId,
        amount,
        orderDate,
        collectionDate,
        status,
      };
    });

    setDataList(generatedData);
  }, []);

  const parseDate = (str) => {
    const [day, month, year] = str.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const filteredLeads = dataList.filter((item) => {
    const matchesStatus = status === "active" ? item.status === "Pending" : item.status === "Received";
    const matchesSearch = `${item.empId} ${item.orderId} ${item.amount} ${item.orderDate} ${item.collectionDate} ${item.status}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const itemDate = parseDate(item.orderDate);
    const matchDate =
      (!startDate || itemDate >= new Date(startDate.setHours(0, 0, 0, 0))) &&
      (!endDate || itemDate <= new Date(endDate.setHours(23, 59, 59, 999)));

    return matchesStatus && matchesSearch && matchDate;
  });

  const indexOfLastLeads = currentPage * itemsPerPage;
  const indexOfFirstLeads = indexOfLastLeads - itemsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLeads, indexOfLastLeads);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className='common-body-st'>
      {needLoading && (
        <div className='loading-container w-100 h-100'>
          <PropagateLoader height="100" width="100" color="#0B9346" radius="10" />
        </div>
      )}

      <div className='header-div-el'>
        <div className='header-divpart-el gap-2'>
          <p className='mb-0 header-titlecount-el'>Total credits : {filteredLeads.length}</p>
          <div className="status-toggle-up">
            <label className="custom-radio">
              <input
                type="radio"
                name="status"
                value="active"
                checked={status === "active"}
                onChange={(e) => setStatus(e.target.value)}
              />
              <span className="radio-button"></span> Pending
            </label>

            <label className="custom-radio">
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={status === "inactive"}
                onChange={(e) => setStatus(e.target.value)}
              />
              <span className="radio-button"></span> Received
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
          
          <button className="btn-top-up" onClick={() => setShowDateFilter(!showDateFilter)}>
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
        </div>
      </div>

      <div className='body-div-el'>
        <div className='w-100 p-2 d-flex justify-content-center align-items-center' style={{ height: "calc(100% - 48px)" }}>
          {currentLeads.length > 0 ? (
            <div className='table-userpro-up w-100 h-100 overflow-auto'>
              <div className='table-head-up d-flex'>
                <div className='w-10 p-2 d-flex justify-content-center align-items-center'>S.No</div>
                <div className='w-10 p-2 d-flex justify-content-center align-items-center'>Emp ID</div>
                <div className='w-14 p-2 d-flex justify-content-center align-items-center'>Order ID</div>
                <div className='w-15 p-2 d-flex justify-content-center align-items-center'>Amount</div>
                <div className='w-12 p-2 d-flex justify-content-center align-items-center'>Order Date</div>
                <div className='w-15 p-2 d-flex justify-content-center align-items-center'>Collection Date</div>
                <div className='w-12 p-2 d-flex justify-content-center align-items-center'>Status</div>
                <div className='w-12 p-2 d-flex justify-content-center align-items-center'>Status</div>
              </div>

              <div className='table-body-up d-flex flex-column'>
                {currentLeads.map((item, index) => (
                  <div className='table-bodydiv-up d-flex' key={index}>
                    <div className='w-10 p-2 d-flex justify-content-center align-items-center'>{item.sno}</div>
                    <div className='w-10 p-2 d-flex justify-content-center align-items-center'>{item.empId}</div>
                    <div className='w-14 p-2 d-flex justify-content-center align-items-center'>{item.orderId}</div>
                    <div className='w-15 p-2 d-flex justify-content-center align-items-center'>{item.amount}</div>
                    <div className='w-12 p-2 d-flex justify-content-center align-items-center'>{item.orderDate}</div>
                    <div className='w-15 p-2 d-flex justify-content-center align-items-center'>{item.collectionDate}</div>
                    <div className='w-12 p-2 d-flex justify-content-center align-items-center'>{item.status}</div>
                    <div className='w-12 p-2 d-flex justify-content-center align-items-center'>
                        <img src={viewicon} alt='viewicon' />
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
          <label className="me-2">
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

export default Credits;
