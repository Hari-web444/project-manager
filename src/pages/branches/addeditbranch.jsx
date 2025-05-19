import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import configModule from '../../../config.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SingleSelect from '../../components/single-select.jsx';
import axios from 'axios';
import { PropagateLoader } from 'react-spinners';

function AddEditBranch({ rowData, closeAddeditModal }) {
    const config = configModule.config();
    const [branchHeadOpt, setBranchHeadOpt] = useState([]);
    const [formData, setFormData] = useState({
        branch_id: '',
        branch_name: '',
        branch_in_charge: '',
        email: '',
        opening_date: '',
        rent: '',
        branch_type: rowData?.type?.value || '',
        phone_number: '',
        country: rowData?.country?.value || '',
        state: rowData?.state?.value || '',
        district: rowData?.city?.value || '',
        location: rowData?.location || '',
        address: '',
        assignBrandasVaithyar: false,
        assignBrandasGramiyam: false
    });
    const [needLoading, setNeedLoading] = useState(false);

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
            const match = code.match(/^VPA(\d{3})/);
            return match ? parseInt(match[1], 10) : 0;
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

                if (result.headData) {
                    setBranchHeadOpt(result.headData);
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
    };

    const validateForm = () => {
        const requiredFieldsFilled = Object.entries(formData).every(([key, value]) => {
            if (typeof value === 'boolean') return true;
            return value !== '' && value !== null && value !== undefined;
        });

        const atLeastOneBrandAssigned = formData.assignBrandasVaithyar || formData.assignBrandasGramiyam;

        return requiredFieldsFilled && atLeastOneBrandAssigned;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setNeedLoading(true);
        if (!validateForm()) {
            toast.error("Please fill all fields and check all required checkboxes.");
            setNeedLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${config.apiBaseUrl}saveBranchDetails`, formData);
            toast.success("Data inserted successfully.");

            setTimeout(() => {
                closeAddeditModal();
            }, 3000);
        } catch (err) {
            toast.error(err.message);
            console.error(err);
        } finally {
            setNeedLoading(false);
        }
    };


    return (
        <div className="modal-overlay">
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
                                    <label htmlFor="branch_name">Branch Name</label>
                                    <SingleSelect options={branchHeadOpt} onClose={handleSelectClose} />
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
                                                id="assignBrandasVaithyar"
                                                name="assignBrandasVaithyar"
                                                className="form-check-input cursor-pointer"
                                                checked={formData.assignBrandasVaithyar}
                                                onChange={handleCheckboxChange}
                                            />
                                            <label className="form-check-label cursor-pointer" htmlFor="assignBrandasVaithyar">
                                                Vaithyar poova
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                id="assignBrandasGramiyam"
                                                name="assignBrandasramiyam"
                                                className="form-check-input cursor-pointer"
                                                checked={formData.assignBrandasGramiyam}
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
                    <button type="submit" className="next-button" onClick={handleSubmit}>Save</button>
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
    rowData: PropTypes.shape({
        action: PropTypes.string.isRequired,
        city: PropTypes.string,
        country: PropTypes.string,
        state: PropTypes.string,
        location: PropTypes.string,
        type: PropTypes.string,
    }).isRequired,
    closeAddeditModal: PropTypes.func.isRequired,
};

export default AddEditBranch;
