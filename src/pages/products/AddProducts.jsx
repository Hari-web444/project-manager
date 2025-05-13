import React, { useState,useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './product.css';
import graterthen from '../../assets/images/graterthen.svg';
import SvgContent from '../../components/svgcontent.jsx';
import { Link } from 'react-router-dom';
import CommonSelect from "../../components/common-select.jsx";
import configModule from '../../../config.js';

function AddProducts() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [productTypes, setProductTypes] = useState([]);
  const [productBrand, setProductBrand] = useState([]);
  const [formFactor, setFormFactor] = useState([]);
  const [productUnits, setProductUnits] = useState([]);
  const [productCategory, setProductCategory] = useState([]);
  const config = configModule.config();
  const [brand, setBrand] = useState(null);
  const [units, setUnits] = useState(null);
  const [ptype, setPtype]= useState(null);
  const [factor, setFactor] = useState(null);
  const [category, setCategory] = useState(null);

    const fetchProductTypes = async () => {
     try {
       const response = await fetch(`${config.apiBaseUrl}getAllProductTypes`, {
         method: "GET",
         headers: {  "Content-Type": "application/json" }
       });
       const result = await response.json();
       if (response.ok) {
         setProductTypes(result.data?.length > 0 ? result.data : []);
       }
     } catch (error) {
       toast.error("Error fetching designation list: " + error.message);
     }
   };
  useEffect(() => { fetchProductTypes();}, []);

  
  const getformfactor = async () => {
     try {
       const response = await fetch(`${config.apiBaseUrl}getformfactor`, {
         method: "GET",
         headers: {  "Content-Type": "application/json" }
       });
       const result = await response.json();
       if (response.ok) {
         setFormFactor(result.data?.length > 0 ? result.data : []);
       } else {
         toast.error("Failed to fetch designation list: " + result.message);
       }
     } catch (error) {
       toast.error("Error fetching designation list: " + error.message);
     }
   };

  useEffect(() => {
    getformfactor();
  }, []);


  const productUints = async () => {
     try {
       const response = await fetch(`${config.apiBaseUrl}productUints`, {
         method: "GET",
         headers: {  "Content-Type": "application/json" }
       });
       const result = await response.json();
       if (response.ok) {
         setProductUnits(result.data?.length > 0 ? result.data : []);
       }
     } catch (error) {
       toast.error("Error fetching designation list: " + error.message);
     }
   };
  useEffect(() => {
    productUints();
  }, []);

    const ProductCategory = async () => {
     try {
       const response = await fetch(`${config.apiBaseUrl}productCategory`, {
         method: "GET",
         headers: {  "Content-Type": "application/json" }
       });
       const result = await response.json();
       if (response.ok) {
         setProductCategory(result.data?.length > 0 ? result.data : []);
       }
     } catch (error) {
       toast.error("Error fetching designation list: " + error.message);
     }
   };
  useEffect(() => {
    ProductCategory();
  }, []);

      const ProductBrand = async () => {
     try {
       const response = await fetch(`${config.apiBaseUrl}productBrand`, {
         method: "GET",
         headers: {  "Content-Type": "application/json" }
       });
       const result = await response.json();
       if (response.ok) {
         setProductBrand(result.data?.length > 0 ? result.data : []);
       }
     } catch (error) {
       toast.error("Error fetching designation list: " + error.message);
     }
   };
  useEffect(() => {
    ProductBrand();
  }, [])


 


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            toast.error('Please upload a valid JPEG or PNG image.');
        }
    };

  

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
    };

  const [formData, setFormData] = useState({
    productId: 'VPAREGCCAP001',
    productName: '',
    brand: '',
    productCategory: '',
    formFactor: '',
    packageQuantity: '',
    units: '',
    image
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };





  return (
    <div className='common-body-st'>
      <ToastContainer />
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
              <div className="product-upload-container">
                <label className="upload-box w-100 h-100">
                    {previewUrl ? (
                        <>
                            <img src={previewUrl} alt="Preview" className="preview-image" />
                            <button className="remove-image-btn" onClick={handleRemoveImage}>
                            <SvgContent svg_name="Trash" />
                            </button>
                        </>
                    ) : (
                        <div className='not-getimage-st' >
                            <SvgContent svg_name="upload" width="45 " height="45" />
                            <div>
                                <p className='mb-0 text-upload-st'>Upload image</p>
                                <span style={{ color: "#404040", fontSize: "12px" }}>(JPEG, PNG)</span>
                            </div>
                        </div>
                    )}
                </label>
            </div>
                <div  style={{ height: "64px"}}>
                  <div className='d-flex justify-content-end'>
                  <label htmlFor="imageUpload" className="product-upload-btn display-flex">
                      Upload image{''}
                      <input
                          type="file"
                          id="imageUpload"
                          accept="image/jpeg, image/png"
                          onChange={handleImageChange}
                          className="upload-input"
                          hidden
                      />
                  </label>
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
                            name="brand"
                            value={brand}
                            onChange={setBrand}
                            placeholder="Select brand"
                            options={productBrand}
                          />
                        </div>
                      </div>
                      <div className=" col-6">
                        <label htmlFor="productCategory" className="product-form-label">Product category</label>
                        <div className="mt-1">
                          <CommonSelect
                            name="category"
                            value={category}
                            onChange={setCategory}
                            placeholder="Product category"
                            options={productCategory}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='row mb-4'>
                      <div className=" col-6">
                        <label htmlFor="formFactor" className="product-form-label">Form factor</label>
                        <div className="mt-1">
                          <CommonSelect
                            name="factor"
                            value={factor}
                            onChange={setFactor}
                            placeholder="Form factor"
                            options={formFactor}
                          />
                        </div>
                      </div>
                      <div className=" col-6">
                        <label htmlFor="packageQuantity" className="product-form-label">Product type</label>
                        <div className="mt-1">
                          <CommonSelect
                            name="ptype"
                            value={ptype}
                            onChange={setPtype}
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
                            name="units"
                            value={units}
                            onChange={setUnits}
                            placeholder="Select Units"
                            options={productUnits}
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