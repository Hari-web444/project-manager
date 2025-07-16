import React, { useState, useEffect } from 'react';
import { PropagateLoader } from 'react-spinners';
import '../../assets/styles/todolist.css';
import Pagination from "../../components/Pagination/index.jsx";
import { useAuth } from '../../components/context/Authcontext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import configModule from '../../../config.js';
import SvgContent from '../../components/svgcontent.jsx';
import CommonSelect from "../../components/common-select.jsx";
import DatePicker from 'react-datepicker';

function TodoList() {
  const { user } = useAuth();
  const userId = user?.userId;
  const config = configModule.config();
  const [needLoading, setNeedLoading] = useState(false);
  const [isBtnClicked, setIsBtnClicked] = useState("Follow up");
  const [todoDataList, setTodoDataList] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [dispositionList, setDispositionList] = useState([]);
  const [reAssignDate, setReAssignDate] = useState(null);
  const [comments, setComments] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);

  const indexOfLastTodo = currentPage * itemsPerPage;
  const indexOfFirstTodo = indexOfLastTodo - itemsPerPage;
  const paginatedTodoes = todoDataList.slice(indexOfFirstTodo, indexOfLastTodo);

  const currentTodoes = paginatedTodoes;

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const DispositionOpt = [
    { label: "Follow up", value: "Follow up" },
    { label: "Call back", value: "Call back" }
  ];

  const getLeadsPage = async () => {
    setNeedLoading(true);
    try {
      const response = await axios.post(`${config.apiBaseUrl}getTodoList`, {
        userId: userId,
        isBtnClicked: isBtnClicked
      });

      const result = response.data;

      if (response.status === 200) {
        setTodoDataList(result.leads);
      } else {
        toast.error("Failed to fetch designation list: " + result.message);
      }
    } catch (error) {
      toast.error("Error fetching designation list: " + (error.response?.data?.message || error.message));
    } finally {
      setNeedLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getLeadsPage();
    }
  }, [user, isBtnClicked]);

  const formatDateTime = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid date";
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const updateLeadsData = async () => {
    setNeedLoading(true);
    try {
      const response = await axios.post(`${config.apiBaseUrl}updateLeads`, {
        disposition: dispositionList?.target?.value || '',
        date: formatDateToMySQL(reAssignDate) || null,
        comment: comments || '',
        lead_id: selectedRow.lead_recid || null,
        userId: userId
      });

      const result = response.data;

      if (response.status === 200) {
        toast.success("Updated successfully.");

        setTimeout(() => {
          setShowModal(false);
          getLeadsPage();
        }, 2000);
      } else {
        toast.error("Failed to fetch designation list: " + result.message);
      }
    } catch (error) {
      toast.error("Error fetching designation list: " + (error.response?.data?.message || error.message));
    } finally {
      setNeedLoading(false);
    }
  };

  const formatDateToMySQL = (dateObj) => {
    const pad = (n) => String(n).padStart(2, '0');
    const year = dateObj.getFullYear();
    const month = pad(dateObj.getMonth() + 1);
    const day = pad(dateObj.getDate());
    const hours = pad(dateObj.getHours());
    const minutes = pad(dateObj.getMinutes());
    const seconds = pad(dateObj.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    if(selectedRow) {
      const defaultDisposition = DispositionOpt.find(opt => opt.value === selectedRow.disposition);
      setDispositionList(
        { target: { name: defaultDisposition.value, value: defaultDisposition.value } }
      );
    }
  }, [selectedRow]);

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
      <div className='d-flex align-items-center gap-2 p-2' style={{ height: "72px" }}>
        <button className={`filter-btn-st ${isBtnClicked === "Follow up" ? "bg-color-std" : ""}`} onClick={() => setIsBtnClicked("Follow up")} >Today’s Follow-ups</button>
        <button className={`filter-btn-st ${isBtnClicked === "Call back" ? "bg-color-std" : ""}`} onClick={() => setIsBtnClicked("Call back")}>Today’s Call back</button>
        <button className={`filter-btn-st ${isBtnClicked === "Leads" ? "bg-color-std" : ""}`} onClick={() => setIsBtnClicked("Leads")}>Today’s leads</button>
      </div>
      <div style={{ height: "calc(100% - 72px)" }} className='pe-2 ps-2'>

        <div className='h-100 w-100 p-2 pb-0'>
          <div className='table-common-st'>
            <div className='tb-header-row-st display-flex'>
              <div className='brcommon-col-st w-10'>
                S no
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-15'>
                Cust ID
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-10'>
                Category
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-15'>
                Mobile
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-10'>
                Disposition
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-20'>
                Comments
              </div> <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-10'>
                Date
              </div>  <span style={{ color: "#129347" }}> | </span>
              <div className='brcommon-col-st w-10'>
                Action
              </div>
            </div>

            <div className='tb-body-row-st'>
              {currentTodoes && currentTodoes.length > 0 ? (currentTodoes.map((item, index) => (
                <div className='display-flex br-rowst' key={item.lead_id}>
                  <div className='brcommon-col-st w-10'>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </div>
                  <div className='brcommon-col-st w-15'>
                    {item.lead_id}
                  </div>
                  <div className='brcommon-col-st w-10'>
                    {item.category}
                  </div>
                  <div className='brcommon-col-st w-15'>
                    {item.mobile_number}
                  </div>
                  <div className='brcommon-col-st w-10'>
                    {item.disposition}
                  </div>
                  <div className='brcommon-col-st w-20'>
                    {item.comments}
                  </div>
                  <div className='brcommon-col-st w-10'>
                    {formatDateTime(item.disposition_date)}
                  </div>
                  <div className='brcommon-col-st w-10'>
                    <button onClick={() => { setShowModal(true); setSelectedRow(item); }}>
                      <SvgContent svg_name="btn_edit" />
                    </button>
                  </div>
                </div>
              ))) : (
                <div className='tb-body-row-st display-flex'>
                  No todo list
                </div>
              )}

            </div>
          </div>
          <div className='footer-tab-st'>
            <label htmlFor="hfg" className="me-2">
              Results per page{" "}
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="row-per-page-select"
                style={{ width: "60px" }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </label>
            <Pagination
              count={todoDataList.length}
              page={currentPage}
              pageSize={itemsPerPage}
              onChange={(pageNo) => setCurrentPage(pageNo)}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay modal-overlay-position">
          <div className="modal-container modal-overlay-position" style={{ width: "625px" }}>
            <div className="modal-header">
              <h5 className="mb-0 add-new-hdr">Add new Branch</h5>
            </div>
            <div className="modal-body">
              <div className="container commonst-select mb-3">
                <h6>Disposition</h6>
                <div className="comm-select-ba">
                  <CommonSelect
                    header="Select disposition"
                    placeholder="Select disposition"
                    name="disposition"
                    value={dispositionList}
                    onChange={setDispositionList}
                    options={DispositionOpt}
                  />
                </div>
              </div>
              <div className="container commonst-select mb-3">
                <h6>Re-assigned Date</h6>
                <div className="comm-select-ba">
                  <DatePicker
                    selected={reAssignDate}
                    onChange={(date) => setReAssignDate(date)}
                    placeholderText="dd/mm/yyyy"
                    className="form-control-st"
                    dateFormat="dd-MM-yyyy"
                  />
                </div>
              </div>
              <div className="container commonst-select mb-3">
                <h6>Comments</h6>
                <div className="comm-select-ba">
                  <textarea
                    name="comments"
                    className="form-control location-ip-br"
                    placeholder="Enter comments"
                    style={{ minHeight: "182px" }}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    required
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="next-button" onClick={updateLeadsData} >Add</button>
            </div>
          </div>
        </div>
      )}

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

export default TodoList;
