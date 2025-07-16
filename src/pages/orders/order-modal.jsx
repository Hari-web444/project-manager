import React, { useState, useEffect } from 'react';
import configModule from '../../../config.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../components/context/Authcontext.jsx';

function OrderDetailModal({ order, onClose, type }) {
  if (!order) return null;
  const { user } = useAuth();
  const userId = user?.userId;

  const [productData, setProductData] = useState([]);
  const config = configModule.config();

  const getOrderDetails = async () => {
    try {
      const response = await axios.post(`${config.apiBaseUrl}getProductData`,{
        product_id: order?.product_id
      });
      const result = response.data;

      if (response.status === 200) {
        setProductData(result?.data);
      } else {
        toast.error("Failed to fetch product data: " + result.message);
      }
    } catch (error) {
      setProductData([]);
      toast.error("Error fetching product data: " + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    getOrderDetails();
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const cleanOrder = {
    order_id: order?.order_id || 'N/A',
    date_time: order?.date_time || 'N/A',
    lead_id: order?.lead_id || 'VPC01',
    lead_name: order?.lead_name || 'N/A',
    mobile_number: order?.mobile_number || 'N/A',
    address: order?.address || '',
    district: order?.district || '',
    state: order?.state || '',
    courier: order?.courier || '',
    stick_type: order?.stick_type || '',
    order_value: order?.order_value || '0',
    discount: order?.discount || '0',
    approved_by: order?.approved_by || '',
    courier_charge: order?.courier_charge || '0',
    gst_no: order?.gst_no || 'XXXXXXXX',
    hsn: order?.hsn || 'XXXXXXXX',
    gst_percent: order?.gst_percent || 'X%',
    gst_amount: order?.gst_amount || 'XX',
    total_value: order?.total_value || '0',
    payment_mode: order?.payment_mode || 'UPI',
    transaction_id: order?.transaction_id || 'XXXXXXXXXX',
    payment_date: order?.payment_date || '',
    receipt_image_url: order?.receipt_image_url || 'https://i.imgur.com/6IUbEMV.png',
  };

  const putActionForApproval = async (sAction) => {
    const status = sAction;

    try {
      const response = await axios.post(`${config.apiBaseUrl}putStatus`,{
        status: status,
        order_id: order?.order_recid
      });
      const result = response.data;

      if (response.status === 200) {
        toast.success("Updated successfully");
        onClose();

      } else {
        toast.error("Failed to fetch product data: " + result.message);
      }
    } catch (error) {
      toast.error("Error fetching product data: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="order-modal-overlay">
      <div className="order-modal-container">
        {type === "view" && (
          <button className="order-modal-close" onClick={onClose}>×</button>
        )}
        <div className="order-modal-grid">
          <div className="order-modal-section">
            <h4>Order Details</h4>
            <p>Order ID: {cleanOrder.order_id}</p>
            <p>Order date: {formatDate(cleanOrder.date_time)}</p>

            <h4>Client Details</h4>
            <p>Client ID: {cleanOrder.lead_id}</p>
            <p>Name: {cleanOrder.lead_name}</p>
            <p>Mobile no: {cleanOrder.mobile_number}</p>

            <h4>Product Details</h4>
            {productData.map((item) => (
              <p key={item.product_id}>{item.product_id} - {item.product_name}</p>
            ))}

            <h4>Delivery Details</h4>
            <p>Address: {cleanOrder.address}</p>
            <p>District: {cleanOrder.district}</p>
            <p>State: {cleanOrder.state}</p>
            <p>Courier: {cleanOrder.courier}</p>

            <h4>Package Details</h4>
            <p>Package type: {cleanOrder.stick_type}</p>
          </div>

          <div className="order-modal-section">
            <h4>Payment Details</h4>
            <p>Order value: ₹{cleanOrder.order_value}</p>
            <p>Discount: ₹{cleanOrder.discount}</p>
            <p>Approved by: {cleanOrder.approved_by}</p>
            <p>Courier charge: ₹{cleanOrder.courier_charge}</p>
            <p>GST No: {cleanOrder.gst_no}</p>
            <p>HSN: {cleanOrder.hsn}</p>
            <p>GST ({cleanOrder.gst_percent}): ₹{cleanOrder.gst_amount}</p>
            <p><strong>Total value: ₹{cleanOrder.total_value}</strong></p>
            <p>Payment type: {cleanOrder.payment_mode}</p>
            <p>Transaction ID: {cleanOrder.transaction_id}</p>
            <p>Date: {cleanOrder.payment_date}</p>
            <p>Receipt:</p>
            <img src={cleanOrder.receipt_image_url} alt="Payment Receipt" className="order-modal-receipt" />

            {type === "view" && (
              <div className="order-modal-actions">
                <button className="order-btn-decline" onClick={()=> putActionForApproval("Decline") }>Decline</button>
                <button className="order-btn-approve" onClick={()=> putActionForApproval("Approved")}>Approve</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailModal;
