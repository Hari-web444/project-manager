import React from 'react';
import closebtn from '../../assets/images/closebtn.svg';
import graterthen from '../../assets/images/graterthen.svg';
import './product.css'
function Viewproduct({onClose,products}) {
  return (
      <div className="product-modal-overlay">
        <div className="product-modal-view">
            <div className="product-modal-header mb-3">
            <h5 className="mb-2 product-view-header">Products <span className="breadcrumb-separator"> <img src={graterthen} alt='then' /> </span>{products?.brand}</h5>
            <button className="close-button" onClick={onClose} ><img src={closebtn} alt="close"/></button>
            </div>
            <div className="">
            <div className='d-flex'>
            <div className='col-6 '>
                <div style={{height: '100%'}}>
                    <img src={products?.product_img} alt="product"  className='product-modal-view-img' />
                </div>
            </div>
            <div className='col-6 '>
                <div className='ms-4'>
                <h6 className='product-view-headtext'>{products?.product_id}</h6> 
                <h6 className='product-view-headtext1'>{products?.product_name}</h6>
                <h6 className='product-form-view'>{products?.product_category}</h6>            
                <h6 className="product-form-view">{products?.form_factor} /<span> {products?.product_type}</span></h6>
                <h6 className="product-form-view-kg">{products?.quantity} /<span> {products?.units}</span></h6>
                <h6 className='product-view-headtext1'>₹ {products?.selling_price}</h6> 
                <textarea
                 name='product_description'
                 className=" w-100 product-view-textarea"
                 rows="4"
                 value={products?.product_description}
                 style={{ resize: 'none' }}
                 required
               />
                </div>
            </div>
            </div>
            </div>
            </div>                       
        </div>
          
  )
}

export default Viewproduct