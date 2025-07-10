import React, { useState } from 'react';
import '../../assets/styles/calendar.css';
import CommonSelect from "../../components/common-select.jsx";
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const CalendarWithHolidayMarker = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showYearSelector, setShowYearSelector] = useState(false);
    const [showMonthSelector, setShowMonthSelector] = useState(false);
    const [officeBrkTime, setOfficeBrkTime] = useState(null);
    const holiday = "Holiday";
    const events = "Events";
    const [btnData, setBtnData] = useState(holiday);
    const [btnDivision, setBtnDivision] = useState(events);
    const [type, setType] = useState(null);
    const [permissionType, setPermissionType] = useState([]);
    const [value, setValue] = React.useState(dayjs('2022-04-17T15:30'));

    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const getDaysInMonth = (year, month) => {
        const date = new Date(year, month, 1);
        const days = [];

        const startDay = date.getDay();
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }

        return days;
    };

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
        setCurrentDate(new Date(newDate));
    };

    const handleYearSelect = (year) => {
        const newDate = new Date(currentDate);
        newDate.setFullYear(year);
        setCurrentDate(newDate);
        setShowYearSelector(false);
    };

    const handleMonthSelect = (monthIndex) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(monthIndex);
        setCurrentDate(newDate);
        setShowMonthSelector(false);
    };

    const isSameDay = (d1, d2) =>
        d1 && d2 &&
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();

    const monthName = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    const daysArray = getDaysInMonth(year, currentDate.getMonth());

    const startYear = year - 3;
    const yearRange = Array.from({ length: 7 }, (_, i) => startYear + i);

    const TypeHolidayOptions = [
        { label: "Government holiday", value: "Government holiday" },
        { label: "Religious holiday", value: "Religious holiday" },
        { label: "Company leave", value: "Company leave" },
        { label: "Week off", value: "Week off" }
    ];

    const TypeEventOptions = [
        { label: "Emp Birthday", value: "Emp Birthday" },
        { label: "Anniversary", value: "Anniversary" },
        { label: "Others", value: "Others" }
    ];

    const changeMethodEvent = () => {
        setBtnDivision(btnDivision === "Holiday" ? events : holiday);
        setBtnData(btnData === "Holiday" ? events : holiday);
    };

    const permissionHour = [
        { label: "1 HOUR", value: "1 HOUR" },
        { label: "2 HOUR", value: "2 HOUR" },
        { label: "3 HOUR", value: "3 HOUR" },
        { label: "4 HOUR", value: "4 HOUR" },
        { label: "5 HOUR", value: "5 HOUR" }
    ];

    return (
        <div className="common-body-st p-4">
            <div className="d-flex justify-content-end mb-3 gap-2">
                <button className="btn-events btn-top-up" onClick={changeMethodEvent} >{btnDivision}</button>
                <button className="btn-events btn-top-up" onClick={() => setOfficeBrkTime("Permission")}>Permission</button>
                <button className="btn-events btn-top-up" onClick={() => setOfficeBrkTime("Break")}>Break</button>
            </div>

            <div className="main-calc-st">
                {/* Calendar Section */}
                <div className="col-md-6 border-end p-0 pe-3">
                    <div className="calc-header-st d-flex justify-content-between align-items-center px-3 py-2 rounded mb-3 border-bottom calc-header-st">
                        <div className="d-flex gap-2">
                            <span className="fw-bold cursor-pointer" onClick={() => setShowMonthSelector(!showMonthSelector)}>
                                {monthName}
                            </span>
                            <span className="fw-bold cursor-pointer" onClick={() => setShowYearSelector(!showYearSelector)}>
                                {year}
                            </span>
                        </div>
                        <div>
                            <span className="me-3 cursor-pointer" onClick={() => changeMonth(-1)}>&#x25C0;</span>
                            <span className="cursor-pointer" onClick={() => changeMonth(1)}>&#x25B6;</span>
                        </div>
                    </div>

                    {/* Month Dropdown */}
                    {showMonthSelector && (
                        <div className="month-dropdown border rounded shadow p-2 bg-white position-absolute z-3" style={{ top: '70px', left: '30px', width: '200px' }}>
                            <div className="d-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                                {monthNames.map((month, idx) => (
                                    <div
                                        key={month}
                                        className={`py-1 px-2 rounded cursor-pointer text-center ${idx === currentDate.getMonth() ? 'bg-primary-vp text-white' : ''}`}
                                        onClick={() => handleMonthSelect(idx)}
                                    >
                                        {month.slice(0, 3)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Year Dropdown */}
                    {showYearSelector && (
                        <div className="year-dropdown border rounded shadow p-2 bg-white position-absolute z-3" style={{ top: '70px', left: '100px' }}>
                            {yearRange.map((yr) => (
                                <div
                                    key={yr}
                                    className={`py-1 px-2 rounded cursor-pointer ${yr === year ? 'bg-primary-vp text-white' : 'text-dark'}`}
                                    onClick={() => handleYearSelect(yr)}
                                >
                                    {yr}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Weekdays */}
                    <div className="d-grid calendar-grid text-center mb-2">
                        {days.map((day) => (
                            <div key={day} className="fw-semibold text-muted">{day}</div>
                        ))}
                    </div>

                    {/* Dates */}
                    <div className="d-grid calendar-grid text-center">
                        {daysArray.map((date, idx) => {
                            const isToday = date && isSameDay(date, new Date());
                            const isSelected = date && isSameDay(date, selectedDate);

                            return (
                                <button
                                    key={idx}
                                    disabled={!date}
                                    className={`btn btn-sm calendar-day m-1 
                    ${isToday ? 'border border-primary text-primary-st fw-bold' : ''}
                    ${isSelected ? 'bg-primary-vp text-white fw-bold' : ''}
                    ${!date ? 'bg-transparent-st text-white fw-bold' : ''}
                  `}
                                    onClick={() => date && setSelectedDate(new Date(date))}
                                >
                                    {date ? date.getDate() : ''}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Holiday Form */}
                <div className="col-md-6" style={{ padding: "18px" }}>
                    <h5 className="mb-4">{btnData} Marker</h5>
                    <form>
                        <div className="mb-3">
                            <label className="form-label">Date</label>
                            <input
                                type="text"
                                className="form-control"
                                readOnly
                                value={selectedDate.toLocaleDateString('en-GB')}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Type</label>

                            <div className="comm-select-ba w-100">
                                <CommonSelect
                                    header="Select type"
                                    placeholder="Select type"
                                    name="type"
                                    value={type}
                                    onChange={setType}
                                    options={btnData === "Holiday" ? TypeHolidayOptions : TypeEventOptions}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Remark</label>
                            <input type="text" className="form-control" />
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Target</label>
                            <input type="text" className="form-control" />
                        </div>

                        <div className="d-flex justify-content-end gap-4">
                            <button type="button" className="btn-outline-secondary danger-hover">Cancel</button>
                            <button type="submit" className="btn-primary-vp">Save</button>
                        </div>
                    </form>
                </div>
            </div>

            {officeBrkTime && (
                <div className="modal-overlay modal-overlay-position">
                    <div className="modal-container">
                        <div className="modal-header mb-3">
                            <h5 className="mb-0 add-new-hdr">{officeBrkTime}</h5>
                        </div>

                        {officeBrkTime === "Permission" && (
                            <div className="modal-body mb-2">
                                <div className="container commonst-select">
                                    <p>Set permission duration for the employee per month</p>
                                </div>
                                <div className="container commonst-select mb-3">
                                    <p>{officeBrkTime} time</p>
                                    <div className="calc-select-ba">
                                        <CommonSelect
                                            header="Select hour"
                                            placeholder="Select hour"
                                            name="type"
                                            value={permissionType}
                                            onChange={setPermissionType}
                                            options={permissionHour}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {officeBrkTime === "Break" && (
                            <div className="modal-body mb-4">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['MobileTimePicker']}>
                                        <DemoItem label="Mobile variant">
                                            <MobileTimePicker
                                                value={value}
                                                onChange={(newValue) => setValue(newValue)}
                                            />
                                        </DemoItem>
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>
                        )}

                        <div className="modal-footer">
                            <button className="cancel-button" onClick={() => setOfficeBrkTime(null)} >Cancel</button>
                            <button className="next-button" >Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarWithHolidayMarker;
