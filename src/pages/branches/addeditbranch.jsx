import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CommonSelect from "../../components/common-select.jsx";
import DatePicker from 'react-datepicker';
import configModule from '../../../config.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddEditBranch({ rowData, closeAddeditModal }) {
    const config = configModule.config();
    const [formData, setFormData] = useState({
        branch_id: '',
        branch_name: '',
        branchIncharge: '',
        email: '',
        openingDate: '',
        rent: '',
        branchType: '',
        phone: '',
        country: rowData?.country?.value || '',
        state: rowData?.state?.value || '',
        district: rowData?.city?.value || '',
        location: rowData?.location || '',
        address: '',
        assignBrands: {
            vaithyar: false,
            gramiyam: false,
        }
    });

    const branchInCharge = ["1 st branc", "2nd branch"];

    function getTwoLetterCode(str) {
        const words = str.trim().split(/\s+/);
        if (words.length === 1) {
            return words[0].slice(0, 2).toUpperCase();
        } else {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
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
            openingDate: formatDateTime(date),
        }));
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

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            assignBrands: {
                ...prevData.assignBrands,
                [name.replace('brand', '').toLowerCase()]: checked,
            },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    const getNextNumber = (lastEmpId) => {
        let numbers = lastEmpId || [];

        const parsedNumbers = numbers.map(code => {
            const match = code.match(/^VPA(\d{3})/);
            return match ? parseInt(match[1], 10) : 0;
        });

        const max = parsedNumbers.length > 0 ? Math.max(...parsedNumbers) : 0;
        return (max + 1).toString().padStart(3, '0');
    };

    const generateCode = (lastEmpId) => {
        if (lastEmpId) {
            const prefix = "VPA" + getTwoLetterCode(rowData?.state.code) + getTwoLetterCode(rowData?.location);
            const number = getNextNumber(lastEmpId);
            setVpaCode(`${prefix}${number}`);

            setFormData((prev) => ({
                ...prev,
                branch_id: `${prefix}${number}`,
            }));
        }
    };

    const getLastBranchId = async () => {
        let lastEmpId = [];
        try {
            const response = await fetch(`${config.apiBaseUrl}getLastBranchId`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ state: rowData?.state?.value || '', city: rowData?.location || '' })
            });
            const result = await response.json();
            if (response.ok) {
                if (result.data.length === 0) {
                    lastEmpId = result.data;
                } else {
                    lastEmpId = [result.data[0].emp_id];
                }
                generateCode(lastEmpId);
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

    return (
        <div className="modal-overlay">
            <div className="modal-container modal-container-ev" style={{ maxHeight: "95%" }}>
                <div className="modal-header mb-0 modal-header-aeb" >
                    <h5 className="mb-0 add-new-hdr ps-3">{rowData.action} new Branch</h5>
                </div>
                <div className="modal-body modal-body-aeb">
                    <form className="branch-form" onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="col-6 pe-2">
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
                                        required
                                    />
                                </div>

                                <div className="form-group-pp mb-3">
                                    <label htmlFor="branchIncharge">Branch In-charge</label>
                                    <CommonSelect
                                        header="Select branch incharge"
                                        id="branchIncharge"
                                        name="branchIncharge"
                                        value={formData.branchIncharge}
                                        onChange={handleChange}
                                        options={branchInCharge}
                                    />
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
                                    />
                                </div>

                                <div className="form-group-pp mb-3">
                                    <label htmlFor="openingDate">Opening Date</label>
                                    <DatePicker
                                        selected={formData.openingDate}
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
                                                id="brandVaithyar"
                                                name="brandVaithyar"
                                                className="form-check-input cursor-pointer"
                                                checked={formData.assignBrands.vaithyar}
                                                onChange={handleCheckboxChange}
                                            />
                                            <label className="form-check-label cursor-pointer" htmlFor="brandVaithyar">
                                                Vaithyar poova
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                id="brandGramiyam"
                                                name="brandGramiyam"
                                                className="form-check-input cursor-pointer"
                                                checked={formData.assignBrands.gramiyam}
                                                onChange={handleCheckboxChange}
                                            />
                                            <label className="form-check-label cursor-pointer" htmlFor="brandGramiyam">
                                                Gramiyam
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-6 ps-2">
                                <div className="form-group-pp mb-3">
                                    <label htmlFor="branchType">Branch Type</label>
                                    <input
                                        type="text"
                                        id="branchType"
                                        name="branchType"
                                        className="form-control"
                                        value={formData.branchType}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group-pp mb-3">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        className="form-control"
                                        value={formData.phone}
                                        onChange={handleChange}
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
                    <button type="submit" className="next-button">Save</button>
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
    }).isRequired,
    closeAddeditModal: PropTypes.func.isRequired,
};

export default AddEditBranch;
