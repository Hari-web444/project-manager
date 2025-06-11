import React, { useState, useEffect } from "react";
import "./profile.css";
import Logoutmodal from "../../components/logoutmodal";
import { useAuth } from "../../components/context/Authcontext.jsx";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import configModule from "../../../config.js";
import CommonSelect from "../../components/common-select.jsx";

function Profile() {
  const { user } = useAuth();
  const userId = user?.userId;
  const creat_by = user?.created_by;
  const [isShowAlertpopup, setIsShowAlertpopup] = useState(false);
  const [mainstep, setMainstep] = useState(1);
  const [step, setStep] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [userData, setUserData] = useState(null);
  const [ltype, setLtype] = useState(null);
  const [duration, setDuration] = useState(null);
  const [status, setStatus] = useState(null);

  const config = configModule.config();

  const achievementsData = [
    { amount: "₹ XXXX", month: "Jan 2025" },
    { amount: "₹ XXXX", month: "Dec 2024" },
    { amount: "₹ XXXX", month: "Nov 2024" },
    { amount: "₹ XXXX", month: "Oct 2024" },
  ];

  const visibleItems = showAll ? achievementsData : achievementsData.slice(0, 2);

  const [formData, setFormData] = useState({
    type_leave: '',
    type_day: '',
  });

  const [leaveForm, setLeaveForm] = useState({
    from_date: '',
    to_date: '',
    reason: '',
  });

  const [permissionForm, setPermissionForm] = useState({
    from_time: '',
    to_time: '',
    reason: '',
  });

  const handleLeaveChange = (e) => {
    const { name, value } = e.target;
    setLeaveForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (e) => {
    const { name, value } = e.target;
    setPermissionForm(prev => ({ ...prev, [name]: value }));
  };

  const typeleave = [
    { label: 'CL - Casual Leave', value: 'Casual Leave' },
    { label: 'SL - Sick Leave', value: 'Sick Leave' },
    { label: 'PL - Other', value: 'PL-Other' },
  ];

  const leaveDuration = [
    { label: 'Full Day', value: 'full days' },
    { label: 'Half Day (Morning)', value: '1-half-morning' },
    { label: 'Half Day (Evening)', value: '1-half-evening' },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post(`${config.apiBaseUrl}getSingleUserData/${userId}`);
        setUserData(response.data.data);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
      }
    };
    if (userId) fetchUserData();
  }, [userId]);

  useEffect(() => {
    if (ltype) {
      setFormData(prev => ({ ...prev, type_leave: ltype.value }));
    }
  }, [ltype]);

  useEffect(() => {
    if (duration) {
      setFormData(prev => ({ ...prev, type_day: duration.value }));
    }
  }, [duration]);

  const handleSubmit = async () => {
    if (step === 1) {
      try {
        const payload = {
          ...leaveForm,
          leave_type: formData.type_leave,
          duration: formData.type_day,
          created_by: creat_by,
          user_id: userId,
        };
        await axios.post(`${config.apiBaseUrl}insertLeave`, payload);
        toast.success("Leave submitted successfully!");
        resetLeaveForm();
      } catch (err) {
        console.error(err);
        toast.error("Failed to submit leave.");
      }
    } else if (step === 2) {
      try {
        const payload = {
          ...permissionForm,
          created_by: creat_by,
          user_id: userId,
        };
        await axios.post(`${config.apiBaseUrl}insertPermission`, payload);
        toast.success("Permission request sent!");
        resetPermissionForm();
      } catch (err) {
        console.error(err);
        toast.error("Failed to submit permission.");
      }
    }
  };

  const resetLeaveForm = () => {
    setLeaveForm({ from_date: '', to_date: '', reason: '' });
    setFormData({ type_leave: '', type_day: '' });
    setLtype(null);
    setDuration(null);
  };

  const resetPermissionForm = () => {
    setPermissionForm({ from_time: '', to_time: '', reason: '' });
  };



  useEffect(() => {
    const fetchstaus = async () => {
      try {
        const response = await axios.post(`${config.apiBaseUrl}getstatus/${userId}`);
        setStatus(response.data.data);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
      }
    };
    if (userId) fetchstaus();
  }, [userId]);


 const statusClassMap = {
  "Approved": "status-label-available",
  "Pending": "status-label-low-stock",
  "Declined": "status-label-not-available"
  };


  return (
    <div className="common-body-st">
      <ToastContainer/>
       {isShowAlertpopup && (
          <Logoutmodal oncloses={()=>setIsShowAlertpopup(false)} />
        )}
      <div className="body-container-profile">
        <div className="header-profile-el">
          <button type="button"  className={`profile-cbtns ${mainstep === 1 ? 'active' : ''}`} onClick={() => setMainstep(1)} >  Performance </button>
          <button type="button" className={`profile-cbtns ${mainstep === 2 ? 'active' : ''}`} onClick={() => setMainstep(2)}> Request </button>
          <button type="button" className="profile-cbtns-logout" onClick={() => setIsShowAlertpopup(true)}> Logout</button>
        </div>
        <div className="body-profile-el">
          <div className="row h-100">
            <div className="col-12 col-md-5 col-lg-5">
              <div className="profile-card-view">
                <div className="p-4">
                 <img
                    src={userData?.image_url || null}
                    alt="Employee"
                    className="profile-img-up"
                  />

                </div>
                <div className="profile-details-view">
                  <div className="d-flex mt-3">
                    <div className="col-5 text-white">Emp ID</div>
                    <div className="col-7 text-white">: {userData?.emp_id}</div>
                  </div>
                  <div className="d-flex  mt-3">
                    <div className="col-5 text-white">Name</div>
                    <div className="col-7 text-white">: {userData?.name}</div>
                  </div>
                  <div className="d-flex  mt-3">
                    <div className="col-5 text-white">Designation</div>
                    <div className="col-7 text-white">: {userData?.designation}</div>
                  </div>
                  <div className="d-flex  mt-3">
                    <div className="col-5 text-white">Mobile</div>
                    <div className="col-7 text-white">: {userData?.mobile_number}</div>
                  </div>
                  <div className="d-flex  mt-3">
                    <div className="col-5 text-white">Email</div>
                    <div className="col-7 text-white">
                      : {userData?.email}
                    </div>
                  </div>
                  <div className="d-flex  mt-3">
                    <div className="col-5 text-white">Date of joining</div>
                    <div className="col-7 text-white">: {new Date(userData?.date_of_joining).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-7 col-lg-7 ">
              <div className="profile-card-pase">
                {mainstep === 1 && (
                  <div className="h-100">
                    <div className="profile-main-pase-body"> 
                      <section>
                        <h5 className="perfomace-profile-txt mb-3">Incentive earned</h5>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 common-col-st p-6">
                          <div className="flex-1 text-center">
                            <h5 className="text-2xl font-semibold">₹ XXXX </h5>
                            <div className="perfomace-profile-subtxt mt-1">Monthly Incentive earned</div>
                          </div>
                          <div className="flex-1 text-center">
                            <h5 className="text-2xl font-semibold">₹ XXXX</h5>
                            <div className="perfomace-profile-subtxt mt-1">Total incentive earned</div>
                          </div>
                        </div>
                      </section>
                    <section>
                      <h5 className="perfomace-profile-txt mb-3">Mile stone</h5>
                      <div className="flex justify-between items-center common-col-st p-6 text-center">
                        <div className="flex-1">
                          <h5 className="text-2xl font-semibold">₹ XXXX</h5>
                          <div className="perfomace-profile-subtxt mt-1">Current milestone</div>
                        </div>
                        <div className="h-10 w-px bg-gray-300 mx-6"></div>
                        <div className="flex-1">
                          <h5 className="text-2xl font-semibold">₹ XXXX</h5>
                          <div className="perfomace-profile-subtxt mt-1">Monthly target</div>
                        </div>
                      </div>
                    </section>

                     <section>
                    <h5 className="perfomace-profile-txt mb-3">Achievements</h5>
                    <div className="flex justify-between items-center common-col-st p-6 text-center ">
                      {visibleItems.map((item, index) => (
                        <div
                          key={item.month}
                          className="text-center min-w-[160px] flex-shrink-0 col-4"
                        >
                          <div className="perfomace-profile-subtxt text-sm">Star performer</div>
                          <h5 className="text-2xl font-semibold mt-1">{item.amount}</h5>
                          <div className="perfomace-profile-subtxt text-sm mt-1">{item.month}</div>
                        </div>
                      ))}

                      {!showAll && (
                        <button
                          className="cursor-pointer fw-500 color-default"
                          onClick={() => setShowAll(true)}
                        >
                          View all
                        </button>
                      )}

                    </div>
                  </section>
                    </div>
                  </div>
                )} 
                {mainstep === 2 && (
                  <>
                 <div className="profile-card-pase-head"> 
                    <div className="tab-group-profile">
                      <button className={`tab-switch-profile ${step === 1 ? 'active' : ''}`}  onClick={() => setStep(1)}>Leave</button>
                      <button className={`tab-switch-profile ${step === 2 ? 'active' : ''}`}  onClick={() => setStep(2)}>Permission</button>
                      <button className={`tab-switch-profile ${step === 3 ? 'active' : ''}`}  onClick={() => setStep(3)}>Status</button>
                  </div>
                 </div>
                 <div className="profile-card-pase-body pt-4">
                {step === 1 && (
                  <>
                  <div className="row">
                    <div className="col-6">
                      <label htmlFor="date" className="fw-500">From</label>
                      <input type="date" className="profile-form-controle mt-2" name="from_date"
                      value={leaveForm.from_date} onChange={handleLeaveChange} />
                     </div>
                      <div className="col-6">
                      <label htmlFor="date" className="fw-500">To</label>
                      <input type="date" className="profile-form-controle mt-2"
                      name="to_date"
                      value={leaveForm.to_date} onChange={handleLeaveChange} />
                      </div> 
                     </div>
                    <div className="row mt-4">
                     <div className="col-6">
                       <label htmlFor="ltype" className="fw-500 mb-2">Type</label>
                       <CommonSelect 
                        name="ltype"
                        options={typeleave}
                        placeholder="Select Leave  type"
                        value={ltype}
                        onChange={setLtype}/>
                     </div>
                     <div className="col-6">
                      <label htmlFor="duration" className="fw-500 mb-2">Duration</label>
                      <CommonSelect 
                      name="duration"
                       options={leaveDuration}               
                       placeholder="Select leave duration"
                       value={duration}
                       onChange={setDuration}  />
                    </div>
                   </div> 
                    <div className="row mt-4">
                      <div className="col-12">
                      <label htmlFor="reason" className="fw-500">Reason</label>
                       <textarea 
                        className="profile-form-controle mt-2" 
                        rows="5"
                        name="reason"
                        value={leaveForm.reason}
                        onChange={handleLeaveChange}
                        placeholder="Enter your Reason "
                        style={{ resize: 'none' }}
                        required
                      />
                    </div>
                    </div>
                    </>
                  )}
                  {step === 2 && (
                    <div className="row">
                       <div className="col-6">
                         <label htmlFor="time" className="fw-500">From</label>
                         <input type="time" name="from_time"
                         value={permissionForm.from_time}
                         onChange={handlePermissionChange} className="profile-form-controle mt-2" />
                       </div>
                       <div className="col-6">
                         <label htmlFor="time" className="fw-500 ">To</label>
                         <input type="time"  name="to_time"
                         value={permissionForm.to_time}
                         onChange={handlePermissionChange} className="profile-form-controle mt-2" />
                       </div>
                       <div className="col-12 mt-4">
                         <label htmlFor="type_leave" className="fw-500">Reason</label>
                         <textarea 
                         className="profile-form-controle mt-2"
                         rows="5"
                         name="reason"
                         onChange={handlePermissionChange}
                         value={permissionForm.reason}
                         placeholder="Enter your Reason "
                         style={{ resize: 'none' ,backgroundColor: "#ffffff" }}
                         required
                         />
                       </div> 
                    </div>
                  )}

                  {step === 3 && (
                    <div className='h-100 w-100  pb-0'>
                    <div className='table-common-profile-st'>
                      <div className='tb-header-row-profile-st display-flex'>
                        <div className='brcommon-col-profile-st w-12'>
                          S no
                        </div> <span style={{ color: "#129347" }}> | </span>
                        <div className='brcommon-col-profile-st w-22'>
                          Date
                        </div> <span style={{ color: "#129347" }}> | </span>
                        <div className='brcommon-col-profile-st w-22'>
                          Request
                        </div> <span style={{ color: "#129347" }}> | </span>
                        <div className='brcommon-col-profile-st w-22'>
                          Duration
                        </div> <span style={{ color: "#129347" }}> | </span>
                        <div className='brcommon-col-profile-st w-22'>
                          Status
                        </div> 
                      </div>
                      <div className='tb-body-row-profile-st'>
                           {status && status.length > 0 ? (
                              status.map((item, index) => (
                                <div key={item} className='display-flex br-rowst'>
                                  <div className='brcommon-col-profile-st w-12'>{index + 1}</div>
                                  <div className='brcommon-col-profile-st w-22'>{new Date(item.created_at).toISOString().slice(0, 10)}</div>
                                  <div className='brcommon-col-profile-st w-22'>{item.leave_type}</div>
                                  <div className='brcommon-col-profile-st w-22'>{item.duration}</div>
                                  <div className='brcommon-col-profile-st w-22'><span className={statusClassMap[item.user_status] || ""}>{item.user_status}</span></div>
                                </div>
                              ))
                            ) : (
                              <div className='no-satus-found '>
                                <div className=' w-100 h100  text-center '>
                                  No status found
                                </div>
                              </div>
                            )}
                      </div>    
                     </div> 
                    </div>
                  )}
                 </div>
                 <div className="profile-card-pase-footer">
                    <div className="d-flex justify-content-end gap-3   pt-3" >
                      <button type="button" className="product-cancel-button"  onClick={() => {step === 1 ? resetLeaveForm() : resetPermissionForm();}} >Clear</button>
                      <button type="button" className="product-next-btn" onClick={handleSubmit} >Save</button>
                    </div>
                 </div>
                 </>
               )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
