import { useState, useRef, useEffect } from "react"; 
import PropTypes from 'prop-types';
import { FaChevronDown  } from "react-icons/fa";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./inventory.css";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import configModule from '../../../config.js';
function Export({ onClose}) {
 const config = configModule.config();
      const [loading, setLoading] = useState(false);
      const [showPicker, setShowPicker] = useState(false);
      const [range, setRange] = useState([ { startDate: null, endDate: null, key: "selection" }]);
      const pickerRef = useRef(null); 
      useEffect(() => {
        const handleClickOutside = (event) => {
          if (pickerRef.current && !pickerRef.current.contains(event.target)) {
            setShowPicker(false); 
          }
        };
    
        if (showPicker) {
          document.addEventListener("mousedown", handleClickOutside);
        } else {
          document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [showPicker]);
    
    
      const prettyRange = range[0].startDate && range[0].endDate
        ? `${format(range[0].startDate, "dd MMM yy")} – ${format(
            range[0].endDate,
            "dd MMM yy"
          )}`
        : "Date range";
      const formatLocalDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

const handleDownload = async () => {
  setLoading(true);
  const localStart = formatLocalDate(range[0].startDate);
  const localEnd = formatLocalDate(range[0].endDate);
  try {
    const res = await axios.post(
      `${config.apiBaseUrl}inventoryfilter`,
      {
        startDate: localStart,
        endDate: localEnd,     
      },
      { responseType: "blob", validateStatus: false }
    );

    if (res.status === 404) {
      toast.info("No data found for the selected  date range.");
      return;
    }
    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
   a.download = `inventory_${localStart}_to_${localEnd}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("inventory downloaded successfully");
    setTimeout(() => {
      onClose();
    }, 1000);
  } catch (err) {
    console.error("Download Error:", err);
    toast.error("Something went wrong 😓");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="product-modal-overlay">
      <div className="inventry-modal-export">
        <div className="inventry-modal-header ">
          <h5 className="mb-0 inventry-view-header">Export Inventory</h5>
        </div>
        <div className="inventry-modal-body">
        <div className="  mt-3">  
         <div className="position-relative">
               <button className="lead-pill-export  align-items-center " onClick={() => setShowPicker((prev) => !prev)}>
                   {prettyRange} <FaChevronDown className="chevron" />
                 </button>
       
                 {showPicker && (
                   <div ref={pickerRef} className="picker-popover-export shadow">
                     <DateRange
                       ranges={[
                         {
                           startDate: range[0].startDate || new Date(),
                           endDate: range[0].endDate || new Date(),
                           key: "selection"
                         }
                       ]}
                       onChange={(item) => setRange([item.selection])}
                       moveRangeOnFirstSelection={false}
                       maxDate={new Date()}
                     />
                   </div>
                 )}
               </div>
        </div>
        </div>
        <div className="inventry-modal-body">
            <div className="iventry-modal-footer mt-4">
              <button className="cancel-button" onClick={onClose} >Cancel</button>
              <button className="inventry-update-btn" onClick={handleDownload} disabled={loading}> {loading ? "Exporting..." : "Export"}</button>
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

Export.propTypes = {
   onClose: PropTypes.func.isRequired,
};
export default Export;
