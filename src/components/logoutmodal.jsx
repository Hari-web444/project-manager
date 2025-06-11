import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function Logoutmodal({  oncloses }) {
  const navigate = useNavigate();
 const handleLogout = () => {
    localStorage.removeItem('authToken');
    oncloses();
    navigate('/login');
    
  };

  return (
    <div className="modal-overlay modal-overlay-position">
      <div className="modal-container">
        <div className="modal-header mb-3">
          <h5 className="mb-0 add-new-hdr">Logout</h5>
        </div>

        <div className="modal-body mb-2">
          <div className="container commonst-select">
            <p>Are you sure you want to logout?</p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={oncloses}>
            Cancel
          </button>
          <button
            className="next-button"
           onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

Logoutmodal.propTypes = {
  oncloses: PropTypes.func.isRequired,
};
export default Logoutmodal;
