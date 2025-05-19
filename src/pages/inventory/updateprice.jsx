import React,{useState,useEffect} from 'react';
import PropTypes from "prop-types";
import "./inventory.css";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import configModule from '../../../config.js';
function UpdatePrice({ products,onClose,getproduct}) {
 const config = configModule.config();
 const [loading, setLoading] = useState(false);

 const [formData, setFormData] = useState({
  quantity: '',
  selling_price: ''
});

const handleUpdate = async () => {
  setLoading(true);
  try {
    const response = await axios.put(
      `${config.apiBaseUrl}productinventry/${products?.product_recid}`,
      {
        quantity: parseInt(formData.quantity),
        selling_price: parseFloat(formData.selling_price)
      }
    );
    if (response.data.success) {
      toast.success("Product updated successfully");
    setTimeout(() => {
       onClose();
       getproduct();
    }, 2000);
    } else {
      toast.error(`Update failed: ${response.data.message}`);
    }
  } catch (error) {
    console.error("Error updating product:", error);
    toast.error("⚠️ Something went wrong while updating");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (products) {
      setFormData({
        quantity: '',
        selling_price: products?.selling_price?.toString() || ''
      });
    }
  }, [products]);

  return (
    <div className="product-modal-overlay">
      <div className="inventry-modal-view">
        <div className="inventry-modal-header ">
          <h5 className="mb-0 inventry-view-header"> Add Quantity</h5>
        </div>
        <div className="inventry-modal-body">
        <div className="d-flex  mt-3">  
          <div className="col-6 "><h6 className="inventry-body-header-txt">Product ID</h6></div>
          <div className="col-6 "><p className="inventry-body-p-txt mb-0">{products?.product_id}</p></div>
        </div>
        <div className="d-flex  mt-3">  
          <div className="col-6 "><h6 className="inventry-body-header-txt">Product Name</h6></div>
          <div className="col-6 "><p className="inventry-body-p-txt mb-0">{products?.product_name}</p></div>
        </div>
          <div className="d-flex  mt-4">  
          <div className="col-6 "><h6 className="inventry-body-header-txt">Last update</h6></div>
          <div className="col-6 "><p className="inventry-body-p-txt mb-0">{products?.updated_at ? new Date(products.updated_at).toISOString().split('T')[0] : '--'}</p></div>
        </div>
          <div className="d-flex  mt-4">  
          <div className="col-6 "><h6 className="inventry-body-header-txt"> Last Updated Qty</h6></div>
          <div className="col-6 "><p className="inventry-body-p-txt mb-0">{products?.quantity} {products?.units}</p></div>
        </div>
          <div className="d-flex  mt-4">  
          <div className="col-6 "><h6 className="inventry-body-header-txt">Selling price</h6></div>
          <div className="col-6 "><p className="inventry-body-p-txt mb-0">₹{products?.selling_price}</p></div>
        </div>
          <div className="d-flex justify-content-center align-items-center mt-4 mb-4">
            <p className="hr-iventory mb-0" />
        </div>
          <div className="d-flex  mt-3">  
          <div className="col-6 " style={{display:"flex",alignItems:"center"}}><h6 className="inventry-body-header-txt">Quantity</h6></div>
          <div className="col-6 ">
            <input  type="number" min="0" className="iventry-form-controle" name="quantity"  value={formData.quantity}
             onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} placeholder="Enter quantity"/>
          </div>
        </div>
        <div className="d-flex  mt-3">  
          <div className="col-6 " style={{display:"flex",alignItems:"center"}}><h6 className="inventry-body-header-txt">Selling pricey</h6></div>
          <div className="col-6 " >
            <input  type="number" min="0" className="iventry-form-controle" name="selling_price"   
            value={formData.selling_price}
            onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
            placeholder="Enter Buying price"/>
          </div>
        </div>
        </div>
        <div className="inventry-modal-body">
            <div className="iventry-modal-footer mt-4">
              <button className="cancel-button" onClick={onClose} >Cancel</button>
              <button className="inventry-update-btn" disabled={loading}  onClick={handleUpdate}> {loading ? "Updating..." : "Update"}</button>
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

UpdatePrice.propTypes = {
   onClose: PropTypes.func.isRequired,
  products: PropTypes.func.isRequired,
   getproduct: PropTypes.func.isRequired,
};
export default UpdatePrice;
