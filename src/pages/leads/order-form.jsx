import React, { useState, useEffect } from "react";
import { PropagateLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useLocation } from "react-router-dom";
import configModule from '../../../config.js';
import axios from 'axios';
import { useAuth } from '../../components/context/Authcontext.jsx';

const OrderForm = () => {
    const { user } = useAuth();
    const userId = user?.userId;
    const [needLoading, setNeedLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { leadData, selectedProducts, totalAmount , catagory_id } = location.state || {};
    const [directPickup, setDirectPickup] = useState(false);
    const [approvedBy, setApprovedBy] = useState("");
    const [paymentMode, setPaymentMode] = useState("");
    const [medicationPeriod, setMedicationPeriod] = useState("1 month");
    const [image, setImage] = useState(null);
    const [transactionId, setTransactionId] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [isRightEditable, setIsRightEditable] = useState(false);
    const [additionalNumber, setAdditionalNumber] = useState("");
    const [address, setAddress] = useState("");
    const [district, setDistrict] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [courier, setCourier] = useState("");
    const [discount, setDiscount] = useState("");
    const config = configModule.config();
    const [orderId, setOrderId] = useState("VPO001");

    useEffect(() => {
        const fetchOrderId = async () => {
            try {
                const res = await axios.get(`${config.apiBaseUrl}getLatestOrderId`);
                setOrderId(res.data.nextOrderId);
            } catch (err) {
                toast.error("Failed to fetch Order ID");
            }
        };
        fetchOrderId();
    }, []);


    const handleCheckboxChange = () => {
        setDirectPickup(!directPickup);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const uploadReceiptImage = async () => {
        if (!image) return null;

        const formData = new FormData();
        formData.append("file", image);

        try {
            const res = await axios.post(`${config.apiBaseUrl}uploadReceiptImage`, formData);
            return res.data.imageUrl; // adjust as per API response
        } catch (err) {
            toast.error("Image upload failed");
            return null;
        }
    };


    const handleSubmit = async () => {
        setNeedLoading(true);

        let receiptImageUrl = await uploadReceiptImage(); // optional
        const recIds = selectedProducts.map(item => item.rec_id).join(',');
        const qauntity = selectedProducts.reduce((sum, item) => sum + item.qty, 0);

        const payload = {
            leads_id: leadData?.lead_id,
            direct_pickup: directPickup ? 1 : 0,
            additional_number: additionalNumber,
            address,
            district,
            state,
            country,
            courier,
            order_id : orderId,
            order_value: totalAmount, // or base value
            discount,
            approved_by: approvedBy,
            payment_mode: paymentMode,
            wallet: 0, // assume zero or add logic
            total_value: totalAmount - (parseFloat(discount || 0) || 0),
            amount_to_pay: totalAmount, // if GST/delivery added, update
            medication_period: medicationPeriod,
            receipt_image_url: receiptImageUrl || "", // optional
            transaction_id: transactionId,
            date_time: dateTime,
            products: selectedProducts,
            catagory_id: catagory_id,
            quantity: qauntity,
            rec_id: recIds || '',
            user_id: userId
        };

        try {
            const res = await axios.post(`${config.apiBaseUrl}insertSalesOrder`, payload);

            if (res.status === 200) {
                toast.success("Order placed successfully");
                navigate("/leads");
            } else {
                toast.error("Failed to place order");
            }
        } catch (err) {
            toast.error("Error while placing order");
        } finally {
            setNeedLoading(false);
        }
    };


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
            <div className='header-cart-st'>
                <div>
                    <p className='mb-0 fw-medium'>Add to cart</p>
                    <div>
                        <button className='mb-0 nav-btn-top' onClick={() => navigate("/leads")}>
                            Leads &gt; List
                        </button>&nbsp;
                        <p className='mb-0 nav-btn-top'>
                            &gt; cart
                        </p>
                    </div>
                </div>
            </div>

            <div className='body-div-el'>
                <div className="w-100 h-100 body-odrform-st">
                    <div className="w-50 h-100 bg-white overflow-auto" style={{ borderRadius: "12px" }}>
                        <div className="border rounded p-3 bg-white">
                            <div className="client-details-container">
                                <h4 className="section-title">Client details</h4>
                                <div className="details-grid">
                                    <div className="detail-label">Customer ID</div>
                                    <div className="detail-value">{leadData?.lead_id}</div>

                                    <div className="detail-label">Name</div>
                                    <div className="detail-value">{leadData?.lead_name}</div>

                                    <div className="detail-label">Age</div>
                                    <div className="detail-value">{leadData?.age}</div>

                                    <div className="detail-label">Gender</div>
                                    <div className="detail-value">{leadData?.gender}</div>

                                    <div className="detail-label">Phone</div>
                                    <div className="detail-value">{leadData?.mobile_number}</div>

                                    <div className="detail-label">Email</div>
                                    <div className="detail-value">{leadData?.email}</div>
                                </div>
                            </div>
                        </div>

                        <div className="delivery-form-container">
                            <h4 className="delivery-title">
                                <u>Delivery details</u>
                            </h4>

                            <div className="form-row">
                                <label>Direct pickup</label>
                                <div className="checkbox-wrapper">
                                    <input
                                        type="checkbox"
                                        checked={directPickup}
                                        onChange={handleCheckboxChange}
                                        id="directPickup"
                                    />
                                    <label htmlFor="directPickup" className="checkbox-label mb-0">
                                        Click if customer request direct pickup
                                    </label>
                                </div>
                            </div>

                            <input
                                type="text"
                                placeholder="Enter additional mobile number"
                                disabled={directPickup}
                                value={additionalNumber}
                                onChange={(e) => setAdditionalNumber(e.target.value)}
                                className="form-control-st  mb-3"
                            />

                            <textarea
                                placeholder="Enter address"
                                disabled={directPickup}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="form-control-st  mb-3"
                            />

                            <input
                                type="text"
                                placeholder="Enter district"
                                disabled={directPickup}
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                className="form-control-st  mb-3"
                            />

                            <input
                                type="text"
                                placeholder="Enter state"
                                disabled={directPickup}
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className="form-control-st  mb-3"
                            />

                            <input
                                type="text"
                                placeholder="Enter country"
                                disabled={directPickup}
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="form-control-st  mb-3"
                            />

                            <select
                                disabled={directPickup}
                                className="form-control-st  mb-3"
                                value={courier}
                                onChange={(e) => setCourier(e.target.value)}
                            >
                                <option value="">Select courier</option>
                                <option value="BlueDart">BlueDart</option>
                                <option value="DTDC">DTDC</option>
                                <option value="India Post">India Post</option>
                            </select>

                            <div className="form-actions">
                                <button className="cancel-btn">Cancel</button>
                                <button
                                    className="save-btn"
                                    onClick={() => {
                                        if (directPickup) {
                                            setIsRightEditable(true);
                                        } else {
                                            if (
                                                !additionalNumber ||
                                                !address ||
                                                !district ||
                                                !state ||
                                                !country ||
                                                !courier
                                            ) {
                                                toast.warning("Please fill all delivery details before saving.");
                                                return;
                                            }
                                            setIsRightEditable(true);
                                        }
                                    }}
                                >
                                    Save
                                </button>

                            </div>
                        </div>
                    </div>
                    <div className="w-50 h-100 bg-white overflow-auto" style={{ borderRadius: "12px" }}>
                        <div className="payment-container">
                            <h4 className="payment-title">Payment receipt</h4>

                            <div
                                className={`payment-grid ${!isRightEditable ? "disabled-section" : ""}`}
                            >
                                <div className="label">Order ID</div>
                                <div className="value highlight">{orderId}</div>

                                <div className="label">Order value</div>
                                <div className="value">₹ {totalAmount - (parseFloat(discount || 0) || 0)}</div>

                                <div className="label">Discount</div>
                                <div className="value">
                                    <input
                                        type="text"
                                        placeholder="Discount amount"
                                        className="form-control-st"
                                        value={discount}
                                        onChange={(e) => setDiscount(e.target.value)}
                                    />
                                </div>

                                <div className="label">
                                    Approved by <br />
                                    <small>(person who approved discount)</small>
                                </div>
                                <div className="value">
                                    <select
                                        value={approvedBy}
                                        className="form-control-st"
                                        onChange={(e) => setApprovedBy(e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        <option value="admin1">Admin 1</option>
                                        <option value="admin2">Admin 2</option>
                                    </select>
                                </div>

                                <div className="label">Payment mode</div>
                                <div className="value">
                                    <input
                                        type="text"
                                        className="form-control-st"
                                        placeholder="Enter payment mode"
                                        value={paymentMode}
                                        onChange={(e) => setPaymentMode(e.target.value)}
                                    />
                                </div>

                                <div className="label">Wallet</div>
                                <div className="value">₹ 0</div>

                                <div className="label">Total value</div>
                                <div className="value">₹ 0</div>

                                <div className="label">
                                    Amount to pay <br />
                                    <small>(include delivery + 18% gst - wallet)</small>
                                </div>
                                <div className="value">₹ 0 *</div>

                                <div className="label">
                                    Medication period <br />
                                    <small>(select prescribed duration)</small>
                                </div>
                                <div className="value">
                                    <select
                                        value={medicationPeriod}
                                        className="form-control-st"
                                        onChange={(e) => setMedicationPeriod(e.target.value)}
                                    >
                                        <option value="1 month">1 month</option>
                                        <option value="2 months">2 months</option>
                                        <option value="3 months">3 months</option>
                                    </select>
                                </div>
                            </div>

                            <div className="upload-receipt-container">
                                <h4 className="upload-title">Upload receipt</h4>
                                <p className="upload-subtext">
                                    Collect screenshot from client and upload to place the order
                                </p>

                                <label htmlFor="receipt-upload" className="upload-box">
                                    <input
                                        type="file"
                                        id="receipt-upload"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        hidden
                                    />
                                    <span>📤 Upload image</span>
                                </label>

                                {image && <p className="uploaded-file">Selected: {image.name}</p>}

                                <div className="form-row">
                                    <label>Transaction ID</label>
                                    <input
                                        type="text"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        placeholder=""
                                    />
                                </div>

                                <div className="form-row">
                                    <label>Date and time</label>
                                    <input
                                        type="datetime-local"
                                        value={dateTime}
                                        onChange={(e) => setDateTime(e.target.value)}
                                    />
                                </div>

                                <button
                                    className="place-order-btn"
                                    onClick={handleSubmit}
                                    disabled={!isRightEditable}
                                >
                                    Place Order
                                </button>

                            </div>
                        </div>
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
};

export default OrderForm;
