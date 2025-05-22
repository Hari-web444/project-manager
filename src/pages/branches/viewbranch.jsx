import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomDateRangePicker from '../../components/date-range.jsx';
import PropagateLoader from 'react-spinners/PropagateLoader'; // Make sure you imported this

function ViewBranch() {
    const [needLoading, setNeedLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const selectedData = location.state?.item;
    const excludeKeys = ['branch_recid', 'branch_incharge_recid'];
    const [status, setStatus] = useState("sales");

    const handleDateRangeChange = (selectedRange) => {
        console.log('Selected range:', selectedRange);
        // You can now send this to API or update state, etc.
    };

    function toLabel(key) {
        return key
            .replace(/_/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
    }

    return (
        <div className='common-body-st'>
            {needLoading && (
                <div className='loading-container w-100 h-100'>
                    <PropagateLoader
                        height={100}
                        width={100}
                        color="#0B9346"
                        radius={10}
                    />
                </div>
            )}

            <div className='header-div-el'>
                <div className='header-divpart-el'>
                    <p className='mb-0 header-titlecount-el'>Total Branch : 0</p>
                    <div className="d-flex align-items-center">
                        <button onClick={() => { navigate("/branches") }}>
                            <p className='mb-0 nav-btn-top'>Branch &gt; List &gt;</p>
                        </button>
                        <button>
                            <p className='mb-0 nav-btn-top'>&nbsp;View</p>
                        </button>
                    </div>
                </div>
                <div className="search-add-wrapper">
                    <CustomDateRangePicker onDateChange={handleDateRangeChange} />
                    <button className="add-button">Export</button>
                </div>
            </div>

            <div className='w-100 body-container-vb d-flex'>
                <div className='col-5 leftshow-data-div'>
                    <div className='w-100 h-100 box-container-vb'>
                        <div className='p-3'>
                            {selectedData ? (
                                Object.entries(selectedData)
                                    .filter(([key]) => !excludeKeys.includes(key))
                                    .map(([key, value]) => {
                                        const formattedValue = (() => {
                                            if ((key === 'created_at' || key === 'opening_date') && value) {
                                                return new Date(value).toLocaleDateString();
                                            }
                                            if (key === 'assign_brand_vaithyar' || key === 'assign_brand_gramiyam') {
                                                return value === 1 ? 'Yes' : 'No';
                                            }
                                            return value;
                                        })();
                                        return (
                                            <div key={key} className='d-flex' style={{ flexWrap: "wrap" }}>
                                                <p style={{ color: "white", fontWeight: "800", minWidth: "212px" }} >
                                                    {toLabel(key)}:
                                                </p>
                                                <p style={{ color: "white" }}>
                                                    {formattedValue}
                                                </p>
                                            </div>
                                        );
                                    })
                            ) : (
                                <p>No branch data available.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className='col-7 rightshow-data-div'>
                    <div className='w-100 h-100'>
                        <div className='d-flex align-items-start justify-content-start' style={{ height: "52px" }}>
                            <div className="d-flex align-items-start gap-2 mt-2 mb-6">
                                <div className="status-toggle align-items-start">
                                    <label htmlFor="status-sales" className="custom-radio">
                                        <input
                                            type="radio"
                                            name="status"
                                            id="status-sales"
                                            value="sales"
                                            checked={status === "sales"}
                                            onChange={(e) => setStatus("sales")}
                                        />
                                        <span className="radio-button"></span>{' '}
                                        Sales report
                                    </label>

                                    <label htmlFor="status-employee" className="custom-radio">
                                        <input
                                            type="radio"
                                            name="status"
                                            id="status-employee"
                                            value="employee"
                                            checked={status === "employee"}
                                            onChange={(e) => setStatus("employee")}
                                        />
                                        <span className="radio-button"></span>{' '}
                                        Employee report
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='w-100 overflow-auto' style={{ height: "calc(100% - 52px)" }}>
                            <div className='w-100 h-100' style={status === "employee" ? { minWidth: "784px", background: "#fff"  } : { minWidth: "584px", background: "#fff" }}>
                                {status === "employee" ? (
                                    <div className='h-100 w-100'>
                                        <div className='thead-br d-flex w-100'>
                                            <div className='w-10 p-2 display-flex'>
                                                S.No
                                            </div>
                                            <div className='w-15 p-2 display-flex'>
                                                Emp ID
                                            </div>
                                            <div className='w-20 p-2 display-flex'>
                                                Vaithyar poova
                                            </div>
                                            <div className='w-20 p-2 display-flex'>
                                                Gramiyam
                                            </div>
                                            <div className='w-15 p-2 display-flex'>
                                                Total
                                            </div>
                                            <div className='w-20 p-2 display-flex'>
                                                Incentive earned
                                            </div>
                                        </div>
                                        <div className='tbody-br display-flex'>
                                            No employee report
                                        </div>
                                    </div>
                                ) : (
                                    <div className='h-100 w-100'>
                                        <div className='thead-br d-flex w-100'>
                                            <div className='w-10 p-2 display-flex'>
                                                S.No
                                            </div>
                                            <div className='w-20 p-2 display-flex'>
                                                Date
                                            </div>
                                            <div className='w-25 p-2 display-flex'>
                                                Vaithyar poova
                                            </div>
                                            <div className='w-25 p-2 display-flex'>
                                                Gramiyam
                                            </div>
                                            <div className='w-20 p-2 display-flex'>
                                                Total
                                            </div>
                                        </div>
                                        <div className='tbody-br display-flex'>
                                            No sales report
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewBranch;
