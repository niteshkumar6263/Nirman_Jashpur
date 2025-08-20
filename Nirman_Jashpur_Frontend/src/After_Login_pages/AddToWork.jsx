import React, { useState, useEffect } from 'react';
import './AddToWork.css';

const STORAGE_KEY = 'tribal_work_data_v1';

const initialState = {
  workYear: '',
  dept: '',
  subDept: '',
  centralDept: '',
  scheme: '',
  amount: '',
  longitude: '',
  latitude: '',
  areaType: '',
  block: '',
  ward: '',
  workType: '',
  workCategory: '',
  workName: '',
  engineer: '',
  sdo: '',
  startDate: ''
};


function loadWorkData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch { 
    return []; 
  }
}

function saveWorkData(rows) { 
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows)); 
}

export default function AddToWork({ onWorkAdded, prefilledData }){
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Initialize form with prefilled data if provided
  useEffect(() => {
    if (prefilledData) {
      setForm({
        workYear: prefilledData.year || '',
        dept: prefilledData.agency || '',
        subDept: prefilledData.details?.subDept || '',
        centralDept: prefilledData.details?.centralDept || '',
        scheme: prefilledData.plan || '',
        amount: prefilledData.amount || '',
        longitude: prefilledData.details?.longitude || '',
        latitude: prefilledData.details?.latitude || '',
        areaType: prefilledData.details?.areaType || '',
        block: prefilledData.vname || '',
        ward: prefilledData.details?.ward || '',
        workType: prefilledData.type || '',
        workCategory: prefilledData.details?.workCategory || '',
        workName: prefilledData.name || '',
        engineer: prefilledData.details?.engineer || '',
        sdo: prefilledData.details?.sdo || '',
        startDate: prefilledData.details?.startDate || ''
      });
    }
  }, [prefilledData]);

  function update(e){
    const { name, value } = e.target;
    setForm(f=>({...f,[name]:value}));
  }

  function validate(){
    const req = ['workYear','dept','subDept','centralDept','scheme','workType','workCategory','workName'];
    const err = {};
    
    // Check required fields
    req.forEach(k=>{ 
      if(!form[k] || form[k].trim() === '') {
        err[k]='* आवश्यक'; 
      }
    });
    
    // Additional validations
    if (form.amount && isNaN(parseFloat(form.amount))) {
      err.amount = '* वैध राशि दर्ज करें';
    }
    
    if (form.longitude && (isNaN(parseFloat(form.longitude)) || Math.abs(parseFloat(form.longitude)) > 180)) {
      err.longitude = '* वैध रेखांश दर्ज करें (-180 से 180)';
    }
    
    if (form.latitude && (isNaN(parseFloat(form.latitude)) || Math.abs(parseFloat(form.latitude)) > 90)) {
      err.latitude = '* वैध अक्षांश दर्ज करें (-90 से 90)';
    }
    
    if (form.startDate && form.startDate.trim() !== '') {
      // Basic date format validation (dd-mm-yyyy)
      const datePattern = /^\d{2}-\d{2}-\d{4}$/;
      if (!datePattern.test(form.startDate)) {
        err.startDate = '* तिथि dd-mm-yyyy प्रारूप में दर्ज करें';
      }
    }
    
    setErrors(err);
    return Object.keys(err).length===0;
  }

  function submit(e){
    e.preventDefault();
    if(!validate()) return;
    
    // Load existing work data
    const existingData = loadWorkData();
    
    // Create new work entry with data mapping to match WorkPage format
    const newId = (existingData.reduce((max, item) => Math.max(max, item.id || 0), 0)) + 1;
    const today = new Date().toLocaleDateString('en-GB'); // dd/mm/yyyy format
    
    const newWorkEntry = {
      id: newId,
      type: form.workType || 'कार्य प्रकार',
      year: form.workYear || new Date().getFullYear() + '-' + (new Date().getFullYear() + 1).toString().slice(-2),
      vname: form.ward || form.block || form.areaType || 'क्षेत्र',
      name: form.workName || 'कार्य का नाम',
      agency: form.dept || 'कार्य एजेंसी', 
      plan: form.scheme || 'योजना',
      amount: form.amount ? parseFloat(form.amount).toFixed(2) : '0.00',
      status: 'कार्य आदेश लम्बित',
      modified: today,
      // Store additional details that might be useful later
      details: {
        workCategory: form.workCategory,
        subDept: form.subDept,
        centralDept: form.centralDept,
        longitude: form.longitude,
        latitude: form.latitude,
        engineer: form.engineer,
        sdo: form.sdo,
        startDate: form.startDate
      }
    };
    
    // Add new entry to the beginning of the array (latest first)
    const updatedData = [newWorkEntry, ...existingData];
    
    // Save updated data
    saveWorkData(updatedData);
    
    // Show success modal
    setShowSuccessModal(true);
    
    // Reset form
    setForm(initialState);
    setErrors({});
  }

  function cancel(){
    if(window.confirm('रद्द करें? भरी गयी जानकारी मिट जाएगी।')){
      setForm(initialState); 
      setErrors({});
      // Navigate back to work page if callback provided
      if (onWorkAdded) {
        onWorkAdded();
      }
    }
  }

  return (
    <div className="atw-wrapper">
      <div className="atw-header-bar">
        <div className="atw-header-left">
          <h1 className="atw-title">निर्माण</h1>
          <div className="atw-breadcrumbs">Dashboard / Work / Work-Add</div>
        </div>
      </div>
      <div className="atw-main-card" role="region" aria-label="Add Work Form">
        <div className="atw-card-head">कार्य जोड़ें</div>
        <form className="atw-form" onSubmit={submit} noValidate>
          <div className="atw-form-title">कार्य जोड़ें</div>
          {/* Row 1 */}
          <div className="atw-grid">
            <div className="fld">
              <label>निर्माण वर्ष <span className="req">*</span></label>
              <select name="workYear" value={form.workYear} onChange={update}>
                <option value="">-- निर्माण वर्ष चुने --</option>
                <option>2024-25</option>
                <option>2023-24</option>
              </select>
              {errors.workYear && <small className="err">{errors.workYear}</small>}
            </div>
            <div className="fld">
              <label>कार्य विभाग <span className="req">*</span></label>
              <select name="dept" value={form.dept} onChange={update}>
                <option value="">-- कार्य विभाग चुने --</option>
                <option>आदिवासी विकास विभाग, जशपुर</option>
                <option>जनपद पंचायत</option>
              </select>
              {errors.dept && <small className="err">{errors.dept}</small>}
            </div>
            <div className="fld">
              <label>उपविभागीय विभाग <span className="req">*</span></label>
              <select name="subDept" value={form.subDept} onChange={update}>
                <option value="">-- उपविभागीय विभाग चुने --</option>
                <option>उपविभाग A</option>
                <option>उपविभाग B</option>
              </select>
              {errors.subDept && <small className="err">{errors.subDept}</small>}
            </div>
            <div className="fld">
              <label>केंद्रीय विभाग <span className="req">*</span></label>
              <select name="centralDept" value={form.centralDept} onChange={update}>
                <option value="">-- केंद्रीय विभाग चुने --</option>
                <option>केंद्रीय विभाग A</option>
                <option>केंद्रीय विभाग B</option>
              </select>
              {errors.centralDept && <small className="err">{errors.centralDept}</small>}
            </div>
          </div>
          {/* Row 2 */}
          <div className="atw-grid">
            <div className="fld span2">
              <label>अभिकरण (Agency) नोट</label>
              <div className="atw-inline-note">अभिकरण नहीं है</div>
            </div>
            <div className="fld">
              <label>योजना <span className="req">*</span></label>
              <select name="scheme" value={form.scheme} onChange={update}>
                <option value="">-- योजना चुने --</option>
                <option>CM योजना</option>
                <option>Block Plan</option>
              </select>
              {errors.scheme && <small className="err">{errors.scheme}</small>}
            </div>
            <div className="fld amt">
              <label>राशि (₹)</label>
              <input name="amount" value={form.amount} onChange={update} placeholder="राशि" type="number" step="0.01" min="0" />
              {errors.amount && <small className="err">{errors.amount}</small>}
            </div>
            <div className="fld file-up">
              <label style={{visibility:'hidden'}}>फ़ाइल</label>
              <button className="atw-file-btn" type="button" title="अपलोड">📄</button>
            </div>
            <div className="fld">
              <label>रेखांश (Longitude)</label>
              <input name="longitude" value={form.longitude} onChange={update} placeholder="रेखांश(Longitude)" type="number" step="any" />
              {errors.longitude && <small className="err">{errors.longitude}</small>}
            </div>
            <div className="fld">
              <label>अक्षांश (Latitude)</label>
              <input name="latitude" value={form.latitude} onChange={update} placeholder="अक्षांश(Latitude)" type="number" step="any" />
              {errors.latitude && <small className="err">{errors.latitude}</small>}
            </div>
          </div>
          {/* Row 3 */}
          <div className="atw-grid">
            <div className="fld">
              <label>क्षेत्र का प्रकार</label>
              <select name="areaType" value={form.areaType} onChange={update}>
                <option value="">-- प्रकार चुनें --</option>
                <option>ग्राम</option>
                <option>शहर</option>
              </select>
            </div>
            <div className="fld">
              <label>ब्लॉक / नगर</label>
              <select name="block" value={form.block} onChange={update}>
                <option value="">-- ब्लॉक चुने --</option>
                <option>Bagicha</option>
                <option>Jashpur</option>
              </select>
            </div>
            <div className="fld">
              <label>वार्ड / ग्राम</label>
              <select name="ward" value={form.ward} onChange={update}>
                <option value="">-- वार्ड चुने --</option>
                <option>Ward 1</option>
                <option>Ward 2</option>
              </select>
            </div>
            <div className="fld">
              <label>कार्य के प्रकार <span className="req">*</span></label>
              <select name="workType" value={form.workType} onChange={update}>
                <option value="">-- कार्य के प्रकार चुने --</option>
                <option>सीसी रोड</option>
                <option>भवन निर्माण</option>
              </select>
              {errors.workType && <small className="err">{errors.workType}</small>}
            </div>
            <div className="fld">
              <label>कार्य श्रेणी <span className="req">*</span></label>
              <select name="workCategory" value={form.workCategory} onChange={update}>
                <option value="">-- श्रेणी चुने --</option>
                <option>नई</option>
                <option>मरम्मत</option>
              </select>
              {errors.workCategory && <small className="err">{errors.workCategory}</small>}
            </div>
            <div className="fld">
              <label>कार्य का नाम <span className="req">*</span></label>
              <input name="workName" value={form.workName} onChange={update} placeholder="कार्य नाम" />
              {errors.workName && <small className="err">{errors.workName}</small>}
            </div>
            <div className="fld">
              <label>इंजीनियर अधिकारी</label>
              <select name="engineer" value={form.engineer} onChange={update}>
                <option value="">-- इंजीनियर चुने --</option>
                <option>Engineer A</option>
                <option>Engineer B</option>
              </select>
            </div>
            <div className="fld">
              <label>नियुक्त एसडीओ</label>
              <select name="sdo" value={form.sdo} onChange={update}>
                <option value="">-- एसडीओ चुनें --</option>
                <option>SDO A</option>
                <option>SDO B</option>
                <option>SDO C</option>
              </select>
            </div>
            <div className="fld">
              <label>कार्य आरंभ तिथि</label>
              <input name="startDate" value={form.startDate} onChange={update} placeholder="dd-mm-yyyy" />
              {errors.startDate && <small className="err">{errors.startDate}</small>}
            </div>
            <div className="fld checkbox-col span2">
              <label className="chk"><input type="checkbox" /> डी.पी.आर. प्राप्त नहीं है</label>
              <label className="chk"><input type="checkbox" /> निविदा है</label>
              <label className="chk"><input type="checkbox" /> निविदा प्राप्त नहीं है</label>
            </div>
          </div>
          <div className="atw-form-actions">
            <button type="submit" className="atw-btn primary">SUBMIT</button>
            <button type="button" className="atw-btn" onClick={cancel}>CANCEL</button>
          </div>
        </form>
      </div>
      <footer className="atw-footer">
        <span>Copyright © 2025 निर्माण</span>
        <span className="ver">Version 1.0</span>
      </footer>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h3>कार्य सफलतापूर्वक अपडेट हुआ!</h3>
              <p>Work Updated Successfully!</p>
              <button 
                className="modal-btn"
                onClick={() => {
                  setShowSuccessModal(false);
                  if (onWorkAdded) {
                    setTimeout(() => {
                      onWorkAdded();
                    }, 300);
                  }
                }}
              >
                ठीक है
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
