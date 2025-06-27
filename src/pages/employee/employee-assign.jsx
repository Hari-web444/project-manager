import React, { useEffect, useState } from 'react';
import '../../assets/styles/employee-assign.css';
import { useAuth } from '../../components/context/Authcontext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import configModule from '../../../config.js';
import SvgContent from '../../components/svgcontent.jsx';

function EmployeeAssign() {
    const { user } = useAuth();
    const userId = user?.userId;
    const user_typecode = user?.user_typecode;
    const [needLoading, setNeedLoading] = useState(false);
    const [allPages, setAllPages] = useState([]);
    const [allDesignation, setAllDesignation] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedItems, setselectedItems] = useState([]);
    const config = configModule.config();
    const [navigateNext, setNavigateNext] = useState(false);

    const getPageDetails = async () => {
        setNeedLoading(true);
        try {
            const response = await axios.get(`${config.apiBaseUrl}getAssignDetails`);

            const result = response.data;
            if (response.status === 200) {
                setAllPages(result.pages);
                setAllDesignation(result.userTypes);
                setAllUsers(result.users);
            } else {
                toast.error("Failed to fetch designation list: " + result.message);
            }
        } catch (error) {
            toast.error(
                "Error fetching designation list: " +
                (error.response?.data?.message || error.message)
            );

            setAllPages([]);

        } finally {
            setNeedLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            getPageDetails();
        }
    }, [user]);

    const goNextAssignPage = (itemData) => {
        setNavigateNext(true);
        setselectedItems(itemData);
    };

    return (
        <div className='common-body-st'>
            <div className='header-div-el'>
                <div className='header-divpart-el'>
                    <p className='mb-0 header-titlecount-el'>Assign Access</p>
                    <div className="d-flex align-items-center">
                        <button onClick={() => { setNavigateNext(false); }}>
                            <p className='mb-0 nav-btn-top'>
                                Employee &gt; Assign
                            </p>
                        </button>
                        {navigateNext && (
                            <button>
                                &nbsp;{">"}&nbsp;
                                <p className='mb-0 nav-btn-top'>
                                    {selectedItems.user_type}
                                </p>
                            </button>
                        )}
                    </div>
                </div>
                {!navigateNext && (
                    <div className="search-add-wrapper">
                        <input
                            type="text"
                            placeholder="Search"
                            className="search-input"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                )}
            </div>
            <div className='phone-header-div-el'>
                <div className='d-flex justify-content-between align-items-center mb-2'>
                    <div className="d-flex align-items-center">
                        <button onClick={() => { setShowModal(false); }}>
                            <p className='mb-0 nav-btn-top'>
                                Employee &gt; Assign
                            </p>
                        </button>
                    </div>
                    <p className='mb-0 header-titlecount-el'>Assign access</p>
                </div>
                <div className="search-add-wrapper justify-content-end mb-3">
                    <input
                        type="text"
                        placeholder="Search"
                        className="search-input"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="add-button" onClick={() => setShowModal(true)} >Add</button>
                </div>
            </div>
            <div className='body-div-el'>
                <div className="row justify-content-center allpages-main-ap" >
                    {(allDesignation && !navigateNext) && (
                        allDesignation.map((item) => (
                            <button className="col-3 col-sm-6 col-lg-3 col-xl-3 col-xs-6 mb-4 assign-box-st" key={item.usertype_id || item.user_typecode} onClick={() => goNextAssignPage(item)}>
                                <div className="assign-subbox-st w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                                    <div className="assign-icon-ap" >
                                        <SvgContent svg_name="employee" width="100%" height="100%" stroke="#05823a" />
                                    </div>
                                    <div className="menu-name hyphen-wrap text-center">{item.user_type}</div>
                                </div>
                            </button>
                        )))}
                </div>

                {navigateNext && (
                    <div className='w-100 assign-pro-ap'>
                        <div className='assign-body-list-lft'>
                            <h5 className='innerbody-header-ap mb-0'>
                                {selectedItems?.user_type || "Type"}
                            </h5>
                            <div className='innerbody-body-ap'>
                                <div className="employee-list">
                                    {allUsers &&
                                        allUsers
                                            .filter(user => user.usertype_id === selectedItems.usertype_id)
                                            .map((user, index) => (
                                                <div key={user.user_id || user.emp_id || index} className="d-flex align-items-center emp-listcont-st">
                                                    <input type="checkbox" className="emp-checkbox me-2" />
                                                    <span className="emp-label">{user.emp_id || "Emp ID"} - {user.name || 'Emp name'}</span>
                                                </div>
                                            ))
                                    }

                                    {allUsers &&
                                        allUsers.filter(user => user.usertype_id === selectedItems.usertype_id).length === 0 && (
                                            <p>No user matched</p>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='assign-body-list-rit p-4'>
                            {allPages &&
                                allPages.map((item, index) => {
                                    const actionKeys = new Set([
                                        'active',
                                        'inactive',
                                        'shuffle',
                                        'search',
                                        'sort',
                                        'filter',
                                        'add',
                                        'edit',
                                        'view',
                                        'delete',
                                        'export',
                                        'upgrade',
                                        'gst',
                                        'add_target',
                                        'premium',
                                        'history',
                                        'events',
                                        'permission',
                                        'break',
                                        'people',
                                        'shop',
                                        'purchase_history',
                                        'consulting_history',
                                        'class',
                                        'wallet',
                                        'create_profile',
                                        'schedule',
                                        'category'

                                    ]);

                                    const actions = Object.entries(item)
                                        .filter(([key, value]) => actionKeys.has(key) && Number(value) === 1)
                                        .map(([key]) => key);

                                        return (
                                            <div key={item.menu_id || index} className='mb-4'>
                                              <h6 className='fw-bold'>{item.name}</h6>
                                              <div className="d-flex flex-wrap gap-4 mt-2">
                                                {actions.length > 0 ? (
                                                  actions.map(action => (
                                                    <label
                                                      key={action}
                                                      className="custom-form-check"
                                                      htmlFor={`check-${item.menu_id}-${action}`}
                                                    >
                                                      <input
                                                        type="checkbox"
                                                        className="custom-checkbox"
                                                        id={`check-${item.menu_id}-${action}`}
                                                        defaultChecked
                                                      />
                                                      <span className="text-capitalize">{action}</span>
                                                    </label>
                                                  ))
                                                ) : (
                                                  <span className='text-muted'>No permissions</span>
                                                )}
                                              </div>
                                            </div>
                                          );
                                          
                                })}
                        </div>
                    </div>
                )}


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

export default EmployeeAssign;
