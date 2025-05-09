import React, { useState,useEffect } from 'react';
import './product.css';
import graterthen from '../../assets/images/graterthen.svg';
import commanuplodeicon from '../../assets/images/commanuplodeicon.svg'
import { Link } from 'react-router-dom';
import CommonSelect from "../../components/common-select.jsx";
import configModule from '../../../config.js';
function AddProducts() {
  const [file, setFile] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [productTypes, setProductTypes] = useState([]);
  const config = configModule.config();

    const fetchProductTypes = async () => {
     try {
       const response = await fetch(`${config.apiBaseUrl}getAllProductTypes`, {
         method: "GET",
         headers: {  "Content-Type": "application/json" }
       });
       const result = await response.json();
       if (response.ok) {
         setProductTypes(result.data?.length > 0 ? result.data : []);
       } else {
         toast.error("Failed to fetch designation list: " + result.message);
       }
     } catch (error) {
       toast.error("Error fetching designation list: " + error.message);
     }
   };
  useEffect(() => {
    fetchProductTypes();
  }, []);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPreviewUrl(null);
  };

  const handleUpload = () => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      console.log('Uploading:', file);
    }
  };

  const [formData, setFormData] = useState({
    productId: 'VPAREGCCAP001',
    productName: '',
    brand: '',
    productCategory: '',
    formFactor: '',
    packageQuantity: '',
    units: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  const [role, setRole] = useState(null);

  const roleOptions = [
    { value: "Manager", label: "Manager" },
    { value: "Developer", label: "Developer" },
    { value: "Designer", label: "Designer" },
  ];


  return (
    <div className='common-body-st'>
      <div className='header-container-products '>
        <div className=' header-product-el '>
          <div className="header-product-pvt">
            <h6 className="mt-0 mb-0 product-header-text">Add new product</h6>
            <div className="breadcrumb-container">
              <span className="breadcrumb-item"><Link className='productbacklink' to='/products'>Products</Link></span> <span className="breadcrumb-separator"> <img src={graterthen} alt='then' /> </span><span className="breadcrumb-item">Add new</span>
            </div>
          </div>
        </div>
        <div className="body-container-products-add ">
          <div className="row h-100">
            <div className="col-12 col-md-5 col-lg-5 h-100">
              <div className=" p-4 product-uplode-img ">
                <div style={{ height: "60px"}}>
                <h5>Product image</h5>
                </div>
                <div className="upload-card ">
                  <div className=''>
               <label htmlFor='upload-img' className="upload-area" aria-label="Upload Image">
                  <input id="upload-img" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} hidden />
                    {previewUrl ? (
                      <div className="image-preview text-center">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '10px' }}
                        />
                      </div>
                    ) : (
                      <div className="upload-content">
                        <span className="upload-icon"><img src={commanuplodeicon} alt='uplode' /></span>
                        <p className='mb-0'>Upload image<br />(JPEG, PNG)</p>
                      </div>
                    )}
                  </label>
                  </div>
                </div>
                <div  style={{ height: "64px"}}>
                  <div className="d-flex justify-content-end" >
                   <button className="product-upload-btn mt-4" onClick={handleUpload}>Upload image</button>
                  </div>
                </div>
              </div>
            </div>
          
            <div className="col-12 col-md-7 col-lg-7 h-100" >
              <div className="p-4 product-uplode-img ">
                <div className="d-flex justify-content-between align-items-center" style={{ height: "45px"}}>
                  <h5>General details</h5>
                  <div className="progress-step-wrapper d-flex justify-content-end mb-2">
                    <div className={`progress-step ${currentStep === 1 ? 'active' : ''}`}></div>
                    <div className={`progress-step ${currentStep === 2 ? 'active' : ''}`}></div>
                  </div>
                </div>
                <div className="product-card-form" >
                  <form className='mt-3'>
                    {currentStep === 1 && (
                      <>
                    <div className="row  mb-4">
                      <div className="col-6">
                        <label htmlFor="productId" className="product-form-label">Product ID</label>
                        <input
                          type="text"
                          className="product-form-input"
                          id="productId"
                          name="productId"
                          value={formData.productId}
                          disabled
                        />
                      </div>
                      <div className="col-6">
                        <label htmlFor="productName" className="product-form-label">Product name</label>
                        <input
                          type="text"
                          className="product-form-input"
                          id="productName"
                          name="productName"
                          value={formData.productName}
                          onChange={handleChange}
                          placeholder="Enter product name"
                        />
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className=" col-6">
                        <label htmlFor="brand" className="product-form-label">Select brand</label>
                        <div className="mt-1">
                          <CommonSelect
                            name="role"
                            value={role}
                            onChange={setRole}
                            placeholder="Select brand"
                            options={roleOptions}
                          />
                        </div>
                      </div>
                      <div className=" col-6">
                        <label htmlFor="productCategory" className="product-form-label">Product category</label>
                        <div className="mt-1">
                          <CommonSelect
                            name="role"
                            value={role}
                            onChange={setRole}
                            placeholder="Product category"
                            options={roleOptions}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='row mb-4'>
                      <div className=" col-6">
                        <label htmlFor="formFactor" className="product-form-label">Form factor</label>
                        <div className="mt-1">
                          <CommonSelect
                            name="role"
                            value={role}
                            onChange={setRole}
                            placeholder="Form factor"
                            options={roleOptions}
                          />
                        </div>
                      </div>
                      <div className=" col-6">
                        <label htmlFor="packageQuantity" className="product-form-label">Product type</label>
                        <div className="mt-1">
                          <CommonSelect
                            name="role"
                            value={role}
                            onChange={setRole}
                            placeholder="Product type"
                            options={productTypes}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='row mb-4'>
                      <div className=" col-6">
                        <label htmlFor="formFactor" className="product-form-label">Package quantity </label>
                        <input
                          type="text"
                          className="product-form-input"
                          id="productName"
                          name="productName"
                          value={formData.productName}
                          onChange={handleChange}
                          placeholder="Enter Package quantity"
                        />
                      </div>
                      <div className=" col-6 ">
                        <label htmlFor="packageQuantity" className="product-form-label">Units</label>
                        <div className="mt-1">
                          <CommonSelect
                            name="role"
                            value={role}
                            onChange={setRole}
                            placeholder="Select Units"
                            options={roleOptions}
                          />
                        </div>
                      </div>
                    </div>
                    </>
                    )} 
                    {currentStep === 2 && (
                      <>
                     <div className='row mb-4'>
                      <div className=" col-12">
                        <label htmlFor="formFactor" className="product-form-label">Product description</label>                       
                        <textarea
                          id="product-description"
                          className=" product-form-input product-description-textarea"
                          placeholder="Enter product description"
                          rows="5"
                          style={{ resize: 'none' }}
                        />
                      </div>
                      </div>
                     <div className='row mb-4'>
                      <div className=" col-6">
                        <label htmlFor="formFactor" className="product-form-label">Quantity</label>
                        <input
                          type="text"
                          className="product-form-input"
                          id="productName"
                          name="productName"
                          value={formData.productName}
                          onChange={handleChange}
                          placeholder="Enter product quantity"
                        />
                      </div>
                      <div className=" col-6 ">
                        <label htmlFor="packageQuantity" className="product-form-label">Minimum stock quantity</label>
                        <input
                          type="text"
                          className="product-form-input"
                          id="productName"
                          name="productName"
                          value={formData.productName}
                          onChange={handleChange}
                          placeholder="Enter Enter minimum stock quantity"
                        />
                      </div>
                    </div>
                    </>
                    )}      
                  </form>
                </div>
                <div  style={{ height: "45px"}}>
                <div className="d-flex justify-content-end gap-3  mt-1" >
                  <button type="button" className="product-cancel-button">Cancel</button>
                  {currentStep > 1 && (
                    <button type="button" className="product-Previous-btn" onClick={() => setCurrentStep((prev) => prev - 1)}>Previous</button>
                  )}
                  {currentStep < 2 ? (
                    <button type="button" className="product-next-btn" onClick={() => setCurrentStep(2)}>Next</button>
                  ) : (
                    <button type="button" className="product-next-btn" >Save</button>
                  )}
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddProducts