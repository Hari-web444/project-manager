import React, { useState, useEffect, useRef } from 'react';
import { PropagateLoader } from 'react-spinners';
import '../../assets/styles/branches.css';
import { useAuth } from '../../components/context/Authcontext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import configModule from '../../../config.js';
import Pagination from "../../components/Pagination/index.jsx";
import SvgContent from '../../components/svgcontent.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CommonSelect from "../../components/common-select.jsx";

function CreativeService() {
    const [serviceData, setServiceData] = useState([]);
    const [employeeData, setEmployeeData] = useState([]);
    const [needLoading, setNeedLoading] = useState(false);
    const { user } = useAuth();
    const userId = user?.userId;
    const user_typecode = user?.user_typecode;
    const config = configModule.config();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        empID: "",
        title: "",
        type: "",
        description: "",
        dateToPost: null,
    });

    const TypeOptions = [
        { label: "Whatsapp", value: "Whatsapp" },
        { label: "Facebook", value: "Facebook" },
        { label: "Instagram", value: "Instagram" },
        { label: "Youtube", value: "Youtube" }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value.target.value }));
    };

    const handleDateChange = (date) => {
        setFormData((prev) => ({ ...prev, dateToPost: formatDateToMySQL(date) }));
    };

    const getCreativeServices = async (objStatus = null) => {
        setNeedLoading(true);

        try {
            const response = await axios.post(`${config.apiBaseUrl}getCreativeServices`, {
                filterData: objStatus || ''
            });

            const result = response.data;
            if (response.status === 200) {
                setServiceData(result.data);

            } else {
                toast.error("Failed to fetch creative service details: " + result.message);
                console.error("Failed to fetch creative service details: " + result.message);
            }
        } catch (error) {
            toast.error(
                "Error fetching creative service details: " +
                (error.response?.data?.message || error.message)
            );
        } finally {
            setNeedLoading(false);
        }
    };

    const getEmployeeList = async () => {
        setNeedLoading(true);

        try {
            const response = await axios.post(`${config.apiBaseUrl}getEmployeeList`, {
                user_typecode: user_typecode,
                userId: userId
            });

            const result = response.data;
            if (response.status === 200) {
                const TypeOptions = result.map(item => ({
                    label: `${item.name} (${item.emp_id})`,
                    value: item.emp_id
                }));


                setEmployeeData(TypeOptions);
            } else {
                toast.error("Failed to fetch employee details: " + result.message);
                console.error("Failed to fetch employee details: " + result.message);
            }
        } catch (error) {
            toast.error(
                "Error fetching employee details: " +
                (error.response?.data?.message || error.message)
            );
        } finally {
            setNeedLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            getCreativeServices(null);
            getEmployeeList();
        }
    }, [user]);

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const indexOfLastCreativeServices = currentPage * itemsPerPage;
    const indexOfFirstCreativeServices = indexOfLastCreativeServices - itemsPerPage;
    const paginatedCreativeServices = serviceData.slice(indexOfFirstCreativeServices, indexOfLastCreativeServices);

    const currentCreativeServices = paginatedCreativeServices.filter((item) =>
        `${item.attendance_id} ${item.emp_id} ${item.emp_name} ${item.designation} ${item.work_type} ${item.status}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleSelect = (status) => {
        setShowDropdown(false);
        getCreativeServices(status);
    };

    const options = ['In progress', 'Completed'];

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const saveCreativeDetails = async (data) => {
        if (data) {
            if (!data.empID || !data.title || !data.type || !data.description || !data.dateToPost) {
                alert("Please fill in all required fields.");
                return;
            }

            try {
                const response = await axios.post(`${config.apiBaseUrl}saveCreativeService`, { data });

                const result = response.data;
                if (response.status === 200) {
                    console.log(result);
                    toast.success("Saved succesfully.");

                } else {
                    toast.error("Failed to saving service details: " + result.message);
                    console.error("Failed to saving service details: " + result.message);
                }
            } catch (error) {
                toast.error(
                    "Error saving service details: " +
                    (error.response?.data?.message || error.message)
                );
            } finally {
                setNeedLoading(false);
                setShowModal(false);
            }
        }
    };

    function formatDateToMySQL(date) {
        const pad = (n) => n < 10 ? '0' + n : n;
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
            `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

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
            <div className='header-div-lp header-div-cp'>
                <div className='header-divpart-el'>
                    <div className='d-flex gap-2'>
                        <p className='mb-0 header-titlecount-el'>Total Creatives : {serviceData?.length || 0}</p>
                    </div>
                </div>
                <div className="search-add-wrapper">
                    <input
                        type="text"
                        placeholder="Search"
                        className="search-input"
                        style={{ padding: "5px 12px" }}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="btn-top-up" onClick={() => setShowModal(true)} >
                        <span className='visible-label-up'>Add</span>
                    </button>

                    <div className="filter-container-up">
                        <button className="btn-top-up btn-bg-filled" onClick={toggleDropdown}>
                            <SvgContent svg_name="btn_filter" stroke="white" width={20} height={20} />
                            <span className="visible-label-up">Filter</span>
                        </button>

                        {showDropdown && (
                            <div className="dropdown-up">
                                <div className="dropdown-header-up">Filter</div>
                                <ul className="dropdown-list-up">
                                    {options.map((option) => (
                                        <li key={option} onClick={() => handleSelect(option)} className="dropdown-item-up">
                                            {option}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='body-div-lp' style={{ height: "calc(100% - 58px)" }}>
                <div className='h-100 w-100 p-2 pb-0'>
                    <div className='table-common-st'>
                        <div className='tb-header-row-st display-flex' style={{ minWidth: "1112px" }}>
                            <div className='brcommon-col-st w-10'>
                                S no
                            </div> <span style={{ color: "#129347" }}> | </span>
                            <div className='brcommon-col-st w-10'>
                                Date
                            </div> <span style={{ color: "#129347" }}> | </span>
                            <div className='brcommon-col-st w-12'>
                                Emp ID
                            </div> <span style={{ color: "#129347" }}> | </span>
                            <div className='brcommon-col-st w-12'>
                                Title
                            </div> <span style={{ color: "#129347" }}> | </span>
                            <div className='brcommon-col-st w-12'>
                                Describtion
                            </div> <span style={{ color: "#129347" }}> | </span>
                            <div className='brcommon-col-st w-10'>
                                Type
                            </div> <span style={{ color: "#129347" }}> | </span>
                            <div className='brcommon-col-st w-12'>
                                Date to post
                            </div> <span style={{ color: "#129347" }}> | </span>
                            <div className='brcommon-col-st w-10'>
                                Duration
                            </div> <span style={{ color: "#129347" }}> | </span>
                            <div className='brcommon-col-st w-12'>
                                Status
                            </div> <span style={{ color: "#129347" }}> | </span>
                        </div>

                        <div className='tb-body-row-st' style={{ minWidth: "1112px" }}>
                            {currentCreativeServices && currentCreativeServices.length > 0 ? (currentCreativeServices.map((item, index) => (
                                <div className='display-flex br-rowst' key={item.emp_id}>
                                    <div className='brcommon-col-st w-10'>
                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                    </div>
                                    <div className='brcommon-col-st w-10'>
                                        {formatDate(item.created_at)}
                                    </div>
                                    <div className='brcommon-col-st w-12'>
                                        {item.emp_id}
                                    </div>
                                    <div className='brcommon-col-st w-12'>
                                        {item.title}
                                    </div>
                                    <div className='brcommon-col-st w-12'>
                                        {item.description}
                                    </div>
                                    <div className='brcommon-col-st w-10'>
                                        {item.type}
                                    </div>
                                    <div className='brcommon-col-st w-12'>
                                        {formatDate(item.date_to_post)}
                                    </div>
                                    <div className='brcommon-col-st w-10'>

                                    </div>
                                    <div className='brcommon-col-st w-12'>
                                        {item.status}
                                    </div>
                                </div>
                            ))) : (
                                <div className='tb-body-row-st display-flex'>
                                    No Creative Service list
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
                            count={serviceData.length}
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
                                <h6>Emp ID</h6>
                                <div className="comm-select-ba">
                                    <CommonSelect
                                        header="Select Emp ID"
                                        placeholder="Select emp ID"
                                        name="empID"
                                        value={formData.empID}
                                        onChange={(value) => handleSelectChange("empID", value)}
                                        options={employeeData}
                                    />
                                </div>
                            </div>

                            <div className="container commonst-select mb-3">
                                <h6>Title</h6>
                                <div className="comm-select-ba">
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control location-ip-br"
                                        placeholder="Enter title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="container commonst-select mb-3">
                                <h6>Type</h6>
                                <div className="comm-select-ba">
                                    <CommonSelect
                                        header="Select Type"
                                        placeholder="Select Type"
                                        name="type"
                                        value={formData.type}
                                        onChange={(value) => handleSelectChange("type", value)}
                                        options={TypeOptions}
                                    />
                                </div>
                            </div>

                            <div className="container commonst-select mb-3">
                                <h6>Description</h6>
                                <div className="comm-select-ba">
                                    <input
                                        type="text"
                                        name="description"
                                        className="form-control location-ip-br"
                                        placeholder="Enter description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="container commonst-select mb-3">
                                <h6>Date To Post</h6>
                                <div className="comm-select-ba">
                                    <DatePicker
                                        selected={formData.dateToPost}
                                        onChange={handleDateChange}
                                        placeholderText="Select date"
                                        className="form-control"
                                        dateFormat="dd-MM-yyyy"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="next-button" onClick={() => saveCreativeDetails(formData)}>Add</button>
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

export default CreativeService;
