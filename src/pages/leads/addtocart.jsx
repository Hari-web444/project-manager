import React, { useState, useEffect } from 'react';
import { PropagateLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import '../../assets/styles/addtocard.css';
import CommonSelect from "../../components/common-select.jsx";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import configModule from '../../../config.js';
import SvgContent from '../../components/svgcontent.jsx';

function AddToCart() {
    const location = useLocation();
    const navigate = useNavigate();
    const config = configModule.config();

    const categoryList = location?.state?.catagory || [];
    const rowData = location?.state?.selectedData || [];

    const [needLoading, setNeedLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [productList, setProductList] = useState([]);
    const [quantities, setQuantities] = useState([]);

    const TypeOptions = Array.isArray(categoryList)
        ? categoryList.map(item => ({
            label: item.category_name,
            value: item.category_id
        }))
        : [];

    useEffect(() => {
        if (productList.length > 0) {
            setQuantities(Array(productList.length).fill(0));
        }
    }, [productList]);

    const initialSelectedType = TypeOptions.find(
        (option) => option.label?.toLowerCase() === rowData?.category?.toLowerCase()
    );

    const [type, setType] = useState(initialSelectedType?.value || null);

    const handleQuantityChange = (index, delta) => {
        const newQuantities = [...quantities];
        newQuantities[index] = Math.max(0, newQuantities[index] + delta);
        setQuantities(newQuantities);
    };

    const getAllProducts = async () => {
        setNeedLoading(true);
        try {
            const response = await axios.post(`${config.apiBaseUrl}getAllProductListSale`, {
                type: type?.target?.name || initialSelectedType?.label
            });

            const result = response.data;

            if (response.status === 200) {
                setProductList(result.data);
            } else {
                toast.error("Failed to fetch product list: " + result.message);
            }
        } catch (error) {
            toast.error("Error fetching product list: " + (error.response?.data?.message || error.message));
        } finally {
            setNeedLoading(false);
        }
    };

    useEffect(() => {
        getAllProducts();
    }, [type]);

    const selectedItems = productList
        .map((product, index) => ({
            rec_id: product.product_recid,
            id: product.product_id,
            name: product.product_name,
            qty: quantities[index],
            price: product.selling_price
        }))
        .filter((item) => item.qty > 0);

    const totalAmount = selectedItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const handleProceed = () => {
        navigate("/leads/add-to-card/order-form", {
            state: {
                leadData: rowData,
                selectedProducts: selectedItems,
                totalAmount: totalAmount,
                catagory_id: type?.target?.value || type
            }
        });
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
                        </button> &nbsp;&gt;&nbsp;
                        <p className='mb-0 nav-btn-top'>
                            {rowData.lead_id} &gt;  cart
                        </p>
                    </div>
                </div>

                <div className='rightcorn-ts-st'>
                    <div className="display-flex-st gap-2">
                        <h6 className='mb-0'>Category</h6>
                        <div style={{ width: "calc(100% - 72px)" }}>
                            <CommonSelect
                                header="Select catagory"
                                placeholder="Select catagory"
                                name="catagory"
                                value={type}
                                onChange={setType}
                                options={TypeOptions}
                            />
                        </div>
                    </div>
                    <input
                        type="text"
                        placeholder="Search"
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className='body-div-el'>
                <div className="container-fluid overflow-auto d-flex gap-3 p-3 w-100 h-100">
                    {/* Product List */}
                    <div style={{ width: "50%" }}>
                        <div className='addcart-table'>
                            <div className='addcart-header-st'>
                                <div className='w-25 display-flex p-2 pt-3 pb-3'>Product ID</div>
                                <div className='w-25 display-flex p-2 pt-3 pb-3'>Product</div>
                                <div className='w-25 display-flex p-2 pt-3 pb-3'>Quantity</div>
                                <div className='w-25 display-flex p-2 pt-3 pb-3'>Amount</div>
                            </div>
                            {productList.map((product, index) => (
                                <div className='addcart-body-st' key={product.product_id}>
                                    <div className='w-25 display-flex text-center p-2 pt-3 pb-3 fw-semibold'>{product.product_id}</div>
                                    <div className='w-25 display-flex flex-column text-center p-2 pt-3 pb-3'>
                                        {product.product_img ? (<img src={product.imageUrl} alt="product" width="60" height="60" />)
                                            : (
                                                <SvgContent svg_name="no_image" />
                                            )}

                                        <div className='small'>
                                            <strong>{product.product_name}</strong><br />
                                            ₹ {product.selling_price} net weight<br />
                                            {product.form_factor} / {product.product_type}<br />
                                            {product.brand}
                                        </div>
                                    </div>
                                    <div className='w-25 display-flex text-center p-2 pt-3 pb-3'>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <button className="btncart-dec-st" onClick={() => handleQuantityChange(index, -1)}>-</button>
                                            <input
                                                type="text"
                                                value={quantities[index] ?? 0}
                                                readOnly
                                                className="form-control-st qty-inc-st text-center"
                                            />
                                            <button className="btncart-inc-st" onClick={() => handleQuantityChange(index, 1)}>+</button>
                                        </div>
                                    </div>
                                    <div className='w-25 display-flex text-center p-2 pt-3 pb-3'>
                                        {quantities[index] > 0 ? `₹ ${quantities[index] * product.selling_price}` : '₹ 0'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div style={{ width: "50%" }} className="overflow-auto border rounded bg-white">
                        <h5 className='mb-2 p-3 pb-0'>Order summary</h5>
                        <div className='rightside-carttab-st pe-3 ps-3'>
                            <div className='rightside-carthead-st'>
                                <div className='w-25 display-flex p-2'>Product ID</div>
                                <div className='w-25 display-flex p-2'>Product</div>
                                <div className='w-25 display-flex p-2'>Quantity</div>
                                <div className='w-25 display-flex p-2'>Amount</div>
                            </div>
                            <div className='rightside-cartbody-st'>
                                {selectedItems.map((item, index) => (
                                    <div key={item} className='d-flex align-items-center'>
                                        <div className='w-25 text-center display-flex p-2' >{item.id}</div>
                                        <div className='w-25 text-center display-flex p-2' >{item.name}</div>
                                        <div className='w-25 text-center display-flex p-2' >{item.qty} (net wt)</div>
                                        <div className='w-25 text-center display-flex p-2' >₹ {item.qty * item.price}</div>
                                    </div>
                                ))}
                            </div>
                            <div className='rightside-cartfoot-st'>
                                <div className='total-amountcart-st'>
                                    <strong>Total amount</strong>
                                    <p className='mb-0'>₹ {totalAmount}</p>
                                </div>
                                <button className='btn-proceed-st' onClick={handleProceed}>
                                    Proceed
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
}

export default AddToCart;
