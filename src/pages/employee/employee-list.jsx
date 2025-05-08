import React, { useState } from "react";
import '../../assets/styles/employee.css';
import CommonSelect from "../../components/common-select.jsx";

function EmployeeList() {
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState(null);

  const roleOptions = [
    { value: "Manager", label: "Manager" },
    { value: "Developer", label: "Developer" },
    { value: "Designer", label: "Designer" },
  ];

  return (
    <div className='common-body-st'>
      <div className='header-div-el'>
        <div className='header-divpart-el'>
          <h6 className='mb-0 header-titlecount-el'>Total Employee : 0</h6>
          <p className='mb-0'>Employee &gt; List</p>
        </div>
        <div className="search-add-wrapper">
          <input
            type="text"
            placeholder="Search"
            className="search-input"
          />
          <button className="add-button" onClick={() => setShowModal(true)}>Add new</button>
        </div>
      </div>
      <div className='body-div-el'>
        <p className="product-no-items-txt">No records found</p>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h5 className="mb-0 add-new-hdr">Add new employee</h5>
              <button className="close-button" >×</button>
            </div>

            <div className="modal-body">
              <div className="container commonst-select">
                <CommonSelect
                  header="Select designation"
                  name="role"
                  value={role}
                  onChange={setRole}
                  options={roleOptions}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-button" onClick={()=> setShowModal(false)}>Cancel</button>
              <button className="next-button" >Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;
