import React,{useState} from 'react';
import './product.css'
import { Link } from 'react-router-dom';

function Products() {
  const [selected, setSelected] = useState('Vaithyar poova');

  const handleChange = (event) => {
    setSelected(event.target.value);
  };
    return (
    <div className='common-body-st'>
      <div className='header-container-products'>
      <div className='d-flex header-product-el '>
      <div className="col-lg-6 col-4 d-flex  align-items-center">
        <div className="header-product-pvt">
          <h6 className="mt-0 mb-0 product-header-text">Total Products: 10</h6>
          <div className="checkbox-group ">
         <label className="checkbox-item mt-1">
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
        <div className='col-lg-6  col-8 d-flex flex-wrap justify-content-end gap-3' >
          <div className=''>
            <input type='search' className='product-search-input' placeholder='Search ' />
          </div>
        <div><Link to='/products/add'><button type='button' className='product-Addnew-btn '>Add new</button></Link></div>  
        </div>
      </div>
     
      <div className='body-container-products'>
        <p className='product-no-items-txt'>  No records found</p>
      </div>
      </div>
      </div>
    );
  }
  
  export default Products;
  