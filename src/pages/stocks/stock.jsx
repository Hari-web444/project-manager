import {useState,useEffect,useRef} from 'react';
import filtericon from '../../assets/images/filtericon.svg';
import configModule from '../../../config.js';
import Pagination from "../../components/Pagination/index.jsx";
import filterclear from '../../assets/images/filterclear.svg';
import updatetd from '../../assets/images/updatebtn.svg';
import updateth from '../../assets/images/updateinventryth.svg';
import { PropagateLoader } from 'react-spinners';
import axios from 'axios';
import './stocks.css';
import Updatestock from './updatestock.jsx';
import Addstock from './addstock.jsx';
function Stocks() {
  const config = configModule.config();
   const [needLoading, setNeedLoading] = useState(false);
  const [selected, setSelected] = useState('Vaithyar poova');
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [stockFilter, setStockFilter] = useState(null);
  const [updatePrice, setUpdatePrice] = useState(false);
  const [exportin, setExportin] = useState(false);
  const dropdownRef = useRef(null);
    useEffect(() => {
      function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const openviewmodel = () => { setUpdatePrice(true);}
    const closviewemodel = () => { setUpdatePrice(false);}
    const openexportmodel = () => { setExportin(true);}
    const closexportmodel = () => { setExportin(false);}

    const fetchProducts = async () => {
      setNeedLoading(true);
    try {
      const response = await axios.post(`${config.apiBaseUrl}gettocks`, {
        brand: selected, 
      });
      setProducts(response.data); 
      if (stockFilter) {
        const filtered = response.data.filter(p => p.stock_status === stockFilter);
        setFilteredProducts(filtered);
      } else {
        setFilteredProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }finally {
      setNeedLoading(false);
    }
  };
    
    useEffect(() => {
    fetchProducts();
   }, [selected,stockFilter]);
   

    const clearFilter = () => {
    setStockFilter(null);
    setFilteredProducts(products);
    setIsOpen(false);
    setCurrentPage(1);
   };

     const handleStockFilter = (status) => {
    setStockFilter(status);
    setIsOpen(false);
    setCurrentPage(1);
  };

   const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const statusClassMap = {
  "Available": "status-label-available",
  "Low Stock": "status-label-low-stock",
  "Not Available": "status-label-not-available"
  };


  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);
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
      <div className='header-container-products'>
      <div className='d-flex header-product-el '>
            <div className="col-lg-6 col-6 d-flex  align-items-center">
              <div className="header-product-pvt">
                <h6 className="mt-0 mb-0 product-header-text">Stock</h6>
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
              <span className="box">{selected === 'Vaithyar poova' && <span className="dot" />}</span> Vaithyar poova 
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
              <span className="box"> {selected === 'Gramiyam' && <span className="dot" />}</span> Gramiyam 
            </label>
          </div>
              </div>
            </div>
              <div className='col-lg-6  col-6 d-flex flex-wrap justify-content-end search-add-wrapper ' >  
                <div className="product-filter-dropdowns" ref={dropdownRef}>
                  <button className="product-filter-btns"  type="button" onClick={() => setIsOpen(!isOpen)} ><img src={filtericon} alt="img" /> Filter</button>
                  {isOpen && (
                   <ul className="product-dropdown-menus" >
                      <li className='product-fileters-header' >Filter<span>    {stockFilter && (<button type='button'  onClick={clearFilter}><img src={filterclear} style={{width:"10px"}} alt="close"/></button>)} </span></li>
                      <li  className={`product-dropdown-items ${stockFilter === "Available" ? "selected-li" : ""}`} >  <button type="button" className="product-dropdown-button"onClick={() => handleStockFilter("Available")}>Available</button></li>
                      <li   className={`product-dropdown-items ${stockFilter === "Low Stock" ? "selected-li" : ""}`} > <button type="button" className="product-dropdown-button"onClick={() => handleStockFilter("Low Stock")}>Low Stock</button></li>
                      <li className={`product-dropdown-items ${stockFilter === "Not Available" ? "selected-li" : ""}`} > <button type="button" className="product-dropdown-button" onClick={() => handleStockFilter("Not Available")} >Not Available</button></li>             
                   </ul>
                  )}
                </div>           
                 <div><button type='button' className='stocks-add-btn' onClick={openexportmodel} >Add</button></div> 
              </div>
            </div>
            <div className='body-container-products'>
             <div className="common-overall-container">
              <div className="table-responsive">
               <table className="table table-bordered">
                  <thead className="table-th">
                    <tr className="table-th-row">
                      <th>ID</th>
                      <th>Product</th>
                      <th>Category</th>
                      <th>SellingPrice</th>
                      <th>Units</th>
                      <th>MinQty</th>
                      <th>InStock</th>
                      <th>Status</th>
                      <th><img src={updateth} alt="close" /></th>
                    </tr>
                  </thead>
                  <tbody>
                      {currentProducts && currentProducts.length > 0 ?(currentProducts.map((item, index) => (
                     <tr className='tbody-row-inventry ' key={item.stock_recid}>
                      <td>{item.stock_product_id}</td>
                      <td>{item.product_name}</td>
                      <td>{item.product_category}</td>
                      <td>₹{item.selling_price}</td>
                      <td>{item.units}</td>
                      <td>{item.min_stock_qty}</td>
                      <td>{item.stock_quantity}</td>
                      <td><span className={statusClassMap[item.stock_status] || ""}>{item.stock_status}</span> </td>
                      <td><button type='update' onClick={(e) => { openviewmodel(); setSelectedProduct(item); }}><img src={updatetd} alt="close" style={{cursor :"pointer"}}/></button></td>
                     </tr>
                     )))
                     : (
                      <tr className="table-no-data-row">
                      <td colSpan="9">
                      <div className="tb-body-iventory-st">
                        No Inventory list
                      </div>
                      </td>
                      </tr>
                      )}
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
                      {filteredProducts.length > itemsPerPage && (
                        <Pagination
                          count={filteredProducts.length}
                          page={currentPage}
                          pageSize={itemsPerPage}
                          onChange={(pageNo) => setCurrentPage(pageNo)}
                        />
                      )}
                    </div>
                    </div>
           </div>
      </div>
           {updatePrice && (
                   <Updatestock onClose={closviewemodel}  getstocks={fetchProducts}  stocks={selectedProduct}/> )
            }
         {exportin && (
                   <Addstock onClose={closexportmodel} /> )
            }
    </div>
    );
  }
  
  export default Stocks;
  