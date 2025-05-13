import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../assets/styles/addemployeelist.css';
import SvgContent from '../../components/svgcontent.jsx';
import DatePicker from 'react-datepicker';
import { useAuth } from '../../components/context/Authcontext.jsx';
import { useEffect } from 'react';
import configModule from '../../../config.js';

function AddEmployee() {
    const config = configModule.config();
    const [vpaCode, setVpaCode] = useState("XXXXXX");
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const location = useLocation();
    const desCode = location.state?.role?.target?.code;
    const desValue = location.state?.role?.target?.value;
    const { user } = useAuth();
    const user_typecode = user?.user_typecode;
    const userId = user?.userId;
    const [formData, setFormData] = useState({
        empId: vpaCode,
        empName: '',
        designation: desValue,
        email: '',
        mobile: '',
        dateOfJoining: null,
        salary: '',
        incentive: '',
        address: '',
    });

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

    const getNextNumber = (lastEmpId) => {
        let numbers = lastEmpId || [];

        numbers.map(code => {
            const match = code.match(/^VPA(\d{3})/);
            return match ? parseInt(match[1], 10) : 0;
        });
        const max = numbers.length > 0 ? Math.max(...numbers) : 0;
        return (max + 1).toString().padStart(3, '0');
    };

    const generateCode = (lastEmpId) => {
        if (user) {
            const prefix = "VPA";
            const number = getNextNumber(lastEmpId);
            const locationCode = user_typecode === "AD" ? "HO" : "";
            setVpaCode(`${prefix}${number}${desCode}${locationCode}`);

            setFormData((prev) => ({
                ...prev,
                empId: `${prefix}${number}${desCode}${locationCode}`,
            }));
        }
    };

    const getLastEmpID = async () => {
        let lastEmpId = [];
        if (user) {
            try {
                const response = await fetch(`${config.apiBaseUrl}GetLastEmpID`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ userId: parseInt(userId), value: desValue || '' })
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
                    console.error("Failed to fetch designation list: " + result.message);
                    toast.error("Failed to fetch designation list: " + result.message);
                }
            } catch (error) {
                console.error("Error fetching designation list: " + error.message);
                toast.error("Error fetching designation list: " + error.message);
            }
        }
    };

    useEffect(() => {
        getLastEmpID();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDateChange = (date) => {
        setFormData((prev) => ({
            ...prev,
            dateOfJoining: formatDateTime(date),
        }));
    };

    const handleCancel = () => {
        setFormData({
            empId: vpaCode,
            empName: '',
            designation: desValue,
            email: '',
            mobile: '',
            dateOfJoining: null,
            salary: '',
            incentive: '',
            address: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.empId &&
            !formData.empName?.trim() ||
            !formData.designation ||
            !formData.email?.trim() ||
            !formData.mobile?.trim() ||
            !formData.dateOfJoining ||
            !formData.salary?.trim() ||
            !formData.incentive?.trim() ||
            !formData.address?.trim()
        ) {
            return toast.error("Required all fields.");
        }

        try {
            const response = await fetch(`${config.apiBaseUrl}saveEmpDetails`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ formData: formData, userId: userId })
            });

            const result = await response.json();
            if (response.ok) {
                console.log(result);
                handleRemoveImage();
                handleCancel();
                navigate("/employee/list");

            } else {
                console.error("Failed to fetch designation list: " + result.message);
                toast.error("Failed to fetch designation list: " + result.message);
            }
        } catch (error) {
            console.error("Error fetching designation list: " + error.message);
            toast.error("Error fetching designation list: " + error.message);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            toast.error('Please upload a valid JPEG or PNG image.');
        }
    };

    const handleUpload = () => {
        if (!image) return toast.error('Please upload an image first.');
        console.log('Uploading image:', image);
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
    };

    return (
        <div className='common-body-st'>
            <div className='header-div-el'>
                <div className='header-divpart-el'>
                    <p className='mb-0 header-titlecount-el'>Total Employee : 0</p>
                    <div className="d-flex align-items-center">
                        <button onClick={() => { navigate("/employee/list") }}>
                            <p className='mb-0 nav-btn-top'>
                                Employee &gt; List
                            </p>
                        </button>&nbsp;&gt;&nbsp;
                        <button>
                            <p className='mb-0 nav-btn-top'>
                                Add new
                            </p>
                        </button>
                    </div>
                </div>
            </div>
            <div className='body-div-el'>
                <div className="w-100 h-100 inner-body-st">
                    <div className='left-container-el'>
                        <div className='left-header-st'>
                            <h5 className='mb-0'>Employee image</h5>
                        </div>
                        <div className="upload-container">
                            <label className="upload-box w-100 h-100">
                                {previewUrl ? (
                                    <>
                                        <img src={previewUrl} alt="Preview" className="preview-image" />
                                        <button className="remove-image-btn" onClick={handleRemoveImage}>
                                            <SvgContent svg_name="Trash" />
                                        </button>
                                    </>
                                ) : (
                                    <div className='not-getimage-st' >
                                        <SvgContent svg_name="upload" width="45 " height="45" />
                                        <div>
                                            <p className='mb-0 text-upload-st'>Upload image</p>
                                            <span style={{ color: "#404040", fontSize: "12px" }}>(JPEG, PNG)</span>
                                        </div>
                                    </div>
                                )}
                            </label>
                        </div>
                        <div className='left-footer-st'>
                            <label htmlFor="imageUpload" className="upload-btn display-flex">
                                Upload image
                                <input
                                    type="file"
                                    id="imageUpload"
                                    accept="image/jpeg, image/png"
                                    onChange={handleImageChange}
                                    className="upload-input"
                                    hidden
                                />
                            </label>
                        </div>
                    </div>
                    <div className='right-container-el'>
                        <div className='top-addoption-ae'>
                            <h5 className='mb-0'>General details</h5>
                        </div>
                        <form className="w-100 form-st-ae">
                            <div className='row mb-3'>
                                <div className='col-6'>
                                    <label className="form-label">Emp ID</label>
                                    <input
                                        type="text"
                                        className="form-control text-success fw-bold"
                                        value={formData.empId}
                                        disabled
                                    />
                                </div>
                                <div className='col-6'>
                                    <label className="form-label">Emp name</label>
                                    <input
                                        type="text"
                                        name="empName"
                                        className="form-control"
                                        placeholder="Enter employee name"
                                        value={formData.empName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <div className='col-6'>
                                    <label className="form-label">Designation</label>
                                    <input
                                        type="text"
                                        name="designation"
                                        className="form-control"
                                        placeholder="Designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        required
                                        disabled
                                    />
                                </div>
                                <div className='col-6'>
                                    <label className="form-label">Mobile number</label>
                                    <input
                                        type="text"
                                        name="mobile"
                                        className="form-control"
                                        placeholder="Enter mobile number"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <div className='col-6'>
                                    <label className="form-label">Email address </label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="Enter mail address"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='col-6'>
                                    <label className="form-label">Date of joining</label>
                                    <DatePicker
                                        selected={formData.dateOfJoining}
                                        onChange={handleDateChange}
                                        placeholderText="Select date of joining"
                                        className="form-control"
                                        dateFormat="yyyy-MM-dd"
                                    />
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <div className='col-6'>
                                    <label className="form-label">Salary</label>
                                    <input
                                        type="number"
                                        name="salary"
                                        className="form-control"
                                        placeholder="Enter emp salary"
                                        value={formData.salary}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className='col-6'>
                                    <label className="form-label">Incentive (%)</label>
                                    <input
                                        type="number"
                                        name="incentive"
                                        className="form-control"
                                        placeholder="Enter incentive in percentage"
                                        value={formData.incentive}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <div className='col-12'>
                                    <label className="form-label">Address</label>

                                    <textarea
                                        name="address"
                                        className="form-control"
                                        placeholder="Enter employee address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows={2}
                                        style={{ resize: "none" }}
                                    />
                                </div>
                            </div>
                        </form>
                        <div className='footer-addoption-ae'>
                            <button type="button" className="btn btn-outline-secondary close-ae" onClick={handleCancel}>
                                Clear
                            </button>
                            <button type="submit" className="btn btn-success save-ae" onClick={handleSubmit}>
                                Save
                            </button>
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

export default AddEmployee;
