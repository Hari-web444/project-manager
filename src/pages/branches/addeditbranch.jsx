import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import configModule from '../../../config.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SingleSelect from '../../components/single-select.jsx';
import axios from 'axios';
import { PropagateLoader } from 'react-spinners';

function AddEditBranch({ rowData = {}, selectedItem = {}, closeAddeditModal = {} }) {
    const config = configModule.config();
    const [branchHeadOpt, setBranchHeadOpt] = useState([]);
    const getField = (field, fallback = '') => selectedItem[field] || fallback;
    const getNestedRowValue = (key) => rowData?.[key]?.value || '';
  
    const defaultFormData = {
      branch_id: getField('branch_id'),
      branch_name: getField('branch_name'),
      branch_incharge_recid: getField('branch_incharge_recid'),
      branch_in_charge: getField('branch_in_charge'),
      email: getField('email'),
      opening_date: getField('opening_date'),
      rent: getField('rent'),
      branch_type: selectedItem.branch_type || getNestedRowValue('type'),
      phone_number: getField('phone_number'),
      country: selectedItem.country || getNestedRowValue('country'),
      state: selectedItem.state || getNestedRowValue('state'),
      district: selectedItem.district || getNestedRowValue('city'),
      location: selectedItem.location || getNestedRowValue('location'),
      address: getField('address'),
      assign_brand_vaithyar: selectedItem.assign_brand_vaithyar ?? false,
      assign_brand_gramiyam: selectedItem.assign_brand_gramiyam ?? false,
    };
    const [formData, setFormData] = useState(defaultFormData);
    const [loading, setLoading] = useState(false);
    const [btnIsDisabled, setBtnIsDisabled] = useState(false);

    function getTwoLetterCode(str) {
        const words = str.trim().split(/\s+/);
        if (words.length === 1) {
            return words[0].slice(0, 2).toUpperCase();
        } else {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
    };

    const formatDateTime = (date) => {
        const pad = (n) => n.toString().padStart(2, '0');

        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleDateChange = (date) => {
        setFormData((prev) => ({
            ...prev,
            opening_date: formatDateTime(date),
        }));
    };

    const handleCheckboxChange = (e) => {
        const { id, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: checked
        }));
    };

    const getNextNumber = (lastBranchId) => {
        let numbers = lastBranchId || [];

        const parsedNumbers = numbers.map(code => {
            const match = code.match(/^([A-Z]+)(\d{3})$/);
            return match ? parseInt(match[2], 10) : 0;
        });

        const max = parsedNumbers.length > 0 ? Math.max(...parsedNumbers) : 0;
        return (max + 1).toString().padStart(3, '0');
    };

    const generateCode = (lastBranchId) => {
        if (lastBranchId) {
            const prefix = "VPA" + getTwoLetterCode(rowData?.state.code) + getTwoLetterCode(rowData?.location);
            const number = getNextNumber(lastBranchId);

            setFormData((prev) => ({
                ...prev,
                branch_id: `${prefix}${number}`,
            }));
        }
    };

    const getLastBranchId = async () => {
        let lastBranchId = [];
        try {
            const response = await fetch(`${config.apiBaseUrl}getLastBranchId`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ state: rowData?.state?.value || '', location: rowData?.location || '' })
            });
            const result = await response.json();
            if (response.ok) {
                if (result.branchData.length === 0) {
                    lastBranchId = result.branchData;
                } else {
                    lastBranchId = [result.branchData[0].branch_id];
                }
                generateCode(lastBranchId);
            } else {
                console.error("Failed to fetch branch last id: " + result.message);
                toast.error("Failed to fetch branch last id: " + result.message);
            }
        } catch (error) {
            console.error("Error fetching branch last id: " + error.message);
            toast.error("Error fetching branch last id: " + error.message);
        }
    };

    const getBranchHeadList = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}getBranchHeadList`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const result = await response.json();
            if (response.ok) {
                if (result.headData) {
                    setBranchHeadOpt(result.headData);
                } else {
                    toast.info("No data found");
                    setBranchHeadOpt([]);
                }
            } else {
                console.error("Failed to fetch branch last id: " + result.message);
                toast.error("Failed to fetch branch last id: " + result.message);
            }
        } catch (error) {
            console.error("Error fetching branch last id: " + error.message);
            toast.error("Error fetching branch last id: " + error.message);
        }
    };

    useEffect(() => {
        if (rowData.action === "Add") {
            getLastBranchId();
        }
        getBranchHeadList();
    }, []);

    const handleSelectClose = (selectedOption) => {
        setFormData((prev) => ({
            ...prev,
            "branch_in_charge": selectedOption.value,
        }));

        setFormData((prev) => ({
            ...prev,
            "email": selectedOption.email,
        }));

        setFormData((prev) => ({
            ...prev,
            "phone_number": selectedOption.mobile_number,
        }));

        setFormData((prev) => ({
            ...prev,
            "branch_incharge_recid": selectedOption.id,
        }));
    };

    const validateForm = () => {
        const requiredFieldsFilled = Object.entries(formData).every(([key, value]) => {
            if (typeof value === 'boolean') return true;
            return value !== '' && value !== null && value !== undefined;
        });

        const atLeastOneBrandAssigned = formData.assign_brand_vaithyar || formData.assign_brand_gramiyam;

        return requiredFieldsFilled && atLeastOneBrandAssigned;
    };

    const getChangedFields = () => {
        return Object.entries(formData)
            .filter(([key, newValue]) => {
                if (newValue === null) return false;

                let oldValue = selectedItem[key];

                if (newValue instanceof Date && oldValue) {
                    return new Date(oldValue).getTime() !== newValue.getTime();
                }

                if (
                    typeof newValue === "number" ||
                    (!isNaN(newValue) && newValue !== "")
                ) {
                    return Number(oldValue) !== Number(newValue);
                }

                if (
                    (newValue === '' || newValue === undefined) &&
                    (oldValue === '' || oldValue === null || oldValue === undefined)
                ) {
                    return false;
                }

                return newValue !== oldValue;
            })
            .map(([key, newValue]) => ({
                key,
                newValue,
                branch_id: selectedItem.branch_id,
            }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        if (!validateForm()) {
            toast.error("Please fill all fields and check all required checkboxes.");
            setLoading(false);
            return;
        }

        let payload;
        let api = '';

        if (rowData.action === "Edit") {
            const changedFields = getChangedFields();

            if (changedFields.length === 0) {
                toast.info("No changes to update.");
                setLoading(false);
                return;
            }

            payload = {
                branch_id: selectedItem.branch_id,
                updates: changedFields
            };

            api = "updateBranchDetails";
        } else {
            payload = {
                formData: formData
            };
            api = "saveBranchDetails";
        }

        try {
            const response = await axios.post(`${config.apiBaseUrl}${api}`, payload);

            if (response.data) {
                toast.success("Data inserted successfully.");
                setBtnIsDisabled(true);

                setTimeout(() => {
                    closeAddeditModal();
                    setBtnIsDisabled(false);
                }, 3000);
            } else {
                toast.info("No data found");
            }
        } catch (err) {
            toast.error(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="modal-overlay">
            {loading && (
                <div className='loading-container w-100 h-100'>
                    <PropagateLoader
                        height="100"
                        width="100"
                        color="#0B9346"
                        radius="10"
                    />
                </div>
            )}
            <div className="modal-container modal-container-ev" style={{ maxHeight: "95%" }}>
                <div className="modal-header mb-0 modal-header-aeb" >
                    <h5 className="mb-0 add-new-hdr ps-3">{rowData.action} new Branch</h5>
                </div>
                <div className="modal-body modal-body-aeb">
                    <form className="branch-form" >
                        <div className="form-grid">
                            <div className="col-12 col-xl-6 col-sm-12 col-lg-6 col-md-6 pe-2">
                                <div className="form-group-pp mb-3">
                                    <label htmlFor="branch_id">Branch ID</label>
                                    <input
                                        type="text"
                                        id="branch_id"
                                        name="branch_id"
                                        disabled
                                        className="form-control fw-700"
                                        style={{ color: "#0B622F" }}
                                        value={formData.branch_id}
                                    />
                                </div>

                                <div className="form-group-pp mb-3">
                                    <label htmlFor="branch_name">Branch Name</label>
                                    <input
                                        type="text"
                                        id="branch_name"
                                        name="branch_name"
                                        className="form-control"
                                        value={formData.branch_name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group-pp mb-3">
                                    <label htmlFor="branch_name">Branch In-Charge</label>
                                    <SingleSelect options={branchHeadOpt} onClose={handleSelectClose} defaultValue={formData.branch_in_charge ? { label: formData.branch_in_charge, value: formData.branch_in_charge } : ''} />
                                </div>

                                <div className="form-group-pp mb-3">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </div>

                                <div className="form-group-pp mb-3">
                                    <label htmlFor="opening_date">Opening Date</label>
                                    <DatePicker
                                        selected={formData.opening_date}
                                        onChange={handleDateChange}
                                        placeholderText="dd/mm/yyyy"
                                        className="form-control"
                                        dateFormat="dd-MM-yyyy"
                                    />
                                </div>

                                <div className="form-group-pp mb-3">
                                    <label htmlFor="rent">Rent</label>
                                    <input
                                        type="text"
                                        id="rent"
                                        name="rent"
                                        className="form-control"
                                        value={formData.rent}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group-pp mb-3">
                                    <label htmlFor='brand'>Assign Brands</label>
                                    <div className='w-100'>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                id="assign_brand_vaithyar"
                                                name="assign_brand_vaithyar"
                                                className="form-check-input cursor-pointer"
                                                checked={formData.assign_brand_vaithyar}
                                                onChange={handleCheckboxChange}
                                            />
                                            <label className="form-check-label cursor-pointer" htmlFor="assign_brand_vaithyar">
                                                Vaithyar poova
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                id="assign_brand_gramiyam"
                                                name="assignBrandasramiyam"
                                                className="form-check-input cursor-pointer"
                                                checked={formData.assign_brand_gramiyam || ''}
                                                onChange={handleCheckboxChange}
                                            />
                                            <label className="form-check-label cursor-pointer" htmlFor="brandGramiyam">
                                                Gramiyam
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-xl-6 col-sm-12 col-lg-6 col-md-6 ps-2">
                                <div className="form-group-pp mb-3">
                                    <label htmlFor="branch_type">Branch Type</label>
                                    <input
                                        type="text"
                                        id="branch_type"
                                        name="branch_type"
                                        className="form-control"
                                        value={formData.branch_type}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </div>

                                <div className="form-group-pp mb-3">
                                    <label htmlFor="phone_number">Phone Number</label>
                                    <input
                                        type="text"
                                        id="phone_number"
                                        name="phone_number"
                                        className="form-control"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        maxLength={10}
                                        disabled
                                    />
                                </div>

                                <div className="form-group-pp mb-3">
                                    <label htmlFor="country">Country</label>
                                    <input
                                        type="text"
                                        id="country"
                                        name="country"
                                        className="form-control"
                                        value={formData.country}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </div>

                                <div className="form-group-pp mb-3">
                                    <label htmlFor="state">Province / State</label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        className="form-control"
                                        value={formData.state}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </div>

                                <div className="form-group-pp mb-3">
                                    <label htmlFor="district">Town / District</label>
                                    <input
                                        type="text"
                                        id="district"
                                        name="district"
                                        className="form-control"
                                        value={formData.district}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </div>

                                <div className="form-group-pp mb-3">
                                    <label htmlFor="location">Location</label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        className="form-control"
                                        value={formData.location}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </div>

                                <div className="form-group-pp mb-3">
                                    <label htmlFor="address">Address</label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        rows="3"
                                        className="form-control"
                                        value={formData.address}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer modal-footer-aeb">
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={closeAddeditModal}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="next-button" onClick={handleSubmit} disabled={btnIsDisabled}>Save</button>
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

AddEditBranch.propTypes = {
    selectedItem: PropTypes.shape({
        branch_id: PropTypes.string,
        branch_name: PropTypes.string,
        branch_incharge_recid: PropTypes.string,
        branch_in_charge: PropTypes.string,
        email: PropTypes.string,
        opening_date: PropTypes.string,
        rent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        branch_type: PropTypes.string,
        phone_number: PropTypes.string,
        country: PropTypes.string,
        state: PropTypes.string,
        district: PropTypes.string,
        location: PropTypes.string,
        address: PropTypes.string,
        assign_brand_vaithyar: PropTypes.bool,
        assign_brand_gramiyam: PropTypes.bool
    }),
    rowData: PropTypes.object,
    closeAddeditModal: PropTypes.func.isRequired
};

export default AddEditBranch;
