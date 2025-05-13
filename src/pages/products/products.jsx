import React,{useState,useEffect} from 'react';
import './product.css'
import closebtn from '../../assets/images/closebtn.svg';
import CommonSelect from "../../components/common-select.jsx";
import  Pagination from "../../components/Pagination/index.jsx";
import configModule from '../../../config.js';
function Products() {
  const [selected, setSelected] = useState('Vaithyar poova');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [productTypes, setProductTypes] = useState([]);
  const [role, setRole] = useState(null);
  const [formFactor, setFormFactor] = useState([]);
  const config = configModule.config();

  const handleChange = (event) => {
    setSelected(event.target.value);
  };
  const openmodel = () => { setShowModal(true);}
  const closemodel = () => { setShowModal(false);}
 
  
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


  const data= [
  {
    "ProductID": "P1001",
    "Product": "Wireless Mouse",
    "CreatedDate": "2025-05-01",
    "Quantity": 50,
    "Stock": "In Stock",
    "Price": 599.00,
    "Date": "2025-05-08",
    "view": "View"
  },
  
]
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };


    return (
    <div className='common-body-st'>
      <div className='header-container-products'>
      <div className='d-flex header-product-el '>
      <div className="col-lg-6 col-6 d-flex  align-items-center">
        <div className="header-product-pvt">
          <h6 className="mt-0 mb-0 product-header-text">Total Products: 10</h6>
          <div className="checkbox-group mt-2 ">
         <label className="checkbox-item ">
          <input
            type="checkbox"
            name="product"
            value="Vaithyar poova"
            className="custom-checkbox"
            checked={selected === 'Vaithyar poova'}
            onChange={handleChange}
          />
        <span className="box">{selected === 'Vaithyar poova' && <span className="dot" />}</span> Vaithyar poova : 0
      </label>
      <label className="checkbox-item">
        <input
          type="checkbox"
          name="product"
          value="Gramiyam"
          className="custom-checkbox"
          checked={selected === 'Gramiyam'}
          onChange={handleChange}
        />
        <span className="box"> {selected === 'Gramiyam' && <span className="dot" />}</span> Gramiyam : 0
      </label>
    </div>
        </div>
      </div>
        <div className='col-lg-6  col-6 d-flex flex-wrap justify-content-end search-add-wrapper ' >
          <div className=''>
            <input type='search' className='product-search-input' placeholder='Search ' />
          </div>
        {/* <div><Link to='/products/add'><button type='button' className='product-Addnew-btn '>Add new</button></Link></div>   */}
        <div><button type='button' className='product-Addnew-btn ' onClick={openmodel}>Add new</button></div> 
        </div>
      </div>
      <div className='body-container-products'>
        {/* <p className='product-no-items-txt'>  No records found</p> */}
        <div className="common-overall-container">
         <div className="table-responsive">
           <table className="table table-bordered">
             <thead className="table-th">
               <tr>
                <th>ProductID</th>
                <th>Product</th>
                <th>CreatedDate</th>
                <th>Quantity</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Date</th>
                <th>view</th>
               </tr>
             </thead>
             <tbody className="tbody-responsive">
               {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.ProductID}</td>
                  <td>{item.Product}</td>
                  <td>{item.CreatedDate}</td>
                  <td>{item.Quantity}</td>
                  <td>{item.Stock}</td>
                  <td>₹{item.Price.toFixed(2)}</td>
                  <td>{item.Date}</td>
                  <td><button className="view-btn">👁️ {item.view}</button></td>
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
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </label>
          {data.length > itemsPerPage && (
            <Pagination
              count={data.length}
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
                     <div className='col-5 d-flex  align-items-center'> <h6 className=''>Select Product type</h6>  </div>
                    <div className='col-7'> 
                       <CommonSelect
                          name="role"
                          value={role}
                          onChange={setRole}
                          placeholder="Select Product type"
                          options={productTypes}
                        /> 
                        </div>                  
                    </div>
                    <div className="d-flex mt-2">
                    <div className='col-5 d-flex  align-items-center'> <h6 className=''>Select Form factor</h6>  </div>
                    <div className='col-7'> 
                       <CommonSelect
                          name="role"
                          value={role}
                          onChange={setRole}
                          placeholder="Select Form factor"
                          options={formFactor}
                        /> 
                        </div>                 
                    </div>
                  </div>     
                  <div className="product-modal-footer">
                    <button className="cancel-button" onClick={closemodel}>Cancel</button>
                    <button className="next-button"  >Next</button>
                  </div>
                </div>
              </div>
            )}
      </div>
    );
  }
  
  export default Products;
  