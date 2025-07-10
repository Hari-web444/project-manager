import React, { useState, useEffect, useRef } from 'react';
import { PropagateLoader } from 'react-spinners';
import { useAuth } from '../../components/context/Authcontext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import configModule from '../../../config.js';
import Pagination from "../../components/Pagination/index.jsx";
import SvgContent from '../../components/svgcontent.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function PurchasePage() {
    const [userActivityDataList, setUserActivityDataList] = useState([]);
    const [leaveData, setLeaveData] = useState([]);
    const [permissionData, setPermissionData] = useState([]);
    const [userActivityDataHistory, setUserActivityDataHistory] = useState([]);
    const [needLoading, setNeedLoading] = useState(false);
    const { user } = useAuth();
    const user_typecode = user?.user_typecode;
    const config = configModule.config();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [status, setStatus] = useState("pending");
    const isActive = status === "pending";
    const allUserActData = isActive ? userActivityDataList : userActivityDataHistory;
    const [showDropdown, setShowDropdown] = useState(false);

    const getUserActivityDatas = async (objStatus = null) => {
        setNeedLoading(true);

        try {
            const response = await axios.post(`${config.apiBaseUrl}getUserActivityDatas`, {
                user_typecode: user_typecode || "",
                startDate: startDate?.toISOString().split('T')[0] || '',
                endDate: endDate?.toISOString().split('T')[0] || '',
                filterData: objStatus || ''
            });

            const result = response.data;
            if (response.status === 200) {
                setUserActivityDataList(result?.data?.length > 0 ? result.data.filter(itm => itm.user_status === "Pending") : []);
                setUserActivityDataHistory(result?.data?.length > 0 ? result.data.filter(itm => itm.user_status !== "Pending") : []);
                setLeaveData(result?.data?.length > 0 ? result.data.filter(itm => itm.action === "Leave") : []);
                setPermissionData(result?.data?.length > 0 ? result.data.filter(itm => itm.action === "Permission") : []);
            } else {
                toast.error("Failed to fetch user activity details: " + result.message);
                console.error("Failed to fetch user activity details: " + result.message);
            }
        } catch (error) {
            toast.error(
                "Error fetching user acivity details: " +
                (error.response?.data?.message || error.message)
            );
        } finally {
            setNeedLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            getUserActivityDatas(null);
        }
    }, [user]);

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const indexOfLastUserActivity = currentPage * itemsPerPage;
    const indexOfFirstUserActivity = indexOfLastUserActivity - itemsPerPage;
    const paginatedUserActivity = allUserActData.slice(indexOfFirstUserActivity, indexOfLastUserActivity);

    const currentUserActivity = paginatedUserActivity.filter((item) =>
        `${item.attendance_id} ${item.emp_id} ${item.emp_name} ${item.designation} ${item.work_type} ${item.status}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const sendApprovals = async (objType, item) => {
        if (item) {
            setNeedLoading(true);

            try {
                const response = await axios.post(`${config.apiBaseUrl}sendApprovalStatus`, {
                    status: objType || "",
                    id: item.lp_recid || -1
                });

                const result = response.data;
                if (response.status === 200) {
                    getUserActivityDatas(null);
                } else {
                    toast.error("Failed to saving user activity status: " + result.message);
                    console.error("Failed to saving user activity status: " + result.message);
                }
            } catch (error) {
                toast.error(
                    "Error saving user acivity details: " +
                    (error.response?.data?.message || error.message)
                );
            } finally {
                setNeedLoading(false);
            }
        }
    };

    const formatDateTime = (date) => {
        const d = new Date(date);
        if (isNaN(d.getTime())) return "Invalid date";
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    };

    function formatTime(timeStr) {
        const [hours, minutes] = timeStr.split(':');
        const date = new Date();
        date.setHours(+hours);
        date.setMinutes(+minutes);
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleSelect = (status) => {
        setShowDropdown(false);
        getPageDetails(status);
    };

    const options = ['Leave', 'Permission'];

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
            <div className='header-div-ac'>
                <div className='header-divpart-el'>
                    <div className='d-flex gap-4 mb-2'>
                        <p className='mb-0 header-titlecount-el'>Purchases: 78</p>
                        <p className='mb-0 header-titlecount-el'>Pending: 55</p>
                    </div>

                    <div className="status-toggle-up">
                        <label htmlFor="status-active" className="custom-radio">
                            <input
                                type="radio"
                                name="status"
                                id="status-active"
                                value="pending"
                                checked={status === "pending"}
                                onChange={(e) => setStatus(e.target.value)}
                            />
                            <span className="radio-button"></span> Vaithiyarpoova: 0
                        </label>

                        <label htmlFor="status-inactive" className="custom-radio">
                            <input
                                type="radio"
                                name="status"
                                id="status-inactive"
                                value="history"
                                checked={status === "history"}
                                onChange={(e) => setStatus(e.target.value)}
                            />
                            <span className="radio-button"></span> Gramiyam: 0
                        </label>
                    </div>
                </div>
                <div className="search-add-wrapper">
                    <button className="btn-top-up" >
                        <SvgContent svg_name="history" />
                        <span>History</span>
                    </button>
                    <button className="btn-top-up" onClick={() => setShowDateFilter(!showDateFilter)} >
                        <SvgContent svg_name="btn_calendar" width={20} height={20} />
                        <span className='visible-label-up'>Sort</span>
                    </button>
                    {showDateFilter && (
                        <div className="date-filter-popup">
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Start Date"
                                className="form-control form-btncontrol-up mb-2"
                            />
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                placeholderText="End Date"
                                className="form-control form-btncontrol-up mb-3"
                            />
                            <button
                                className="btn btn-sm btn-primary w-100 apply-filter-st"
                                onClick={() => {
                                    setCurrentPage(1);
                                    setShowDateFilter(false);
                                    getUserActivityDatas(null);
                                }}
                            >
                                Apply Filter
                            </button>
                        </div>
                    )}

                    <div className="filter-container-up">
                        <button className="btn-top-up" onClick={toggleDropdown}>
                            <SvgContent svg_name="btn_filter" width={20} height={20} />
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

                    <div className="filter-container-up">
                        <button className="btn-top-up btn-bg-filled">
                            <span>Export</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className='body-div-ac'>
                <div className='h-100 w-100 p-2 pb-0'>
                    <div className='table-common-st '>
                        <div className='tb-header-row-st display-flex' style={{ minWidth: "1112px" }}>
                            <div className='brcommon-col-st w-10'>
                                S no
                            </div> <span style={{ color: "#129347" }}> | </span>
                            <div className='brcommon-col-st w-15'>
                                Purchase ID
                            </div> <span style={{ color: "#129347" }}> | </span>
                            <div className={`brcommon-col-st ${status === "history" ? "w-15" : "w-10"}`}>
                                Name
                            </div> <span style={{ color: "#129347" }}> | </span>
                            <div className='brcommon-col-st w-10'>
                                Sales person
                            </div> <span style={{ color: "#129347" }}> | </span>
                            <div className={`brcommon-col-st ${status === "history" ? "w-20" : "w-15"}`}>
                                Order qty
                            </div> <span style={{ color: "#129347" }}> | </span>
                            <div className='brcommon-col-st w-10'>
                                Order value
                            </div> <span style={{ color: "#129347" }}> | </span>
                            <div className='brcommon-col-st w-10'>
                                Order date
                            </div> <span style={{ color: "#129347" }}> | </span>
                            <div className='brcommon-col-st w-10'>
                                Status
                            </div> <span style={{ color: "#129347" }}> | </span>
                            {status !== "history" && (
                                <>
                                    <div className='brcommon-col-st w-10'>
                                        View
                                    </div> <span style={{ color: "#129347" }}> | </span>
                                </>
                            )}
                        </div>

                        <div className='tb-body-row-st' style={{ minWidth: "1112px" }}>
                            {currentUserActivity && currentUserActivity.length > 0 ? (currentUserActivity.map((item, index) => (
                                <div className='display-flex br-rowst' key={item.emp_id}>
                                    <div className='brcommon-col-st w-10'>
                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                    </div>
                                    <div className='brcommon-col-st w-15'>
                                        {item.emp_id}
                                    </div>
                                    <div className={`brcommon-col-st ${status === "history" ? "w-15" : "w-10"}`}>
                                        {item.emp_name}
                                    </div>
                                    <div className='brcommon-col-st w-10'>
                                        {item.action}
                                    </div>
                                    <div className={`brcommon-col-st ${status === "history" ? "w-20" : "w-15"}`}>
                                        {item.Reason}
                                    </div>
                                    <div className='brcommon-col-st w-10'>
                                        {item.from_time ? formatTime(item.from_time) : formatDateTime(item.from_date)}
                                    </div>
                                    <div className='brcommon-col-st w-10'>
                                        {item.to_time ? formatTime(item.to_time) : formatDateTime(item.to_date)}
                                    </div>
                                    <div className='brcommon-col-st w-10 fw-bold' style={
                                        item.user_status === "Decline"
                                            ? { color: "red" }
                                            : item.user_status === "Approved"
                                                ? { color: "green" }
                                                : { color: "#e27500" }
                                    } >
                                        {item.user_status}
                                    </div>
                                    {status !== "history" && (
                                        <div className='brcommon-col-st w-10 justify-content-between ps-4 pe-4'>
                                            <button onClick={() => sendApprovals("Decline", item)} >
                                                <SvgContent svg_name="approve_cross" width="15" height="15" />
                                            </button>
                                            <button onClick={() => sendApprovals("Approved", item)}>
                                                <SvgContent svg_name="approve_tick" width="15" height="15" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))) : (
                                <div className='tb-body-row-st display-flex'>
                                    No Attendance list
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
                            count={allUserActData.length}
                            page={currentPage}
                            pageSize={itemsPerPage}
                            onChange={(pageNo) => setCurrentPage(pageNo)}
                        />
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

export default PurchasePage;
