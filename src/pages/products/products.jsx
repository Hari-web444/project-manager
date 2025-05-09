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
   const config = configModule.config();
  const [role, setRole] = useState(null);
  const handleChange = (event) => {
    setSelected(event.target.value);
  };
  const openmodel = () => { setShowModal(true);}
  const closemodel = () => { setShowModal(false);}
 
  
  const fetchProductTypes = async () => {
     try {
       const response = await fetch(`${config.apiBaseUrl}getDesignationList`, {
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
  {
    "ProductID": "P1002",
    "Product": "Mechanical Keyboard",
    "CreatedDate": "2025-04-28",
    "Quantity": 20,
    "Stock": "Low Stock",
    "Price": 2499.00,
    "Date": "2025-05-08",
    "view": "View"
  },
  {
    "ProductID": "P1003",
    "Product": "USB-C Hub",
    "CreatedDate": "2025-04-15",
    "Quantity": 0,
    "Stock": "Out of Stock",
    "Price": 899.00,
    "Date": "2025-05-08",
    "view": "View"
  },
  {
    "ProductID": "P1004",
    "Product": "Webcam HD",
    "CreatedDate": "2025-03-10",
    "Quantity": 75,
    "Stock": "In Stock",
    "Price": 1299.00,
    "Date": "2025-05-08",
    "view": "View"
  },
  {
    "ProductID": "P1005",
    "Product": "Bluetooth Speaker",
    "CreatedDate": "2025-04-01",
    "Quantity": 15,
    "Stock": "Low Stock",
    "Price": 1999.00,
    "Date": "2025-05-08",
    "view": "View"
  },
   {
    "ProductID": "P1014",
    "Product": "Ergonomic Office Chair",
    "CreatedDate": "2025-02-22",
    "Quantity": 12,
    "Stock": "Low Stock",
    "Price": 8999.00,
    "Date": "2025-05-08",
    "view": "View"
  },
  {
    "ProductID": "P1006",
    "Product": "HDMI Cable",
    "CreatedDate": "2025-02-20",
    "Quantity": 200,
    "Stock": "In Stock",
    "Price": 299.00,
    "Date": "2025-05-08",
    "view": "View"
  },
  {
    "ProductID": "P1007",
    "Product": "Laptop Stand",
    "CreatedDate": "2025-03-05",
    "Quantity": 0,
    "Stock": "Out of Stock",
    "Price": 1099.00,
    "Date": "2025-05-08",
    "view": "View"
  },
  {
    "ProductID": "P1008",
    "Product": "External Hard Drive 1TB",
    "CreatedDate": "2025-01-30",
    "Quantity": 10,
    "Stock": "Low Stock",
    "Price": 4599.00,
    "Date": "2025-05-08",
    "view": "View"
  },
  {
    "ProductID": "P1009",
    "Product": "Smart LED Bulb",
    "CreatedDate": "2025-02-15",
    "Quantity": 120,
    "Stock": "In Stock",
    "Price": 799.00,
    "Date": "2025-05-08",
    "view": "View"
  },
   {
    "ProductID": "P1014",
    "Product": "Ergonomic Office Chair",
    "CreatedDate": "2025-02-22",
    "Quantity": 12,
    "Stock": "Low Stock",
    "Price": 8999.00,
    "Date": "2025-05-08",
    "view": "View"
  },
  {
    "ProductID": "P1010",
    "Product": "Power Bank 20000mAh",
    "CreatedDate": "2025-04-05",
    "Quantity": 30,
    "Stock": "In Stock",
    "Price": 1899.00,
    "Date": "2025-05-08",
    "view": "View"
  },
  {
    "ProductID": "P1011",
    "Product": "Noise Cancelling Headphones",
    "CreatedDate": "2025-03-25",
    "Quantity": 5,
    "Stock": "Low Stock",
    "Price": 6499.00,
    "Date": "2025-05-08",
    "view": "View"
  },
  {
    "ProductID": "P1012",
    "Product": "Smartphone Tripod",
    "CreatedDate": "2025-03-12",
    "Quantity": 90,
    "Stock": "In Stock",
    "Price": 599.00,
    "Date": "2025-05-08",
    "view": "View"
  },
  {
    "ProductID": "P1013",
    "Product": "USB Flash Drive 64GB",
    "CreatedDate": "2025-01-10",
    "Quantity": 140,
    "Stock": "In Stock",
    "Price": 499.00,
    "Date": "2025-05-08",
    "view": "View"
  },
  {
    "ProductID": "P1014",
    "Product": "Ergonomic Office Chair",
    "CreatedDate": "2025-02-22",
    "Quantity": 12,
    "Stock": "Low Stock",
    "Price": 8999.00,
    "Date": "2025-05-08",
    "view": "View"
  },
  {
    "ProductID": "P1015",
    "Product": "WiFi Range Extender",
    "CreatedDate": "2025-04-18",
    "Quantity": 35,
    "Stock": "In Stock",
    "Price": 1699.00,
    "Date": "2025-05-08",
    "view": "View"
  }
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
                          options={productTypes}
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
  