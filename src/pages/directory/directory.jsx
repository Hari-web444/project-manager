import React, { useState, useEffect, useRef } from 'react';
import { PropagateLoader } from 'react-spinners';
import CommonSelect from "../../components/common-select.jsx";
import '../../assets/styles/branches.css';
import { useAuth } from '../../components/context/Authcontext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import configModule from '../../../config.js';
import Pagination from "../../components/Pagination/index.jsx";
import SvgContent from '../../components/svgcontent.jsx';
import { useNavigate } from 'react-router-dom';

function Directory() {
  const [directoryDataList, setDirectoryDataList] = useState([]);
  const [needLoading, setNeedLoading] = useState(false);
  const [addEditModal, setAddEditModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [cityOption, setCityOption] = useState(null);
  const [countryOption, setCountryOption] = useState([]);
  const [stateOption, setStateOption] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const { user } = useAuth();
  const user_typecode = user?.user_typecode;
  const userId = user?.userId;
  const config = configModule.config();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const [selectedDirectory, setSelectedDirectory] = useState(null);
  const [delConfirmPopup, setDelConfirmPopup] = useState(false);
  const navigate = useNavigate();
  const [addTitle, setAddTitle] = useState("");
  const [addName, setAddName] = useState("");
  const [mobile, setMobile] = useState("");
  const [additionalMobile, setAdditionalMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);

  const getDirectoryDetails = async () => {
    setNeedLoading(true);
    try {
      const response = await axios.get(`${config.apiBaseUrl}getDirectoryDetails`);

      const result = response.data;
      if (response.status === 200) {
        setDirectoryDataList(result.leads);
      } else {
        toast.error("Failed to fetch directory details: " + result.message);
        console.error("Failed to fetch directory details: " + result.message);
      }
    } catch (error) {
      toast.error(
        "Error fetching directory details: " +
        (error.response?.data?.message || error.message)
      );
    } finally {
      setNeedLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getDirectoryDetails();
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

  const indexOfLastDirectory = currentPage * itemsPerPage;
  const indexOfFirstDirectory = indexOfLastDirectory - itemsPerPage;
  const paginatedDirectory = directoryDataList?.slice(indexOfFirstDirectory, indexOfLastDirectory);

  const currentDirectory = paginatedDirectory?.filter((item) =>
    `${item.title} ${item.name} ${item.mobile_no} ${item.district}`
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

  const handleDelete = async () => {
    try {
      const response = await axios.post(`${config.apiBaseUrl}deleteSelBranchList`, {
        title: selectedItem.title
      });

      const result = response.data;
      if (response.status === 200) {
        toast.success(`"${selectedItem.name}" is successfully deleted.`);
        setDelConfirmPopup(false);

        setTimeout(() => {
          getDirectoryDetails();
          getLocationDetails();
          setNeedLoading(false);
        }, 3000);

      } else {
        toast.error("Failed to delete directory list: " + result.message);
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

  const saveDirectoryDetails = async () => {
    if (!addTitle || !addName || !mobile || !country || !state || !city) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        title: addTitle,
        name: addName,
        mobile: mobile,
        additional_mobile: additionalMobile,
        email: email,
        address: address,
        country: country?.target?.value,
        state: state?.target?.value,
        city: city?.target?.value,
        userId: userId
      };

      const res = await axios.post(`${config.apiBaseUrl}saveDirectoryDetails`, {
        payload
      });
      
      if (res.status === 200) {
        toast.success("Directory saved successfully!");
        setShowModal(false);
        getDirectoryDetails();
      } else {
        toast.error("Failed to save directory");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
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
          <p className='mb-0 header-titlecount-el'>Total contact : {currentDirectory?.length || 0}</p>
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
              <div className='brcommon-col-st w-15'>
                S no
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-15'>
                Title
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-20'>
                Name
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-20'>
                Mobile number
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-15'>
                District
              </div>  <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-15'>
                Action
              </div>
            </div>

            <div className='tb-body-row-st'>
              {currentDirectory && currentDirectory.length > 0 ? (currentDirectory.map((item, index) => (
                <div className='display-flex br-rowst' key={item.title}>
                  <div className='brcommon-col-st w-15'>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </div>
                  <div className='brcommon-col-st w-15'>
                    {item.title}
                  </div>
                  <div className='brcommon-col-st w-20'>
                    {item.name}
                  </div>
                  <div className='brcommon-col-st w-20'>
                    {item.mobile_no}
                  </div>
                  <div className='brcommon-col-st w-15'>
                    {item.district}
                  </div>
                  <div
                    className="brcommon-col-st w-15 cursor-pointer position-relative">
                    <button onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDirectory(item);
                      setOpen(!open);
                    }} >
                      <SvgContent svg_name="threedots" />
                    </button>

                    {open && selectedDirectory?.title === item.title && (
                      <div ref={menuRef} className=" menu-branch-st right-0 mt-2 w-32 bg-white border shadow-lg rounded z-50">
                        <div
                          className="cursor-pointer"
                        >
                          <button
                            className=' default-bg w-100'
                            style={{ borderRadius: "10px 10px 0px 0px" }}
                            onClick={() => setShowModal(true)}
                          >
                            Edit
                          </button>
                        </div>
                        <div
                          className="cursor-pointer"
                        >
                          <button
                            className=' default-bg w-100'
                            onClick={() => {
                              setOpen(false);
                              navigate("/branches/view", { state: { item } });
                            }}
                          >
                            View
                          </button>
                        </div>
                        <div
                          className="cursor-pointer"
                        >
                          <button
                            className=' danger-bg w-100'
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
                  No directory list
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
              count={directoryDataList?.length}
              page={currentPage}
              pageSize={itemsPerPage}
              onChange={(pageNo) => setCurrentPage(pageNo)}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay modal-overlay-position">
          <div className="modal-container modal-overlay-position overflow-auto" style={{ width: "625px" }}>
            <div className="modal-header">
              <h5 className="mb-0 add-new-hdr">Add new Directory</h5>
            </div>
            <div className="modal-body">
              <div className="container commonst-select mb-3">
                <h6>Title</h6>
                <div className="comm-select-ba">
                  <input
                    type="text"
                    name="title"
                    className="form-control location-ip-br"
                    placeholder="Enter title"
                    value={addTitle}
                    onChange={(e) => setAddTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="container commonst-select mb-3">
                <h6>Name</h6>
                <div className="comm-select-ba">
                  <input
                    type="text"
                    name="name"
                    className="form-control location-ip-br"
                    placeholder="Enter name"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="container commonst-select mb-3">
                <h6>Mobile no</h6>
                <div className="comm-select-ba">
                  <input
                    type="text"
                    name="mobile"
                    className="form-control location-ip-br"
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
              </div>

              <div className="container commonst-select mb-3">
                <h6>Additional no <span className="text-muted">(optional)</span></h6>
                <div className="comm-select-ba">
                  <input
                    type="text"
                    name="additional_mobile"
                    className="form-control location-ip-br"
                    placeholder="Enter additional number"
                    value={additionalMobile}
                    onChange={(e) => setAdditionalMobile(e.target.value)}
                  />
                </div>
              </div>

              <div className="container commonst-select mb-3">
                <h6>Email <span className="text-muted">(optional)</span></h6>
                <div className="comm-select-ba">
                  <input
                    type="email"
                    name="email"
                    className="form-control location-ip-br"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="container commonst-select mb-3">
                <h6>Address</h6>
                <div className="comm-select-ba">
                  <textarea
                    name="address"
                    className="form-control location-ip-br"
                    placeholder="Enter address"
                    rows="2"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></textarea>
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
            </div>

            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="next-button" onClick={saveDirectoryDetails} >Save</button>
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
                <p>Are you sure to delete this "{selectedItem.title} - {selectedItem.name}"?</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setDelConfirmPopup(false)}>No</button>
              <button className="next-button" onClick={handleDelete}>Yes</button>
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

export default Directory;
