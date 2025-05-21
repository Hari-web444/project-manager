import {useState} from 'react';
import PropTypes from "prop-types";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import configModule from '../../../config.js';
import './stocks.css';
function Addstock({ onClose,getstock}) {
 const config = configModule.config();
 const [loading, setLoading] = useState(false);

 const [formData, setFormData] = useState({
  stock_product_id: '',
  stock_quantity:'',
  min_stock_qty:'',
});

 const handlesave = async () => {
    if (!formData.stock_product_id || !formData.stock_quantity || !formData.min_stock_qty) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        stock_product_id: formData.stock_product_id,
        stock_quantity: parseInt(formData.stock_quantity),
        min_stock_qty: parseInt(formData.min_stock_qty),
      };
      const response = await axios.post(`${config.apiBaseUrl}addstocks`, payload);
      if (response.status === 200) {
        toast.success("Stock added successfully");
        setTimeout(() => {
          onClose();
          getstock();
        }, 2000);
      } else {
        toast.error(`Add failed: ${response.data.message}`);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong while Adding";
      console.error("Error:", error);
      toast.error(`⚠️ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="product-modal-overlay">
      <div className="inventry-modal-view">
        <div className="inventry-modal-header ">
          <h5 className="mb-0 inventry-view-header">Add product</h5>
        </div>
        <div className="inventry-modal-body">
       
       <div className="d-flex  mt-3">  
          <div className="col-6 " style={{display:"flex",alignItems:"center"}}><h6 className="inventry-body-header-txt">Product ID</h6></div>
          <div className="col-6 ">
            <input  type="text"  className="iventry-form-controle" name="stock_product_id"  value={formData.stock_product_id}
                onChange={(e) => {
                const value = e.target.value.toUpperCase();
                const allowed = /^[A-Z0-9]*$/;
                if (allowed.test(value)) {
                setFormData({ ...formData, stock_product_id: value });
                }
            }} placeholder="Enter product id"/>
          </div>
        </div> 
        <div className="d-flex  mt-3">  
          <div className="col-6 " style={{display:"flex",alignItems:"center"}}><h6 className="inventry-body-header-txt">Quantity</h6></div>
          <div className="col-6 ">
            <input  type="number" min="0" className="iventry-form-controle" name="stock_quantity"  value={formData.stock_quantity}
             onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })} placeholder="Enter the quantity"/>
          </div>
        </div> 
         
      
          <div className="d-flex  mt-3">  
          <div className="col-6 " style={{display:"flex",alignItems:"center"}}><h6 className="inventry-body-header-txt">Minimum stock quantity</h6></div>
          <div className="col-6 ">
            <input  type="number" min="0" className="iventry-form-controle" name="min_stock_qty"  value={formData.min_stock_qty}
             onChange={(e) => setFormData({ ...formData, min_stock_qty: e.target.value })} placeholder="Enter min_stock_qty"/>
          </div>
        </div>   
        </div>
        <div className="inventry-modal-body">
            <div className="iventry-modal-footer mt-4">
              <button className="cancel-button" onClick={onClose} >Cancel</button>
              <button className="inventry-update-btn" disabled={loading}  onClick={handlesave}> {loading ? "Adding..." : "Add"}</button>
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

Addstock.propTypes = {
   onClose: PropTypes.func.isRequired,
   getstock: PropTypes.func.isRequired,
};
export default Addstock;
