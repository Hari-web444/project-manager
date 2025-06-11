import React,{useState,useEffect,useRef} from 'react';
import './product.css'
import closebtn from '../../assets/images/closebtn.svg';
import filtericon from '../../assets/images/filtericon.svg';
import filterclear from '../../assets/images/filterclear.svg';
import Actioneditebtn from '../../assets/images/actionedit.svg';
import CommonSelect from "../../components/common-select.jsx";
import Pagination from "../../components/Pagination/index.jsx";
import configModule from '../../../config.js';
import {  useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import axios from 'axios';
import Viewproduct from './viewproduct.jsx';
import { useAuth } from '../../components/context/Authcontext.jsx'; 


function Products() {
  const [selected, setSelected] = useState('Vaithyar poova');
  const [showModal, setShowModal] = useState(false);
  const [viewproduct, setViewproduct] = useState(false);
  const [delConfirmPopup, setDelConfirmPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [productTypes, setProductTypes] = useState([]);
  const [formFactor, setFormFactor] = useState([]);
  const [products, setProducts] = useState([]);
  const config = configModule.config();
  const [ptype, setPtype]= useState(null);
  const [factor, setFactor] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
   const [counts, setCounts] = useState(null);
  const { user } = useAuth();
  const user_typecode = user?.user_typecode;
  const [menuIndex, setMenuIndex] = useState(null);
  const [productTypeFilter, setProductTypeFilter] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(false);

    const toggleMenu = (index) => {
    setMenuIndex(menuIndex === index ? null : index); 
  };

  const openmodel = () => { setShowModal(true);}
  const closemodel = () => { setShowModal(false);}
  const openviewmodel = () => { setViewproduct(true);}
  const closviewemodel = () => { setViewproduct(false);}
  const openDetetemodel = () => { setDelConfirmPopup(true);}
  const closDetetemodel = () => { setDelConfirmPopup(false);}

 const fetchProducts = async () => {
    try {
      const response = await axios.post(`${config.apiBaseUrl}getProduct`, {
        brand: selected, 
      });
      setProducts(response.data); 
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };


  async function fetchCounts() {
    try {
      const response = await axios.post(`${config.apiBaseUrl}getProductcount`); 
      setCounts(response.data);
    } catch (err) {
      toast.error('Failed to fetch product counts');
      console.error(err);
    } 
  }


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
    fetchProducts();
  }, [selected]);

  useEffect(() => {
    fetchCounts();
    fetchProductTypes();
    getformfactor();
  }, []);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); 
  };

  useEffect(() => {
    let filtered = products;

    if (productTypeFilter) {
      filtered = filtered.filter(product => product.product_type === productTypeFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.product_id.toLowerCase().includes(term) ||
        product.product_name.toLowerCase().includes(term) ||
        product.product_category.toLowerCase().includes(term)
      );
    }

    setFilteredProducts(filtered);
  }, [productTypeFilter, searchTerm, products]);

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const AddProduct = () => {
      if (!ptype) {
        toast.error("You need to Select Product type.");
        return;
      }
       if (!factor) {
        toast.error("You need to Select Form factor.");
        return;
      }
      setShowModal(false);
      navigate('/products/add', {
        state: { ptype,factor }
      });
    };

    const editProduct = (item) => {
    if (!item) {
      toast.error("No value found.");
      return;
    }
    navigate('/products/add', {
      state: { productData: item ,type: "Edit"}
    });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setMenuIndex(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async () => {
    setDelConfirmPopup(false);
    setLoading(true);
    const product_recid = selectedProduct?.product_recid;
    try {
      await axios.delete(`${config.apiBaseUrl}product/${product_recid}`);
      toast.success('Product deleted successfully!');
      await fetchProducts();
      await fetchCounts();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete product.');
    }
    finally {
    setLoading(false); 
  }
  };
  const statusClassMap = {
  "Available": "status-label-available",
  "Low Stock": "status-label-low-stock",
  "Not Available": "status-label-not-available"
  };


  return (
    <div className='common-body-st'>
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
        theme="colored" />
      <div className='header-container-products'>
      <div className='d-flex header-product-el '>
      <div className="col-lg-6 col-6 d-flex  align-items-center">
        <div className="header-product-pvt">
          <h6 className="mt-0 mb-0 product-header-text">Total Products : {counts?.totalCount}</h6>
          <div className="checkbox-group-product mt-2 ">
         <label className="checkbox-item-product ">
          <input
            type="checkbox"
            name="product"
            value="Vaithyar poova"
            className="custom-checkbox"
            checked={selected === 'Vaithyar poova'}
             onChange={(e) => setSelected(e.target.value)}
          />
        <span className="box">{selected === 'Vaithyar poova' && <span className="dot" />}</span> Vaithyar poova : {counts?.vaithyarPoovaCount}
      </label>
      <label className="checkbox-item-product">
        <input
          type="checkbox"
          name="product"
          value="Gramiyam"
          className="custom-checkbox"
          checked={selected === 'Gramiyam'}
          onChange={(e) => setSelected(e.target.value)}
        />
        <span className="box"> {selected === 'Gramiyam' && <span className="dot" />}</span> Gramiyam : {counts?.gramiyamCount}
      </label>
    </div>
        </div>
      </div>
        <div className='col-lg-6  col-6 d-flex flex-wrap justify-content-end search-add-wrapper ' >
          <div className=''>
            <input type='search' className='product-search-input' placeholder='Search '  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          {(user_typecode === "TSL" || user_typecode === "TCL") && (   
          <div className="product-filter-dropdowns" ref={dropdownRef}>
            <button className="product-filter-btns"  type="button" onClick={() => setIsOpen(!isOpen)} ><img src={filtericon} alt="img" /> Filter</button>
            {isOpen && (
             <ul className="product-dropdown-menus">
                <li className='product-fileters-header'>Filter <span>  {productTypeFilter && (<button type='button' onClick={() => { setProductTypeFilter(null); setIsOpen(false); }}><img src={filterclear} style={{width:"10px"}} alt="close"/></button> )}</span></li>
                {productTypes.map((option) => (
                 <li key={option.value ?? option.label} className={`product-dropdown-items ${productTypeFilter === option.label ? 'selected-li' : ''}`}>
                  <button type="button" className="product-dropdown-button" onClick={() => { setProductTypeFilter(option.label); setIsOpen(false); }} >
                    {option.label}
                  </button>
                </li>
                ))}              
             </ul>
            )}
          </div> 
          )}
          {(user_typecode === "AD" || user_typecode === "BH") && (      
           <div><button type='button' className='product-Addnew-btn ' onClick={openmodel}>Add new</button></div> 
           )}
        </div>
      </div>
      <div className='body-container-products'>
        {/* <p className='product-no-items-txt'>  No records found</p> */}
        <div className="common-overall-container">
         <div className="table-responsive">
           <table className="table table-bordered">
             <thead className="table-th">
               <tr className=' table-th-row'>
                <th>S.No</th>
                <th>ProductID</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Stock</th>
                <th>Price</th>
                <th>CreatedDate</th>
                   {(user_typecode === "AD" || user_typecode === "BH") && (    <th>Action</th>)}
               </tr>
             </thead>
             <tbody className="tbody-responsive">
               {currentProducts.map((item, index) => (
                <tr key={item.product_recid} style={{position:"relative"}} onClick={(e) => {  
                   if (e.target.closest('.td-action-menu')) return;
                  openviewmodel();
                  setSelectedProduct(item);
                 }}>
                 <td>{indexOfFirstProduct + index + 1}</td> 
                 <td>{item.product_id}</td>
                 <td className="product-cell-mr">
                  <div className="product-card">
                    <div className="product-status">
                    <img src={item.imageUrl} alt='img' className="product-img" />
                    </div>
                    <div className="product-details">
                      <h6 className="product-name">{item.product_name}</h6>
                      <p className="product-category">{item.product_category}</p>
                      <p className="product-form-factor">{item.form_factor} /<span> {item.product_type}</span></p>
                    </div>
                  </div>
                </td>
                <td>{item.package_quantity}{' '}{item.units}</td>
                <td><span className={statusClassMap[item.stock_status] || ""}>{item.stock_status}</span> </td>
                  <td>₹{item.selling_price}</td>
                  <td>{format(new Date(item.created_at), 'dd-MM-yyyy')}</td>    
                    {(user_typecode === "AD" || user_typecode === "BH") && (               
                  <td className='td-action-menu'><button onClick={(e) => { e.stopPropagation(); toggleMenu(index); }}> <img src={Actioneditebtn} alt="Act"/> </button>
                   {menuIndex === index && (
                    <div className="action-menu" ref={dropdownRef}>
                      <div><button className="menu-item-product " 
                        onClick={(e) => { e.stopPropagation(); editProduct(item);}} >Edit</button></div> 
                      <div><button className="menu-item-product1"
                       onClick={(e) => { e.stopPropagation(); setSelectedProduct(item); openDetetemodel(); }} >Delete</button></div>
                    </div>
                   )}
                  </td> )}
                </tr>
              ))}
             </tbody>
           </table>
         </div>
        </div>
        <div className="mt-2  fs-6 d-flex justify-content-between align-items-center " style={{ height: "50px" }}>
        <div className="d-flex align-items-center w-100 justify-content-between ">
          <label htmlFor="hfg" className="me-2">
            Results per page{" "}
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="row-per-page-select"
              style={{ width: "60px" }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </label>
          {products.length > itemsPerPage && (
            <Pagination
              count={products.length}
              page={currentPage}
              pageSize={itemsPerPage}
              onChange={(pageNo) => setCurrentPage(pageNo)}
            />
          )}
        </div>
        </div>
      </div>
      </div>
      {showModal && (
              <div className="product-modal-overlay">
                <div className="product-modal-container">
                  <div className="product-modal-header">
                    <h5 className="mb-0 add-new-hdr">Add new Product</h5>
                    <button className="close-button" onClick={closemodel} ><img src={closebtn} alt="close"/></button>
                  </div>
                  <div className="product-modal-body">
                    <div className="d-flex">
                        <div className='col-5 d-flex  align-items-center'> <h6 className=''>Select Form factor</h6>  </div>
                    <div className='col-7'> 
                       <CommonSelect
                          name="factor"
                          value={factor}
                          onChange={setFactor}
                          placeholder="Select Form factor"
                          options={formFactor}
                        /> 
                        </div>               
                    </div>
                    <div className="d-flex mt-3">
                    <div className='col-5 d-flex  align-items-center'> <h6 className=''>Select Product type</h6>  </div>
                    <div className='col-7'> 
                       <CommonSelect
                          name="ptype"
                          value={ptype}
                          onChange={setPtype}
                          placeholder="Select Product type"
                          options={productTypes}
                        /> 
                        </div>                 
                    </div>
                  </div>     
                  <div className="product-modal-footer">
                    <button className="cancel-button" onClick={closemodel}>Cancel</button>
                    <button className="next-button" onClick={AddProduct}  >Next</button>
                  </div>
                </div>
              </div>
            )}
            {viewproduct && (
             <Viewproduct onClose={closviewemodel}   products={selectedProduct}/> )
          }

        {delConfirmPopup && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header mb-3">
              <h5 className="mb-0 add-new-hdr">Confirm to delete</h5>
            </div>
            <div className="modal-body mb-2">
              <div className="container commonst-select">
                <p>Are you sure to delete this  "{selectedProduct.product_id}"?</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={closDetetemodel} >Cancel</button>
              <button className="next-button" onClick={() => handleDelete()} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
      </div>
    );
  }
  
  export default Products;
  