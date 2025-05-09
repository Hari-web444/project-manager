import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/addemployeelist.css';
import SvgContent from '../../components/svgcontent.jsx';

function AddEmployee() {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            toast.error('Please upload a valid JPEG or PNG image.');
        }
    };

    const handleUpload = () => {
        if (!image) return toast.error('Please upload an image first.');
        // Add your upload logic here
        console.log('Uploading image:', image);
        // Example: Upload to server using FormData
        // const formData = new FormData();
        // formData.append('image', image);
        // fetch('/upload', { method: 'POST', body: formData });
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
    };

    return (
        <div className='common-body-st'>
            <div className='header-div-el'>
                <div className='header-divpart-el'>
                    <p className='mb-0 header-titlecount-el'>Total Employee : 0</p>
                    <div className="d-flex align-items-center">
                        <button onClick={() => { navigate("/employee/list") }}>
                            <p className='mb-0 nav-btn-top'>
                                Employee &gt; List
                            </p>
                        </button>&nbsp;&gt;&nbsp;
                        <button>
                            <p className='mb-0 nav-btn-top'>
                                Add new
                            </p>
                        </button>
                    </div>
                </div>
            </div>
            <div className='body-div-el'>
                <div className="w-100 h-100 inner-body-st">
                    <div className='left-container-el'>
                        <div className='left-header-st'>
                            <h5 className='mb-0'>Employee image</h5>
                        </div>
                        <div className="upload-container">
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
                        <div className='left-footer-st'>
                            <label htmlFor="imageUpload" className="upload-btn display-flex">
                                Upload image
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
                    <div className='right-container-el'>
                        Pakistan found itself in an awkward position on Friday following a social media post that appeared to seek urgent financial assistance from international lenders, citing economic losses amid soaring tensions with India.
                        "Govt of Pakistan appeals to International Partners for more loans after heavy losses inflected by enemy. Amid escalating war and stocks crash, we urge international partners to help de-escalate. Nation urged to remain steadfast," a post from Pakistan's Economic Affairs Division said.
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

export default AddEmployee;
