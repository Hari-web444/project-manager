import React from 'react';

function OrderDetailModal({ order, onClose, type }) {
  if (!order) return null;

  // Safely map and assign defaults
  const cleanOrder = {
    lead_id: order?.lead_id || 'N/A',
    created_at: order?.created_at || 'N/A',
    client_id: order?.client_id || 'VPC01',
    lead_name: order?.lead_name || 'N/A',
    mobile_number: order?.mobile_number || 'N/A',
    address: order?.address || 'Address',
    district: order?.district || 'District',
    state: order?.state || 'State',
    courier_name: order?.courier_name || 'Courier name',
    package_type: order?.package_type || 'Without label',
    order_value: order?.order_value || '6200',
    discount: order?.discount || '200',
    approved_by: order?.approved_by || 'Name',
    courier_charge: order?.courier_charge || '60',
    gst_no: order?.gst_no || 'XXXXXXXX',
    hsn: order?.hsn || 'XXXXXXXX',
    gst_percent: order?.gst_percent || 'X%',
    gst_amount: order?.gst_amount || 'XX',
    total_value: order?.total_value || '6060',
    payment_type: order?.payment_type || 'UPI',
    transaction_id: order?.transaction_id || 'XXXXXXXXXX',
    payment_date: order?.payment_date || 'Date',
    receipt_url: order?.receipt_url || 'https://i.imgur.com/6IUbEMV.png',
  };

  return (
    <div className="order-modal-overlay">
      <div className="order-modal-container">
        {type === "view" && (<button className="order-modal-close" onClick={onClose}>×</button>)}
        <div className="order-modal-grid">
          <div className="order-modal-section">
            <h4>Order Details</h4>
            <p>Order ID: {cleanOrder.lead_id}</p>
            <p>Order date: {cleanOrder.created_at}</p>

            <h4>Client Details</h4>
            <p>Client ID: {cleanOrder.client_id}</p>
            <p>Name: {cleanOrder.lead_name}</p>
            <p>Mobile no: {cleanOrder.mobile_number}</p>

            <h4>Product Details</h4>
            <p>VPP01 - Tablet: 2 box - ₹XXX * 2</p>
            <p>VPP02 - Lagiyam: 1 box - ₹XXX * 1</p>
            <p>VPP03 - Kuliyal podi: 1 box - ₹XXX * 1</p>

            <h4>Delivery Details</h4>
            <p>Address: {cleanOrder.address}</p>
            <p>District: {cleanOrder.district}</p>
            <p>State: {cleanOrder.state}</p>
            <p>Courier: {cleanOrder.courier_name}</p>

            <h4>Package Details</h4>
            <p>Package type: {cleanOrder.package_type}</p>
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
            <p>Payment type: {cleanOrder.payment_type}</p>
            <p>Transaction ID: {cleanOrder.transaction_id}</p>
            <p>Date: {cleanOrder.payment_date}</p>
            <p>Receipt:</p>
            <img src={cleanOrder.receipt_url} alt="Payment Receipt" className="order-modal-receipt" />

            {type === "view" && (
              <div className="order-modal-actions">
                <button className="order-btn-decline">Decline</button>
                <button className="order-btn-approve">Approve</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailModal;
