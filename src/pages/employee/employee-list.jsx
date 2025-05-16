import React, { useState, useEffect } from "react";
import '../../assets/styles/employee.css';
import CommonSelect from "../../components/common-select.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import configModule from '../../../config.js';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useAuth } from '../../components/context/Authcontext.jsx';
import SvgContent from "../../components/svgcontent.jsx";
import { PropagateLoader } from 'react-spinners';

function EmployeeList() {
  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [delConfirmPopup, setDelConfirmPopup] = useState(false);
  const [assignPopup, setAssignPopup] = useState(false);
  const [empDropData, setEmpDropData] = useState([]);
  const [selectedViewValue, setSelectedViewValue] = useState('');
  const [showEmpDataPopup, setShowEmpDataPopup] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);
  const [employeList, setEmployeList] = useState([]);
  const [delEmployeList, setDelEmployeList] = useState([]);
  const [role, setRole] = useState(null);
  const config = configModule.config();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.userId;
  const user_typecode = user?.user_typecode;
  const [status, setStatus] = useState("active");
  const isActive = status === "active";
  const currentList = isActive ? employeList : delEmployeList;
  const [searchQuery, setSearchQuery] = useState("");
  const [needLoading, setNeedLoading] = useState(false);

  const getDesignationList = async () => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}getDesignationList`);

      const result = response.data;
      if (response.status === 200) {
        setRoleOptions(result.data?.length > 0 ? result.data : []);
      } else {
        toast.error("Failed to fetch designation list: " + result.message);
      }
    } catch (error) {
      toast.error(
        "Error fetching designation list: " +
        (error.response?.data?.message || error.message)
      );
      setRoleOptions([]);
    }
  };

  const getEmployeeList = async () => {
    setNeedLoading(true);
    try {
      const response = await axios.post(`${config.apiBaseUrl}getEmployeeList`, {
        userId: userId, user_typecode: user_typecode
      });

      const result = response.data;
      if (response.status === 200) {
        setEmployeList(result.data?.length > 0 ? result.data.filter(emp => emp.isDeleted === 0) : []);
        setDelEmployeList(result.data?.length > 0 ? result.data.filter(emp => emp.isDeleted === 1) : []);
      } else {
        toast.error("Failed to fetch designation list: " + result.message);
      }
    } catch (error) {
      toast.error(
        "Error fetching designation list: " +
        (error.response?.data?.message || error.message)
      );
      setEmployeList([]);
    } finally {
      setNeedLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getDesignationList();
      getEmployeeList();
    }
  }, [user]);

  const AddEmployeeDetails = () => {
    if (!role) {
      toast.error("You need to select designation.");
      return;
    }

    setShowModal(false);
    navigate('/employee/list/add-edit', {
      state: { role, type: "Add" }
    });
  };

  const editEmployeeDetails = (item) => {
    if (!item) {
      toast.error("No value found.");
      return;
    }

    navigate('/employee/list/add-edit', {
      state: { item, type: "Edit" }
    });
  };

  const achievementsData = [
    { amount: '₹ 0', month: 'Jan 2025' },
    { amount: '₹ 0', month: 'Dec 2024' },
    { amount: '₹ 0', month: 'Nov 2024' },
    { amount: '₹ 0', month: 'Oct 2024' },
  ];

  const visibleItems = showAll ? achievementsData : achievementsData.slice(0, 2);

  const handleOpenEmpData = (item) => {
    setShowEmpDataPopup(true);
    setSelectedViewValue(item);
  };

  const filteredList = currentList.filter((emp) =>
    `${emp.emp_name} ${emp.designation} ${emp.email} ${emp.emp_id}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const formatDateTime = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid date";

    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const confirmDeleteFunc = (item) => {
    setDelConfirmPopup(true);
    setSelectedViewValue(item);
  };

  const assignTaskToOther = async () => {
    setNeedLoading(true);

    try {
      const response = await axios.post(`${config.apiBaseUrl}assignTaskToOther`, {
        emp_recid: role.target.id, assign_id: selectedViewValue.emp_recid
      });

      const result = response.data;
      if (response.status === 200) {
        toast.success(`Task successfully assigned to "${role.target.value}".`);

        setTimeout(() => {
          setAssignPopup(false);
        }, 1000);

      } else {
        toast.error("Failed to fetch designation list: " + result.message);
        console.error("Failed to fetch designation list: " + result.message);
      }
    } catch (error) {
      toast.error("Error deleting : " + (error.response?.data?.message || error.message));
      console.error("Error deleting : " + (error.response?.data?.message || error.message));
    } finally {
      setNeedLoading(false);
    }
  };

  const assignWorkToOther = (item) => {
    const emp_record_id = item.emp_recid;

    setAssignPopup(true);
    setSelectedViewValue(item);

    const filteredEmpData = employeList
      .filter(emp => emp.emp_recid !== emp_record_id)
      .map(emp => ({
        label: `${emp.emp_id} - ${emp.emp_name}`,
        value: emp.emp_name,
        id: emp.emp_recid,
        code: emp.emp_id
      }));

    setEmpDropData(filteredEmpData);
  };

  const handleDelete = async (item) => {
    try {
      const response = await axios.post(`${config.apiBaseUrl}deleteSelEmployee`, {
        emp_recid: item.emp_recid
      });

      const result = response.data;
      if (response.status === 200) {
        toast.success(`"${item.emp_name}" successfully deleted.`);
        setNeedLoading(true);

        setTimeout(() => {
          getDesignationList();
          getEmployeeList();
          setDelConfirmPopup(false);
          assignWorkToOther(item);
        }, 3000);

      } else {
        toast.error("Failed to fetch designation list: " + result.message);
      }
    } catch (error) {
      toast.error(
        "Error deleting : " +
        (error.response?.data?.message || error.message)
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
            color="#0B9346"
            radius="10"
          />
        </div>
      )}
      <div className='header-div-el'>
        <div className='header-divpart-el'>
          <p className='mb-0 header-titlecount-el'>Total Employee : {currentList && currentList.length ? currentList.length : 0 }</p>
          <div className="d-flex align-items-center">
            <button onClick={() => { setShowModal(false); }}>
              <p className='mb-0 nav-btn-top'>
                Employee &gt; List
              </p>
            </button>
          </div>
        </div>
        <div className="search-add-wrapper">
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="add-button" onClick={() => setShowModal(true)}>Add new</button>
        </div>
      </div>
      <div className='body-div-el'>
        <div className="status-toggle">
          <label htmlFor="status-active" className="custom-radio">
            <input
              type="radio"
              name="status"
              id="status-active"
              value="active"
              checked={status === "active"}
              onChange={(e) => setStatus(e.target.value)}
            />
            <span className="radio-button"></span>{' '}
            Active
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
            <span className="radio-button"></span>{' '}
            In-active
          </label>
        </div>
        {filteredList && filteredList.length > 0 ? (
          <div className="row current-item-el">
            {filteredList.map((item) => (
              <div key={item.emp_id} className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="p-4 h-100 item-box-el position-relative">
                  <button
                    type="button"
                    className="position-absolute top-0 start-0 end-0 bottom-0 w-100 h-100 border-0 bg-transparent"
                    onClick={() => handleOpenEmpData(item)}
                  />
                  {/* Dropdown menu */}
                  <div className="dropdown position-absolute drop-dots">
                    {item.isDeleted === 0 &&
                      <button
                        className=""
                        type="button"
                        id={`dropdownMenu-${item.emp_id}`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <SvgContent svg_name="threedots" />
                      </button>}

                    <div className="dropdown-menu dropdown-menu-el" aria-labelledby={`dropdownMenu-${item.emp_id}`}>
                      <div>
                        <button className="dropdown-item dropdown-item-st dropdown-item-edit" onClick={() => editEmployeeDetails(item)} >Edit</button>
                      </div>
                      <div>
                        <button className="dropdown-item dropdown-item-st" onClick={() => confirmDeleteFunc(item)}>Delete</button>
                      </div>
                    </div>
                  </div>

                  {/* Header section with image and basic info */}
                  <div className="d-flex justify-content-start align-items-start gap-3 head-item-box">
                    <div className="emp-img-st">
                      <img src={item.image_url} alt="emp_img" className={item.isDeleted === 0 ? "img-emp-el aimg-emp-el" : "img-emp-el dimg-emp-el"} />
                    </div>
                    <div className="mt-2" style={{ lineHeight: "25px" }}>
                      <div className="fw-bold">{item.emp_id}</div>
                      <div>{item.emp_name}</div>
                      <div>{item.designation}</div>
                    </div>
                  </div>

                  {/* Label box section */}
                  <div className="w-100 h-100 box-label-el mt-3">
                    <div className="d-flex">
                      <label htmlFor={`doj-${item.emp_id}`} className="me-2 fw-medium" style={{ minWidth: "55px" }}>DOJ:</label>
                      <span id={`doj-${item.emp_id}`}>{formatDateTime(item.date_of_joining)}</span>
                    </div>
                    <div className="d-flex">
                      <label htmlFor={`mobile-${item.emp_id}`} className="me-2 fw-medium" style={{ minWidth: "55px" }}>Mobile:</label>
                      <span id={`mobile-${item.emp_id}`}>{item.mobile_number}</span>
                    </div>
                    <div className="d-flex">
                      <label htmlFor={`email-${item.emp_id}`} className="me-2 fw-medium" style={{ minWidth: "55px" }}>Email:</label>
                      <span id={`email-${item.emp_id}`}>{item.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-100 inner-body-st">
            <p className="product-no-items-txt">No records found</p>
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
                <h6>Select designation</h6>
                <div className="comm-select-wd">
                  <CommonSelect
                    header="Select designation"
                    name="role"
                    value={role}
                    onChange={setRole}
                    options={roleOptions}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="next-button" onClick={AddEmployeeDetails} >Next</button>
            </div>
          </div>
        </div>
      )}

      {assignPopup && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h5 className="mb-0 add-new-hdr">In-active data transfer</h5>
            </div>
            <div className="modal-body">
              <div className="container commonst-select">
                <h6>Select Employee</h6>
                <div className="comm-select-wd">
                  <CommonSelect
                    header="Select employee"
                    placeholder="Select employee"
                    name="role"
                    value={role}
                    onChange={setRole}
                    options={empDropData}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-button" onClick={()=>setAssignPopup()}>Cancel</button>
              <button className="next-button" onClick={assignTaskToOther} >Assign</button>
            </div>
          </div>
        </div>
      )}

      {delConfirmPopup && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header mb-3">
              <h5 className="mb-0 add-new-hdr">Confirm to delete</h5>
            </div>
            <div className="modal-body mb-2">
              <div className="container commonst-select">
                <p>Are you sure to delete this "{selectedViewValue.emp_id} - {selectedViewValue.emp_name}"?</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setDelConfirmPopup(false)}>No, Vendaam</button>
              <button className="next-button" onClick={() => handleDelete(selectedViewValue)}>Seri Ok</button>
            </div>
          </div>
        </div>
      )}

      {showEmpDataPopup && (
        <div className="modal-overlay">
          <div className="modal-container modal-container-ev">
            <div className="modal-body modal-body-ev d-flex">
              <div className="col-5 h-100 left-view-emp">
                <div className="left-head-empview display-flex">
                  <img src={selectedViewValue.image_url} className={selectedViewValue.isDeleted === 1 ? "img-src-empdata img-src-dan-empdata" : "img-src-empdata img-src-act-empdata"} alt="emp data" />
                </div>
                <div className="left-body-empview">
                  <div className="w-100 h-100 left-corner-st">
                    <div className="d-flex mb-3" >
                      <label htmlFor={`doj-${selectedViewValue.emp_id}`} className="me-2 fw-700" style={{ minWidth: "152px" }}>Emp ID:</label>
                      <span className="fw-500" id={`doj-${selectedViewValue.emp_id}`}>{selectedViewValue.emp_id}</span>
                    </div>
                    <div className="d-flex mb-3">
                      <label htmlFor={`doj-${selectedViewValue.emp_id}`} className="me-2 fw-700" style={{ minWidth: "152px" }}>Name:</label>
                      <span id={`doj-${selectedViewValue.emp_id}`}>{selectedViewValue.emp_name}</span>
                    </div>
                    <div className="d-flex mb-3">
                      <label htmlFor={`doj-${selectedViewValue.emp_id}`} className="me-2 fw-700" style={{ minWidth: "152px" }}>Designation:</label>
                      <span id={`doj-${selectedViewValue.emp_id}`}>{selectedViewValue.designation}</span>
                    </div>
                    <div className="d-flex mb-3">
                      <label htmlFor={`doj-${selectedViewValue.emp_id}`} className="me-2 fw-700" style={{ minWidth: "152px" }}>Mobile:</label>
                      <span id={`doj-${selectedViewValue.emp_id}`}>{selectedViewValue.mobile_number}</span>
                    </div>
                    <div className="d-flex mb-3">
                      <label htmlFor={`doj-${selectedViewValue.emp_id}`} className="me-2 fw-700" style={{ minWidth: "152px" }}>Email:</label>
                      <span id={`doj-${selectedViewValue.emp_id}`}>{selectedViewValue.email}</span>
                    </div>
                    <div className="d-flex mb-3">
                      <label htmlFor={`mobile-${selectedViewValue.emp_id}`} className="me-2 fw-700" style={{ minWidth: "152px" }}>Date of joining:</label>
                      <span id={`mobile-${selectedViewValue.emp_id}`}>{formatDateTime(selectedViewValue.date_of_joining)}</span>
                    </div>
                    <div className="d-flex mb-3">
                      <label htmlFor={`email-${selectedViewValue.emp_id}`} className="me-2 fw-700" style={{ minWidth: "152px" }}>Salery:</label>
                      <span id={`email-${selectedViewValue.emp_id}`}>₹&nbsp;{selectedViewValue.salary}</span>
                    </div>
                    <div className="d-flex mb-3">
                      <label htmlFor={`email-${selectedViewValue.emp_id}`} className="me-2 fw-700" style={{ minWidth: "152px" }}>Incentive:</label>
                      <span id={`email-${selectedViewValue.emp_id}`}>{selectedViewValue.incentive_percentage}</span>
                    </div>
                    <div className="d-flex mb-3">
                      <label htmlFor={`email-${selectedViewValue.emp_id}`} className="me-2 fw-700" style={{ minWidth: "152px" }}>Address:</label>
                      <span id={`email-${selectedViewValue.emp_id}`}>{selectedViewValue.address}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-7 h-100">
                <div className="right-head-empview">
                  <button onClick={() => { setShowEmpDataPopup(false); setShowAll(false); }}>
                    <SvgContent svg_name="close" width="28" height="28" />
                  </button>
                </div>
                <div className="right-body-empview">
                  {/* Incentive Earned */}
                  <section>
                    <h5 className="text-2xl font-semibold mb-3">Incentive earned</h5>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 common-col-st p-6">
                      <div className="flex-1 text-center">
                        <h5 className="text-2xl font-semibold">₹ 0 </h5>
                        <div className="text-gray-600 mt-1">Monthly Incentive earned</div>
                      </div>
                      <div className="flex-1 text-center">
                        <h5 className="text-2xl font-semibold">₹ 0</h5>
                        <div className="text-gray-600 mt-1">Total incentive earned</div>
                      </div>
                    </div>
                  </section>

                  {/* Milestone */}
                  <section>
                    <h5 className="text-2xl font-semibold mb-3">Mile stone</h5>
                    <div className="flex justify-between items-center common-col-st p-6 text-center">
                      <div className="flex-1">
                        <h5 className="text-2xl font-semibold">₹ 0</h5>
                        <div className="text-gray-600 mt-1">Current milestone</div>
                      </div>
                      <div className="h-10 w-px bg-gray-300 mx-6"></div>
                      <div className="flex-1">
                        <h5 className="text-2xl font-semibold">₹ 0</h5>
                        <div className="text-gray-600 mt-1">Monthly target</div>
                      </div>
                    </div>
                  </section>

                  {/* Achievements */}
                  <section>
                    <h5 className="text-2xl font-semibold mb-3">Achievements</h5>
                    <div className="flex justify-between items-center common-col-st p-6 text-center ">
                      {visibleItems.map((item, index) => (
                        <div
                          key={item.month}
                          className="text-center min-w-[160px] flex-shrink-0 col-4"
                        >
                          <div className="text-gray-600 text-sm">Star performer</div>
                          <h5 className="text-2xl font-semibold mt-1">{item.amount}</h5>
                          <div className="text-gray-600 text-sm mt-1">{item.month}</div>
                        </div>
                      ))}

                      {!showAll && (
                        <button
                          className="cursor-pointer fw-500 color-default"
                          onClick={() => setShowAll(true)}
                        >
                          View all
                        </button>
                      )}

                    </div>
                  </section>
                </div>
              </div>
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
