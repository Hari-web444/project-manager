import React, { useState, useEffect, useRef } from 'react';
import { PropagateLoader } from 'react-spinners';
import CommonSelect from "../../components/common-select.jsx";
import '../../assets/styles/branches.css';
import { useAuth } from '../../components/context/Authcontext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import configModule from '../../../config.js';
import AddEditBranch from './addeditbranch.jsx';
import Pagination from "../../components/Pagination/index.jsx";
import SvgContent from '../../components/svgcontent.jsx';

function Branches() {
  const [branchDataList, setBranchDataList] = useState([]);
  const [needLoading, setNeedLoading] = useState(false);
  const [addEditModal, setAddEditModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [country, setCountry] = useState(null);
  const [cityOption, setCityOption] = useState(null);
  const [type, setType] = useState(null);
  const [countryOption, setCountryOption] = useState([]);
  const [stateOption, setStateOption] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const [location, setLocation] = useState("");
  const { user } = useAuth();
  const user_typecode = user?.user_typecode;
  const userId = user?.userId;
  const config = configModule.config();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [delConfirmPopup, setDelConfirmPopup] = useState(false);

  const TypeOptions = [
    { label: "Office", value: "Office" },
    { label: "Clinic", value: "Clinic" },
    { label: "Store", value: "Store" }
  ];

  const getLocationDetails = async () => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}getLocationDetails`);

      const result = response.data;
      if (response.status === 200) {
        setCountryOption(result.data);
      } else {
        toast.error("Failed to fetch location details: " + result.message);
        console.error("Failed to fetch location details: " + result.message);
      }
    } catch (error) {
      toast.error(
        "Error fetching location details: " +
        (error.response?.data?.message || error.message)
      );
    }
  };

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
    setLocation('');
    if (user) {
      getBranchDetails();
      getLocationDetails();
    }
  }, [user]);

  useEffect(() => {
    setStateOption([]);
    setState(null);

    if (country) {
      fetchStatesByCountry(country.target.id);
    }
  }, [country]);

  useEffect(() => {
    setCityOption([]);
    setCity(null);

    if (state) {
      fetchCityByState(state.target.id);
    }
  }, [state]);

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

  const fetchCityByState = async (id) => {
    setNeedLoading(true);
    try {
      const response = await axios.post(`${config.apiBaseUrl}getCityByState`, {
        state_id: id
      });

      const result = response.data;
      if (response.status === 200) {
        setCityOption(result.data);
      } else {
        toast.error("Failed to fetch location details: " + result.message);
        console.error("Failed to fetch location details: " + result.message);
      }
    } catch (error) {
      toast.error(
        "Error fetching location details: " +
        (error.response?.data?.message || error.message)
      );
    } finally {
      setNeedLoading(false);
    }
  };

  const fetchStatesByCountry = async (id) => {
    setNeedLoading(true);
    try {
      const response = await axios.post(`${config.apiBaseUrl}getStateByCoutry`, {
        country_id: id
      });

      const result = response.data;
      if (response.status === 200) {
        setStateOption(result.data);
      } else {
        toast.error("Failed to fetch location details: " + result.message);
        console.error("Failed to fetch location details: " + result.message);
      }
    } catch (error) {
      toast.error(
        "Error fetching location details: " +
        (error.response?.data?.message || error.message)
      );
    } finally {
      setNeedLoading(false);
    }
  };

  const AddEditBranchModal = (sAction, item) => {
    if ((!location || !country || !state || !city || !type) && sAction === "Add") {
      toast.error("All fields are required.");
      return;
    }

    if (item) {
      setSelectedItem(item);
    }

    setFormData({ location: location, country: country?.target, state: state?.target, city: city?.target, type: type?.target, action: sAction });

    setShowModal(false);
    setAddEditModal(true);
    setOpen(false);
  };

  const closeAddeditModal = () => {
    setAddEditModal(false);
    getBranchDetails();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const confirmDeleteFunc = (item) => {
    setDelConfirmPopup(true);
    setSelectedItem(item);
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.post(`${config.apiBaseUrl}deleteSelBranchList`, {
        branch_id: selectedItem.branch_id
      });

      const result = response.data;
      if (response.status === 200) {
        toast.success(`"${selectedItem.branch_name}" is successfully deleted.`);
        setDelConfirmPopup(false);

        setTimeout(() => {
          getBranchDetails();
          getLocationDetails();
          setNeedLoading(false);
        }, 3000);

      } else {
        toast.error("Failed to delete branch list: " + result.message);
      }
    } catch (error) {
      toast.error(
        "Error deleting : " +
        (error.response?.data?.message || error.message)
      );
    } finally {
      setNeedLoading(false);
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
          <p className='mb-0 header-titlecount-el'>Total Branch : 0</p>
          <div className="d-flex align-items-center">
            <button>
              <p className='mb-0 nav-btn-top'>
                Branch &gt; List
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
          <button className="add-button" onClick={() => setShowModal(true)} >Add new</button>
        </div>
      </div>
      <div className='body-div-el'>
        <div className='h-100 w-100 p-2 pb-0'>
          <div className='table-common-st'>
            <div className='tb-header-row-st display-flex'>
              <div className='brcommon-col-st w-10'>
                S no
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-15'>
                Branch ID
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-15'>
                Branch name
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-15'>
                In-charge
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-15'>
                Phone
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-20'>
                Location
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-10'>
                Action
              </div>
            </div>

            <div className='tb-body-row-st'>
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
                      setOpen(!open);
                    }} >
                      <SvgContent svg_name="threedots" />
                    </button>

                    {open && selectedBranch?.branch_id === item.branch_id && (
                      <div ref={menuRef} className=" menu-branch-st right-0 mt-2 w-32 bg-white border shadow-lg rounded z-50">
                        <div
                          className="cursor-pointer"
                        >
                          <button
                            className='px-4 py-2 default-bg w-100'
                            style={{ borderRadius: "10px 10px 0px 0px" }}
                            onClick={() => AddEditBranchModal("Edit", item)}
                          >
                            Edit
                          </button>
                        </div>
                        <div
                          className="cursor-pointer"
                        >
                          <button
                            className='px-4 py-2 default-bg w-100'
                            onClick={() => {
                              setOpen(false);
                            }}
                          >
                            View
                          </button>
                        </div>
                        <div
                          className="cursor-pointer"
                        >
                          <button
                            className='px-4 py-2 danger-bg w-100'
                            onClick={() => confirmDeleteFunc(item)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
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

      {showModal && (
        <div className="modal-overlay modal-overlay-position">
          <div className="modal-container modal-overlay-position" style={{ width: "625px" }}>
            <div className="modal-header">
              <h5 className="mb-0 add-new-hdr">Add new Branch</h5>
            </div>
            <div className="modal-body">
              <div className="container commonst-select mb-3">
                <h6>Select Type</h6>
                <div className="comm-select-ba">
                  <CommonSelect
                    header="Select type"
                    placeholder="Select type"
                    name="type"
                    value={type}
                    onChange={setType}
                    options={TypeOptions}
                  />
                </div>
              </div>
              <div className="container commonst-select mb-3">
                <h6>Select Country</h6>
                <div className="comm-select-ba">
                  <CommonSelect
                    header="Select country"
                    placeholder="Select country"
                    name="country"
                    value={country}
                    onChange={setCountry}
                    options={countryOption}
                    isSearchable={true}
                  />
                </div>
              </div>
              <div className="container commonst-select mb-3">
                <h6>Select Province / State</h6>
                <div className="comm-select-ba">
                  <CommonSelect
                    header="Select province / state"
                    placeholder="Select province / state"
                    name="state"
                    value={state}
                    onChange={setState}
                    options={stateOption}
                    isSearchable={true}
                  />
                </div>
              </div>
              <div className="container commonst-select mb-3">
                <h6>Select Town / District</h6>
                <div className="comm-select-ba">
                  <CommonSelect
                    header="Select town / district"
                    placeholder="Select town / district"
                    name="city"
                    value={city}
                    onChange={setCity}
                    options={cityOption}
                    isSearchable={true}
                  />
                </div>
              </div>
              <div className="container commonst-select mb-3">
                <h6>Enter Location</h6>
                <div className="comm-select-ba">
                  <input
                    type="text"
                    name="location"
                    className="form-control location-ip-br"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="next-button" onClick={() => AddEditBranchModal("Add")} >Next</button>
            </div>
          </div>
        </div>
      )}

      {delConfirmPopup && (
        <div className="modal-overlay modal-overlay-position">
          <div className="modal-container">
            <div className="modal-header mb-3">
              <h5 className="mb-0 add-new-hdr">Confirm to delete</h5>
            </div>
            <div className="modal-body mb-2">
              <div className="container commonst-select">
                <p>Are you sure to delete this "{selectedItem.branch_id} - {selectedItem.branch_name}"?</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setDelConfirmPopup(false)}>No</button>
              <button className="next-button" onClick={handleDelete}>Yes</button>
            </div>
          </div>
        </div>
      )}

      {addEditModal && (
        <AddEditBranch rowData={formData} selectedItem={selectedItem} closeAddeditModal={closeAddeditModal} />
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

export default Branches;
