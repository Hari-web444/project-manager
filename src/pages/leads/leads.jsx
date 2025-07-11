import React, { useState, useEffect, useRef } from 'react';
import '../../assets/styles/leads.css';
import { useAuth } from '../../components/context/Authcontext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import configModule from '../../../config.js';
import { PropagateLoader } from 'react-spinners';
import Pagination from "../../components/Pagination/index.jsx";
import { useNavigate } from 'react-router-dom';

function Leads() {
  const { user } = useAuth();
  const userId = user?.userId;
  const [searchNumber, setSearchNumber] = useState("");
  const [leadsClData, setLeadsClData] = useState([]);
  const [needLoading, setNeedLoading] = useState(false);
  const [openNewDropDown, setOpenNewDropDown] = useState(false);
  const config = configModule.config();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDirectory, setSelectedDirectory] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [editableDisposition, setEditableDisposition] = useState({});
  const [hoveredParent, setHoveredParent] = useState(null);
  const navigate = useNavigate();

  const menuRef = useRef();

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const indexOfLastDirectory = currentPage * itemsPerPage;
  const indexOfFirstDirectory = indexOfLastDirectory - itemsPerPage;

  const currentDirectory = leadsClData?.filter((item) =>
    `${item.title} ${item.lead_name} ${item.mobile_number} ${item.district}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const groupedOptions = {
    Interested: ["Sales", "Consulting", "Class", "Wallet"],
    base: ["Interested", "Not interested", "Call back", "Follow up", "Call not response"]
  };

  const getLeadsPage = async () => {
    setNeedLoading(true);
    try {
      const response = await axios.post(`${config.apiBaseUrl}getAllLeadsDataForCl`, {
        userId: userId
      });

      const result = response.data;

      if (response.status === 200) {
        setLeadsClData(result.leads);
      } else {
        toast.error("Failed to fetch designation list: " + result.message);
      }
    } catch (error) {
      toast.error("Error fetching designation list: " + (error.response?.data?.message || error.message));
    } finally {
      setNeedLoading(false);
    }
  };

  const formatDateTime = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid date";
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  useEffect(() => {
    if (user) {
      getLeadsPage();
    }
  }, [user]);

  const handleDispositionChange = async (leadId, newDisposition) => {
    setOpenNewDropDown(false);
    if (newDisposition === "Intereseted") {
      try {
        const response = await axios.post(`${config.apiBaseUrl}updateDisposition`, {
          key: newDisposition,
          id: leadId,
        });
        if (response.status === 200) {
          toast.success("Disposition updated");
          getLeadsPage();
        } else {
          toast.error("Failed to update disposition");
        }
      } catch (error) {
        toast.error("Error updating disposition");
      }
    }
  };

  const handleDispositionSubChange = () => {
    navigate("/lead/add-to-card");
    return;
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
      <div className='w-100 h-100 p-3'>
        <div className="mobile-search-container d-flex shadow-sm rounded ">
          <div className='mobilename-label-st'>
            <h5 className="mb-2">Enter mobile number</h5>
            <p className="text-muted mb-0 small">(To check existing entries)</p>
          </div>
          <div className="d-flex align-items-center gap-3 " style={{ width: "calc(100% - 272px)" }}>
            <div className=' h-100 position-relative' style={{
              width: "calc(100% - 292px)",
              minWidth: "372px"
            }}>
              <input
                type="text"
                className="form-control-st mobile-input"
                placeholder="Enter mobile number"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <span
                  className="clear-icon"
                  onClick={clearSearch}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#999'
                  }}
                >
                  &times;
                </span>
              )}
            </div>
            <div className='d-flex gap-2 align-items-center mobilebtn-label-st '>
              <button className="search-btn-lead" onClick={() => setSearchQuery(searchInput)} >Search</button>
              <button className="search-btn-lead">
                Create Profile
              </button>
            </div>
          </div>
        </div>
        <div className='body-containerlead-st'>
          <div className='h-100 w-100 pt-2 pb-2 pb-0'>
            <div className='table-common-st'>
              {/* Table Header */}
              <div className='tb-header-row-st display-flex'>
                <div className='brcommon-col-st w-10'>S no</div> <span style={{ color: "#129347" }}>|</span>
                <div className='brcommon-col-st w-15'>Client ID</div> <span style={{ color: "#129347" }}>|</span>
                <div className='brcommon-col-st w-15'>Name</div> <span style={{ color: "#129347" }}>|</span>
                <div className='brcommon-col-st w-10'>Age</div> <span style={{ color: "#129347" }}>|</span>
                <div className='brcommon-col-st w-10'>Gender</div> <span style={{ color: "#129347" }}>|</span>
                <div className='brcommon-col-st w-15'>Category</div> <span style={{ color: "#129347" }}>|</span>
                <div className='brcommon-col-st w-15'>Mobile</div> <span style={{ color: "#129347" }}>|</span>
                <div className='brcommon-col-st w-15'>Disposition</div> <span style={{ color: "#129347" }}>|</span>
                <div className='brcommon-col-st w-15'>Date</div> <span style={{ color: "#129347" }}>|</span>
                <div className='brcommon-col-st w-10'>Profile</div>
              </div>

              {/* Table Body */}
              <div className='tb-body-row-st'>
                {currentDirectory && currentDirectory.length > 0 ? (
                  currentDirectory.map((item, index) => (
                    <div className='display-flex br-rowst' key={`${item.lead_id}-${index}`}>
                      <div className='brcommon-col-st w-10'>{(currentPage - 1) * itemsPerPage + index + 1}</div>
                      <div className='brcommon-col-st w-15'>{item.lead_id}</div>
                      <div className='brcommon-col-st w-15'>{item.lead_name}</div>
                      <div className='brcommon-col-st w-10'>{item.age}</div>
                      <div className='brcommon-col-st w-10'>{item.gender}</div>
                      <div className='brcommon-col-st w-15'>{item.category}</div>
                      <div className='brcommon-col-st w-15'>{item.mobile_number}</div>
                      <div className='brcommon-col-st w-15'>
                        {(item.disposition !== "Interested" && item.disposition !== "Not interested") ? (
                          <div className="custom-dropdown-wrapper">
                            <div
                              className="custom-dropdown-trigger"
                              onClick={() =>
                                setEditableDisposition((prev) => ({
                                  ...prev,
                                  [item.lead_id]: prev[item.lead_id] === "__open__" ? null : "__open__"
                                }))
                              }
                            >
                              {editableDisposition[item.lead_id] && editableDisposition[item.lead_id] !== "__open__"
                                ? editableDisposition[item.lead_id]
                                : item.disposition || "Select disposition"}
                            </div>

                            {editableDisposition[item.lead_id] === "__open__" && (
                              <div className="custom-dropdown-menu">
                                {groupedOptions.base.map((option) => (
                                  <div
                                    key={option}
                                    className="dropdown-item position-relative"
                                    onClick={() => {
                                      if (option !== "Interested") {
                                        setEditableDisposition((prev) => ({
                                          ...prev,
                                          [item.lead_id]: option
                                        }));
                                        handleDispositionChange(item.lead_recid, option);
                                      }
                                    }}
                                    onMouseEnter={() => {
                                      if (option === "Interested") {
                                        setHoveredParent(item.lead_id); // optional, local state to track open submenu
                                      }
                                    }}
                                    onMouseLeave={() => {
                                      if (option === "Interested") {
                                        setHoveredParent(null);
                                      }
                                    }}
                                  >
                                    {option}

                                    {/* Submenu */}
                                    {option === "Interested" && hoveredParent === item.lead_id && (
                                      <div className="submenu">
                                        {groupedOptions.Interested.map((sub) => (
                                          <div
                                            key={sub}
                                            className="dropdown-item"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setEditableDisposition((prev) => ({
                                                ...prev,
                                                [item.lead_id]: sub
                                              }));
                                              handleDispositionSubChange(item.lead_recid, sub);
                                            }}
                                          >
                                            {sub}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          item.disposition
                        )}
                      </div>


                      <div className='brcommon-col-st w-15'>{formatDateTime(item.created_at)}</div>
                      <div className='brcommon-col-st w-10'>
                        <button className='' onClick={() => setSelectedDirectory(item)}>
                          View
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='tb-body-row-st display-flex'>No directory list</div>
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
                count={leadsClData?.length}
                page={currentPage}
                pageSize={itemsPerPage}
                onChange={(pageNo) => setCurrentPage(pageNo)}
              />
            </div>
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

export default Leads;
