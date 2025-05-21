import React, { useState, useEffect } from 'react';
import { PropagateLoader } from 'react-spinners';
import CommonSelect from "../../components/common-select.jsx";
import '../../assets/styles/branches.css';
import { useAuth } from '../../components/context/Authcontext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import configModule from '../../../config.js';
import AddEditBranch from './addeditbranch.jsx';

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
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const [location, setLocation] = useState("");
  const { user } = useAuth();
  const config = configModule.config();

  const TypeOptions = [
    { label: "Office", value: "Office" },
    { label: "Clinic", value: "Clinic" },
    { label: "Store", value: "Store" }
  ];

  const getLocationDetails = async () => {
    setNeedLoading(true);
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
    } finally {
      setNeedLoading(false);
    }
  };

  useEffect(() => {
    setLocation('');
    if (user) {
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

  const AddEditBranchModal = (sAction) => {
    if (!location || !country || !state || !city || !type) {
      toast.error("All fields are required.");
      return;
    }

    setFormData({ location: location, country: country?.target, state: state?.target, city: city?.target, type: type?.target, action: sAction });

    setShowModal(false);
    setAddEditModal(true);
  };

  const closeAddeditModal = () => {
    setAddEditModal(false);
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
          />
          <button className="add-button" onClick={() => setShowModal(true)} >Add new</button>
        </div>
      </div>
      <div className='body-div-el'>
        <div className='h-100 w-100 pt-4 p-2'>
          <div className='table-common-st'>
            <div className='tb-header-row-st display-flex'>
              <div className='brcommon-col-st w-10'>
                S no
              </div>
              <div className='brcommon-col-st w-15'>
                Branch ID
              </div>
              <div className='brcommon-col-st w-15'>
                Branch name
              </div>
              <div className='brcommon-col-st w-15'>
                In-charge
              </div>
              <div className='brcommon-col-st w-15'>
                Phone
              </div>
              <div className='brcommon-col-st w-20'>
                Location
              </div>
              <div className='brcommon-col-st w-10'>
                Action
              </div>
            </div>
            {branchDataList && branchDataList.length > 0 ? (branchDataList.map((item) => (
              <div key={item.branch_id} className='tb-body-row-st d-flex align-items-start'>
                <div className='brcommon-col-st w-10'>
                  S no
                </div>
                <div className='brcommon-col-st w-15'>
                  Branch ID
                </div>
                <div className='brcommon-col-st w-15'>
                  Branch name
                </div>
                <div className='brcommon-col-st w-15'>
                  In-charge
                </div>
                <div className='brcommon-col-st w-15'>
                  Phone
                </div>
                <div className='brcommon-col-st w-20'>
                  Location
                </div>
                <div className='brcommon-col-st w-10'>
                  Action
                </div>
              </div>
            ))) : (
              <div className='tb-body-row-st display-flex'>
              No Inventory list
              </div>
            )}
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

      {addEditModal && (
        <AddEditBranch rowData={formData} closeAddeditModal={closeAddeditModal} />
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
