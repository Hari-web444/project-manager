import React , { useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import SvgContent from '../../components/svgcontent';
import { ToastContainer, toast } from 'react-toastify';

function AddToCart() {
    const [needLoading, setNeedLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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
            <div className=''>
                head
            </div>

            <div className='body-div-el'>
                Body
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

export default AddToCart;
