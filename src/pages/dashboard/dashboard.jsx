import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/styles/dashboard.css';
import AnimatedCounter from '../../components/AnimatedCounter.jsx';
import ModalPopup from '../../components/modal-popup.jsx';
import configModule from '../../../config.js';
import { useAuth } from '../../components/context/Authcontext.jsx'; 

import lead_dbc from '../../assets/images/lead_dbc.svg';
import revenue_dbc from '../../assets/images/revenue_dbc.svg';
import expense_dbc from '../../assets/images/expense_dbc.svg';
import orders from '../../assets/images/orders.svg';
import req_pending from '../../assets/images/req_pending.svg';
import permission from '../../assets/images/permission.svg';

import call_back from '../../assets/images/call_back.svg';
import total_sales from '../../assets/images/total_sales.svg';
import saleofmonth from '../../assets/images/saleofmonth.svg';
import performer from '../../assets/images/performer.svg';
import follow_up from '../../assets/images/follow_up.svg';
import register from '../../assets/images/register.svg';

function Dashboard() {
  const today = new Date();
  const [initialPopup, setInitialPopup] = useState(false);
  const config = configModule.config();
  const { user } = useAuth();
  const user_typecode = user?.user_typecode;
  const userId = user?.userId;
  const loginTime = user?.loginTime;
  const formattedLoginTime = loginTime ? new Date(loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : '';
  let cardData = [];
  
  if (user_typecode === "AD") {
    cardData = [
      { name: "Today’s leads", img: lead_dbc, count: 45 },
      { name: "Total Revenue", img: revenue_dbc, count: 65 },
      { name: "Total Expenses", img: expense_dbc, count: 25 },
      { name: "Pending orders", img: orders, count: 85 },
      { name: "Total pending leave request", img: req_pending, count: 35 },
      { name: "Total pending Permission request", img: permission, count: 75 },
    ];
  } else if (user_typecode === "TSL") {
    cardData = [
      { name: "Star performer", img: performer, count: 55 },
      { name: "Total sales of the month", img: saleofmonth, count: 85 },
      { name: "Today’s sales", img: total_sales, count: 15 },
      { name: "Today’s leads", img: lead_dbc, count: 25 },
      { name: "Today’s Follow-up’s", img: follow_up, count: 35 },
      { name: "Today’s Call backs", img: call_back, count: 95 },
    ];
  } else if (user_typecode === "TCL") {
    cardData = [
      { name: "Star performer", img: performer, count: 55 },
      { name: "Total sales of the month", img: saleofmonth, count: 85 },
      { name: "Today’s sales", img: total_sales, count: 15 },
      { name: "Today’s Registrations", img: register, count: 254 },
      { name: "Today’s leads", img: lead_dbc, count: 25 },
      { name: "Today’s Follow-up’s", img: follow_up, count: 35 },
      { name: "Today’s Call backs", img: call_back, count: 95 },
    ];
  }

  const checkLeadCount = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}CheckLeadCount`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: parseInt(userId) })
      });

      const result = await response.json();
      if (response.ok) {
        if (result.data.length > 0) {
          setInitialPopup(false);
        } else {
          setInitialPopup(true);
        }
      } else {
        toast.error("Failed to submit count: " + result.message);
        setInitialPopup(true);
      }
    } catch (error) {
      toast.error("Error submitting count: " + error.message);
      setInitialPopup(false);
    }
  };

  useEffect(() => {
    checkLeadCount();
  }, [checkLeadCount]);

  const closeInitialModal = () => {
    setInitialPopup(false);
  };

  const formattedDate = `${today.toLocaleDateString("en-US", { weekday: "long" })}, ${today
    .toLocaleDateString("en-GB")
    .split("/")
    .join("-")}`;

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
        theme="colored"
      />

      {(initialPopup && user_typecode !== "AD") && (<ModalPopup userId={userId} closeModal={closeInitialModal} />)}
      <div className='header-container-db w-100'>
        <h2 className='welcome-st mb-0'>Welcome!</h2>
        <p className='mb-0'>{formattedDate} / Login - {formattedLoginTime}</p>
      </div>
      <div className='body-container-db'>
        <div className="container-db display-flex">
          <div className="row h-100 w-100 db-cards-st justify-content-center">
            {user_typecode === "TCL" ? (
              cardData.map((item, index) => (
                <div className="col-12 col-md-6 col-lg-3" style={{ minHeight: "232px", position: "relative" }} key={index}>
                  <div className="card text-center bg-light-db p-2 h-100 dbcard-bg position-relative">
                    <img src={item.img} className='card-bgimg' alt={item.name} />
                    <h5 className="pt-4 mb-0">{item.name}</h5>
                    <div className="fw-bold mb-0 countst-db" style={{ zIndex: 1000 }}>
                      {item.name === "Star performer" && (<h6>Emp ID / Name</h6>)}
                      {(item.name === "Total sales of the month" || item.name === "Today’s sales") ?
                        (
                          <>
                            <h6>00 / ₹ 0000</h6>
                            <div className='display-flex'>
                              <h2>₹</h2> <AnimatedCounter start={0} end={item.count} duration={1000} />
                            </div>
                            <h6>
                              Incentive earned
                            </h6>
                          </>
                        ) :
                        (
                          item.name === "Today’s leads" ? (
                            <div className='d-flex'>
                              <AnimatedCounter start={0} end={item.count} duration={1000} /> / <AnimatedCounter start={0} end="60" duration={1000} />
                            </div>) : (<AnimatedCounter start={0} end={item.count} duration={1000} />)
                        )}
                    </div>
                  </div>
                  <div className="ribbon"><span></span></div>
                </div>
              ))
            ) : (
              cardData.map((item, index) => (
                <div className="col-12 col-md-6 col-lg-4" style={{ minHeight: "232px", position: "relative" }} key={index}>
                  <div className="card text-center bg-light-db p-2 h-100 dbcard-bg position-relative">
                    <img src={item.img} className='card-bgimg' alt={item.name} />
                    <h5 className="pt-4 mb-0" style={{ fontWeight: "600" }}>{item.name}</h5>
                    <div className="fw-bold mb-0 countst-db" style={{ zIndex: 1000 }}>
                      {item.name === "Star performer" && (<h6>Emp ID / Name</h6>)}
                      {(item.name === "Total sales of the month" || item.name === "Today’s sales") ?
                        (
                          <>
                            <h6>00 / ₹ 0000</h6>
                            <div className='display-flex'>
                              <h2>₹</h2> <AnimatedCounter start={0} end={item.count} duration={1000} />
                            </div>
                            <h6>
                              Incentive earned
                            </h6>
                          </>
                        ) :
                        (
                          item.name === "Today’s leads" ? (
                            <div className='d-flex'>
                              <AnimatedCounter start={0} end={item.count} duration={1000} /> &nbsp;<h5>/60</h5>
                            </div>) : (<AnimatedCounter start={0} end={item.count} duration={1000} />)
                        )}
                    </div>
                  </div>
                  <div className="ribbon"><span></span></div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
