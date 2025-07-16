import React, { useState, useEffect } from "react";
import { PropagateLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useLocation } from "react-router-dom";
import configModule from '../../../config.js';
import axios from 'axios';
import { useAuth } from '../../components/context/Authcontext.jsx';
import CommonSelect from "../../components/common-select.jsx";
import SvgContent from '../../components/svgcontent.jsx';
import DatePicker from 'react-datepicker';

const OrderForm = () => {
    const { user } = useAuth();
    const userId = user?.userId;
    const [needLoading, setNeedLoading] = useState(false);
    const [isStickerShown, setIsStickerShown] = useState(false);
    const [aDBranchData, setADBranchData] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { leadData, selectedProducts, totalAmount, catagory_id } = location.state || {};
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
    const [stickType, setStickType] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [courier, setCourier] = useState("");
    const [discount, setDiscount] = useState("");
    const config = configModule.config();
    const [orderId, setOrderId] = useState("VPO001");
    const CourierType = [
        { label: "DTDC", value: "DTDC" },
        { label: "India Post", value: "India Post" },
        { label: "MSS", value: "MSS" },
        { label: "Professional", value: "Professional" },
        { label: "ST", value: "ST" },
        { label: "Others", value: "Others" },
    ];

    const StickerTypes = [
        { label: "With sticker", value: "With sticker" },
        { label: "No sticker", value: "No sticker" }
    ];

    useEffect(() => {
        const fetchOrderId = async () => {
            try {
                const res = await axios.get(`${config.apiBaseUrl}getLatestOrderId`);
                setOrderId(res.data.nextOrderId);
            } catch (err) {
                toast.error("Failed to fetch Order ID", err);
            }
        };

        fetchOrderId();
    }, []);

    useEffect(() => {
        const getADBranchList = async () => {
            try {
                const response = await axios.post(`${config.apiBaseUrl}getADBranchList`, {
                    userId: userId
                });

                const result = response.data;

                if (response.status === 200) {
                    setADBranchData(result.data);

                } else {
                    toast.error("Failed to fetch admin's list: " + result.message);
                }
            } catch (error) {
                toast.error("Error fetching admin's list: " + (error.response?.data?.message || error.message));
            } finally {
                setNeedLoading(false);
            }
        };

        if (userId) {
            getADBranchList();
        }
    }, [userId]);

    const HeadOptions = Array.isArray(aDBranchData)
        ? aDBranchData.map(item => ({
            label: item.emp_id + " - " + item.label,
            value: item.value
        }))
        : [];

    const MedicOptions = [
        { label: "15 Days", value: "15 Days" },
        { label: "1 months", value: "1 months" },
        { label: "2 months", value: "2 months" },
        { label: "3 months", value: "3 months" },
        { label: "6 months", value: "6 months" },
        { label: "1 year", value: "1 year" },
        { label: "Others", value: "Others" },
    ];

    const handleCheckboxChange = () => {
        setDirectPickup(!directPickup);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setImage(file);
        } else {
            toast.error('Please upload a valid JPEG or PNG image.');
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
    };

    const formatDateTime = (date) => {
        if (!date) return "";
        const pad = (n) => n.toString().padStart(2, '0');

        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleSubmit = async () => {
        setNeedLoading(true);
    
        const recIds = selectedProducts.map(item => item.rec_id).join(',');
        const qauntity = selectedProducts.reduce((sum, item) => sum + item.qty, 0);
    
        const formData = new FormData();
        formData.append("leads_id", leadData?.lead_id);
        formData.append("direct_pickup", directPickup ? "1" : "0");
        formData.append("additional_number", additionalNumber);
        formData.append("address", address);
        formData.append("district", district);
        formData.append("state", state);
        formData.append("country", country);
        formData.append("courier", courier?.value || courier);
        formData.append("order_id", orderId);
        formData.append("order_value", totalAmount);
        formData.append("discount", discount);
        formData.append("approved_by", approvedBy?.value || approvedBy);
        formData.append("payment_mode", paymentMode);
        formData.append("wallet", 0);
        formData.append("total_value", totalAmount - (parseFloat(discount || 0) || 0));
        formData.append("amount_to_pay", totalAmount);
        formData.append("medication_period", medicationPeriod?.value || medicationPeriod);
        formData.append("transaction_id", transactionId);
        formData.append("date_time", formatDateTime(dateTime));
        formData.append("catagory_id", catagory_id);
        formData.append("quantity", qauntity);
        formData.append("rec_id", recIds);
        formData.append("user_id", userId);
        formData.append("stick_type", stickType?.value || stickType);
        formData.append("folder", "payment");
    
        // Append image if present
        if (image) {
            formData.append("receipt_image_url", image);
        }
    
        // Append selectedProducts as JSON string
        formData.append("products", JSON.stringify(selectedProducts));
    
        try {
            const res = await axios.post(`${config.apiBaseUrl}insertSalesOrder`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            if (res.status === 200) {
                toast.success("Order placed successfully");
                setTimeout(() => {
                    navigate("/leads");
                }, 2000);
            } else {
                toast.error("Failed to place order");
            }
        } catch (err) {
            toast.error("Error while placing order", err?.response?.data?.message || err.message);
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
                                <label className="display-flex mb-0">Direct pickup</label>
                                <div className="checkbox-wrapper commcb-select-of">
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

                            <div className="commonst-select mb-3">
                                <label htmlFor="categoryInput" className="form-label">Mobile number</label>
                                <div className="commcb-select-of position-relative">
                                    <input
                                        type="text"
                                        placeholder="Enter additional mobile number"
                                        disabled={directPickup}
                                        value={additionalNumber}
                                        onChange={(e) => setAdditionalNumber(e.target.value)}
                                        className="form-control-st  mb-3"
                                    />
                                </div>
                            </div>

                            <div className="commonst-select mb-3">
                                <label htmlFor="categoryInput" className="form-label">Address</label>
                                <div className="commcb-select-of position-relative">
                                    <textarea
                                        placeholder="Enter address"
                                        disabled={directPickup}
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="form-control-st  mb-3"
                                    />
                                </div>
                            </div>

                            <div className="commonst-select mb-3">
                                <label htmlFor="categoryInput" className="form-label">District</label>
                                <div className="commcb-select-of position-relative">
                                    <input
                                        type="text"
                                        placeholder="Enter district"
                                        disabled={directPickup}
                                        value={district}
                                        onChange={(e) => setDistrict(e.target.value)}
                                        className="form-control-st  mb-3"
                                    />
                                </div>
                            </div>

                            <div className="commonst-select mb-3">
                                <label htmlFor="categoryInput" className="form-label">State</label>
                                <div className="commcb-select-of position-relative">
                                    <input
                                        type="text"
                                        placeholder="Enter state"
                                        disabled={directPickup}
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        className="form-control-st  mb-3"
                                    />
                                </div>
                            </div>

                            <div className="commonst-select mb-3">
                                <label htmlFor="categoryInput" className="form-label">State</label>
                                <div className="commcb-select-of position-relative">
                                    <input
                                        type="text"
                                        placeholder="Enter country"
                                        disabled={directPickup}
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="form-control-st  mb-3"
                                    />
                                </div>
                            </div>

                            <div className="commonst-select mb-3">
                                <label htmlFor="categoryInput" className="form-label">Courier</label>
                                <div className="commcb-select-of position-relative">
                                    <CommonSelect
                                        header="Select category"
                                        placeholder="Select category"
                                        name="type"
                                        value={courier}
                                        onChange={setCourier}
                                        options={CourierType}
                                        disabled={directPickup}
                                    />
                                </div>
                            </div>

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
                                <div className="value">₹ {totalAmount}</div>

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
                                    <CommonSelect
                                        header="Select head"
                                        placeholder="Select head"
                                        name="admin"
                                        value={approvedBy}
                                        onChange={setApprovedBy}
                                        options={HeadOptions}
                                        disabled={directPickup}
                                    />
                                </div>

                                <div className="label">{directPickup ? 'Payment mode' : 'Courier amount'}</div>
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
                                <div className="value">₹ {totalAmount - (parseFloat(discount || 0) || 0) + (!directPickup && paymentMode > 0 ? parseFloat(paymentMode) : 0 )}</div>

                                <div className="label">
                                    Amount to pay <br />
                                    <small>(include delivery + 18% gst - wallet)</small>
                                </div>
                                <div className="value">₹ {totalAmount - (parseFloat(discount || 0) || 0)} *</div>

                                <div className="label">
                                    Medication period <br />
                                    <small>(select prescribed duration)</small>
                                </div>
                                <div className="value">
                                    <CommonSelect
                                        header="Select head"
                                        placeholder="Select head"
                                        name="admin"
                                        value={medicationPeriod}
                                        onChange={setMedicationPeriod}
                                        options={MedicOptions}
                                        disabled={directPickup}
                                    />
                                </div>
                            </div>

                            <div className={`upload-receipt-container ${!isRightEditable ? "disabled-section" : ""}`} >
                                <h4 className="upload-title">Upload receipt</h4>
                                <p className="upload-subtext">
                                    Collect screenshot from client and upload to place the order
                                </p>

                                <label htmlFor="imageUpload" className="upload-box">
                                    <input
                                        type="file"
                                        id="imageUpload"
                                        onChange={handleImageChange}
                                        accept="image/jpeg, image/png"
                                        hidden
                                    />
                                    <SvgContent svg_name="btn_upload" stroke="#0B622F" style={{ zIndex: "999" }} />
                                    <span style={{ color: "#121212", zIndex: "0" }}>Upload image</span>
                                </label>

                                {image && <p className="uploaded-file">Selected: {image.name}</p>}

                                <div className="form-row">
                                    <label>Transaction ID</label>
                                    <input
                                        type="text"
                                        className="form-control-st commcb-select-of"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        placeholder=""
                                    />
                                </div>

                                <div className="form-row">
                                    <label htmlFor="datetime" style={{ minWidth: "112px" }}>Date and time</label>
                                    <DatePicker
                                        selected={dateTime}
                                        onChange={(date) => setDateTime(date)}
                                        placeholderText="dd/mm/yyyy"
                                        className="form-control-st datpick-select-of"
                                        dateFormat="dd-MM-yyyy"
                                    />
                                </div>

                                <button
                                    className="place-order-btn"
                                    onClick={() => setIsStickerShown(true)}
                                    disabled={!isRightEditable}
                                >
                                    Place Order
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isStickerShown && (
                <div className="modal-overlay modal-overlay-position">
                    <div className="modal-container">
                        <div className="modal-header mb-3">
                            <h5 className="mb-0 add-new-hdr">Package type</h5>
                        </div>
                        <div className="modal-body mb-2">
                            <div className="container commonst-select mb-4">
                                <p className="mb-0" style={{ minWidth: "120px" }}>Select type</p>
                                <CommonSelect
                                    header="Select type"
                                    placeholder="Select type"
                                    name="type"
                                    value={stickType}
                                    onChange={setStickType}
                                    options={StickerTypes}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="cancel-button" onClick={() => setIsStickerShown(false)}>No</button>
                            <button className="next-button" onClick={handleSubmit} >Yes</button>
                        </div>
                    </div>
                </div>
            )}

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
