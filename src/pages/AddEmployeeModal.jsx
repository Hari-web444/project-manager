import React, { useState, useEffect } from 'react';
import axios from "axios";
import configModule from '../../config.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddEmployeeModal({ onClose, initialData = null, onSuccess }) {
  const [form, setForm] = useState({
    emp_name: '',
    department: '',
    email: '',
    phone: '',
    created_by: 'admin'
  });

  const isEdit = !!initialData;
  const config = configModule.config();

  useEffect(() => {
    if (initialData) {
      setForm({
        emp_id: initialData.emp_id || null,
        emp_name: initialData.emp_name || '',
        department: initialData.department || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        created_by: initialData.created_by || 'admin'
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const url = isEdit
        ? `${config.apiBaseUrl}updateEmployee`
        : `${config.apiBaseUrl}saveEmployees`;
      
      const response = await axios.post(url, form);

      if (response.status === 200) {
        toast.success(`Employee ${isEdit ? 'updated' : 'added'} successfully!`);
        
        setTimeout(() => onClose(), 2000);
      } else {
        toast.error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Employee save/update error:', error);
      toast.error(
        error?.response?.data?.message || 'Server error while processing request'
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className='mb-3'>{isEdit ? 'Edit Employee' : 'Add New Employee'}</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            name="emp_name"
            placeholder="Employee Name"
            value={form.emp_name}
            onChange={handleChange}
            required
          />
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Department --</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
          </select>

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />

          <div className='foot-empst mt-3'>
            <button type="button" className='cancel-st-emp' onClick={onClose}>Cancel</button>
            <button type="submit">{isEdit ? 'Update' : 'Submit'}</button>
          </div>
        </form>
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

export default AddEmployeeModal;
