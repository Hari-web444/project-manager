import React, { useState, useEffect, useRef } from 'react';
import '../../assets/styles/leads.css';
import { useAuth } from '../../components/context/Authcontext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import configModule from '../../../config.js';
import { PropagateLoader } from 'react-spinners';
import Pagination from "../../components/Pagination/index.jsx";
import { useNavigate } from 'react-router-dom';
import CommonSelect from "../../components/common-select.jsx";

function Leads() {
  const { user } = useAuth();
  const userId = user?.userId;
  const [catagory, setCatagory] = useState([]);
  const [leadsClData, setLeadsClData] = useState([]);
  const [needLoading, setNeedLoading] = useState(false);
  const config = configModule.config();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState('');
  const [editableDisposition, setEditableDisposition] = useState({});
  const [hoveredParent, setHoveredParent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [custID, setCustID] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [categoryList, setCategoryList] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

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
        setCatagory(result.categories);
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


  const TypeOptions = Array.isArray(catagory)
    ? catagory.map(item => ({
      label: item.category_name,
      value: item.category_id
    }))
    : [];

  const TypeGender = [{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }];

  const handleDispositionChange = async (leadId, newDisposition) => {
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
        console.error("Error updating disposition:", error);
        const errorMessage = error?.response?.data?.message || error.message || "Error updating disposition";
        toast.error(errorMessage);
      }

    }
  };

  const handleDispositionSubChange = (objData) => {
    navigate("/leads/add-to-card", { state: { selectedData: objData, catagory: catagory } });
  };

  const generateNextCustomerId = () => {
    if (!leadsClData || leadsClData.length === 0) {
      return "VPC001";
    }

    const vpcIds = leadsClData
      .map((lead) => lead.lead_id)
      .filter((id) => /^VPC\d+$/.test(id));

    if (vpcIds.length === 0) {
      return "VPC001";
    }

    const maxId = Math.max(...vpcIds.map(id => parseInt(id.replace("VPC", ""), 10)));

    const nextId = maxId + 1;

    return `VPC${String(nextId).padStart(3, "0")}`;
  };

  const handleAddProfile = async () => {
    const genderName = gender?.target?.name;
    const categoryName = categoryList?.target?.name;

    if (!name || !age || !genderName || !categoryName || !mobile || !email) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Optional: Mobile and email format checks
    if (!/^[0-9]{10}$/.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const profileData = {
      customer_id: custID,
      name,
      age,
      genderName,
      categoryName,
      mobile,
      email,
      userId
    };

    try {
      const response = await axios.post(`${config.apiBaseUrl}createProfileData`, { profileData });
      if (response.status === 200) {
        toast.success("Profile successfully created.");
        getLeadsPage();

        setShowModal(false);
        setName('');
        setAge('');
        setGender('');
        setCategoryList('');
        setMobile('');
        setEmail('');
      } else {
        toast.error("Failed to update disposition");
      }
    } catch (error) {
      console.error("Error updating disposition:", error);
      const errorMessage = error?.response?.data?.message || error.message || "Error updating disposition";
      toast.error(errorMessage);
    }
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
                <button
                  type="button"
                  className="clear-icon"
                  onClick={clearSearch}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#999',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                  }}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
            <div className='d-flex gap-2 align-items-center mobilebtn-label-st '>
              <button className="search-btn-lead" onClick={() => setSearchQuery(searchInput)} >Search</button>
              <button className="search-btn-lead" onClick={() => {
                const newId = generateNextCustomerId();
                setCustID(newId);
                setShowModal(true);
              }}>
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
                            <button
                              type="button"
                              className="custom-dropdown-trigger"
                              aria-haspopup="true"
                              aria-expanded={editableDisposition[item.lead_id] === "__open__"}
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
                            </button>

                            {editableDisposition[item.lead_id] === "__open__" && (
                              <div className="custom-dropdown-menu">
                                {groupedOptions.base.map((option) => (
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    key={option}
                                    className="dropdown-item-ldst position-relative"
                                    onClick={() => {
                                      if (option !== "Interested") {
                                        setEditableDisposition((prev) => ({
                                          ...prev,
                                          [item.lead_id]: option
                                        }));
                                        handleDispositionChange(item.lead_recid, option);
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        if (option !== "Interested") {
                                          setEditableDisposition((prev) => ({
                                            ...prev,
                                            [item.lead_id]: option
                                          }));
                                          handleDispositionChange(item.lead_recid, option);
                                        }
                                      }
                                    }}
                                    onMouseEnter={() => {
                                      if (option === "Interested") {
                                        setHoveredParent(item.lead_id);
                                      }
                                    }}
                                    onMouseLeave={() => {
                                      if (option === "Interested") {
                                        setHoveredParent(null);
                                      }
                                    }}
                                  >
                                    {option}

                                    {/* Submenu (can still be buttons) */}
                                    {option === "Interested" && hoveredParent === item.lead_id && (
                                      <div className="submenu">
                                        {groupedOptions.Interested.map((sub) => (
                                          <button
                                            key={sub}
                                            type="button"
                                            className="dropdown-item-ldst"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setEditableDisposition((prev) => ({
                                                ...prev,
                                                [item.lead_id]: sub
                                              }));
                                              handleDispositionSubChange(item);
                                            }}
                                          >
                                            {sub}
                                          </button>
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
                        <button className=''>
                          View
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='tb-body-row-st display-flex'>No lead list</div>
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
      {showModal && (
        <div className="modal-overlay modal-overlay-position">
          <div className="modal-container modal-overlay-position" style={{ width: "625px" }}>
            <div className="modal-header">
              <h5 className="mb-0 add-new-hdr">Create profile</h5>
            </div>
            <div className="modal-body">
              <div className="commonst-select mb-3">
                <label htmlFor="customerId" className="form-label">Customer ID</label>
                <div className="comm-select-ba">
                  <input
                    type="text"
                    id="customerId"
                    name="customer_id"
                    className="form-control location-ip-br"
                    value={custID}
                    readOnly
                    style={{ fontWeight: 'bold', color: 'green' }}
                  />
                </div>
              </div>

              <div className="commonst-select mb-3">
                <label htmlFor="nameInput" className="form-label">Name</label>
                <div className="comm-select-ba">
                  <input
                    type="text"
                    id="nameInput"
                    name="name"
                    className="form-control location-ip-br"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    required
                  />
                </div>
              </div>

              <div className="commonst-select mb-3">
                <label htmlFor="ageInput" className="form-label">Age</label>
                <div className="comm-select-ba">
                  <input
                    type="number"
                    id="ageInput"
                    name="age"
                    className="form-control location-ip-br"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter age"
                    required
                  />
                </div>
              </div>

              <div className="commonst-select mb-3">
                <label htmlFor="categoryInput" className="form-label">Gender</label>
                <div className="comm-select-ba position-relative">
                  <CommonSelect
                    header="Select gender"
                    placeholder="Select gender"
                    name="gender"
                    value={gender}
                    onChange={setGender}
                    options={TypeGender}
                  />
                </div>
              </div>

              <div className="commonst-select mb-3">
                <label htmlFor="categoryInput" className="form-label">Category</label>
                <div className="comm-select-ba position-relative">
                  <CommonSelect
                    header="Select category"
                    placeholder="Select category"
                    name="type"
                    value={categoryList}
                    onChange={setCategoryList}
                    options={TypeOptions}
                  />
                </div>
              </div>

              <div className="commonst-select mb-3">
                <label htmlFor="mobileInput" className="form-label">Mobile number</label>
                <div className="comm-select-ba">
                  <input
                    type="text"
                    id="mobileInput"
                    name="mobile"
                    className="form-control location-ip-br"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter mobile number"
                    maxLength={10}
                    pattern="[0-9]*"
                    required
                  />
                </div>
              </div>

              <div className="commonst-select mb-3">
                <label htmlFor="emailInput" className="form-label">Email</label>
                <div className="comm-select-ba">
                  <input
                    type="email"
                    id="emailInput"
                    name="email"
                    className="form-control location-ip-br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="next-button" onClick={handleAddProfile} >Add</button>
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

export default Leads;
