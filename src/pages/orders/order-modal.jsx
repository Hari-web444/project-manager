import React from 'react';

function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  const {
    lead_id = 'N/A',
    created_at = 'N/A',
    client_id = 'VPC01',
    lead_name = 'N/A',
    mobile_number = 'N/A',
    address = 'Address',
    district = 'District',
    state = 'State',
    courier_name = 'Courier name',
    package_type = 'Without label',
    order_value = '6200',
    discount = '200',
    approved_by = 'Name',
    courier_charge = '60',
    gst_no = 'XXXXXXXX',
    hsn = 'XXXXXXXX',
    gst_percent = 'X%',
    gst_amount = 'XX',
    total_value = '6060',
    payment_type = 'UPI',
    transaction_id = 'XXXXXXXXXX',
    payment_date = 'Date',
    receipt_url = 'https://i.imgur.com/6IUbEMV.png',
  } = order || {};

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="modal-grid">
          <div>
            <h4>Order Details</h4>
            <p>Order ID: {lead_id}</p>
            <p>Order date: {created_at}</p>

            <h4>Client Details</h4>
            <p>Client ID: {client_id}</p>
            <p>Name: {lead_name}</p>
            <p>Mobile no: {mobile_number}</p>

            <h4>Product Details</h4>
            <p>VPP01 - Tablet: 2 box - ₹XXX * 2</p>
            <p>VPP02 - Lagiyam: 1 box - ₹XXX * 1</p>
            <p>VPP03 - Kuliyal podi: 1 box - ₹XXX * 1</p>

            <h4>Delivery Details</h4>
            <p>Address: {address}</p>
            <p>District: {district}</p>
            <p>State: {state}</p>
            <p>Courier: {courier_name}</p>

            <h4>Package Details</h4>
            <p>Package type: {package_type}</p>
          </div>

          <div>
            <h4>Payment Details</h4>
            <p>Order value: ₹{order_value}</p>
            <p>Discount: ₹{discount}</p>
            <p>Approved by: {approved_by}</p>
            <p>Courier charge: ₹{courier_charge}</p>
            <p>GST No: {gst_no}</p>
            <p>HSN: {hsn}</p>
            <p>GST ({gst_percent}): ₹{gst_amount}</p>
            <p><strong>Total value: ₹{total_value}</strong></p>
            <p>Payment type: {payment_type}</p>
            <p>Transaction ID: {transaction_id}</p>
            <p>Date: {payment_date}</p>
            <p>Receipt:</p>
            <img src={receipt_url} alt="Payment Receipt" className="receipt-img" />

            <div className="modal-actions">
              <button className="decline-btn">Decline</button>
              <button className="approve-btn">Approve</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailModal;
