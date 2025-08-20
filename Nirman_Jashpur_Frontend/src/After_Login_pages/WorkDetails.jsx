import React, { useState, useEffect } from 'react';
import './WorkDetails.css';

// Shared work data utilities
const STORAGE_KEY = 'tribal_work_data_v1';
const defaultRows = [
  { id: 1, type: 'सीसी रोड', year: '2024-25', vname: 'Bagicha', name: 'सी.सी.रोड निर्माण, पंचायत भवन से देवघर के घर तक, ग्राम पंचायत बुढ़ाढांड', agency: 'Janpad पंचायत', plan: 'Suguja Chhetra Pradhikaran', amount: '10.00', status: 'कार्य आदेश लम्बित', modified: '14-08-2025' },
  { id: 2, type: 'सड़क निर्माण कार्य', year: '2024-25', vname: 'Bagicha', name: 'सड़क जीर्णोद्धार कार्य', agency: 'Janpad पंचायत', plan: 'Suguja', amount: '12.00', status: 'कार्य आदेश लम्बित', modified: '14-08-2025' },
  { id: 3, type: 'पंचायती भवन', year: '2023-24', vname: 'Budhadand', name: 'पंचायत भवन निर्माण', agency: 'Gram Panchayat', plan: 'Block Plan', amount: '5.00', status: 'समाप्त', modified: '10-06-2024' }
];

function loadWorkData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...defaultRows];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [...defaultRows];
  } catch { return [...defaultRows]; }
}

const WorkDetails = ({ workId, onLogout, onBack, onAcceptWork }) => {
  const [workData, setWorkData] = useState(null);
  const [allWorks, setAllWorks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load Font Awesome and fonts - this useEffect must come before any conditional returns
  useEffect(() => {
    if (!document.querySelector('link[href*="font-awesome"], link[data-fa]')) {
      const l = document.createElement('link'); 
      l.rel = 'stylesheet'; 
      l.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'; 
      l.setAttribute('data-fa', '1'); 
      document.head.appendChild(l);
    }
    if (!document.querySelector('link[href*="Noto+Sans+Devanagari"], link[data-noto]')) {
      const g = document.createElement('link'); 
      g.rel='stylesheet'; 
      g.href='https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&display=swap'; 
      g.setAttribute('data-noto','1'); 
      document.head.appendChild(g);
    }
  }, []);

  // Handle accept work - navigate to AddToWork with pre-filled data
  const handleAccept = () => {
    if (workData && onAcceptWork) {
      onAcceptWork(workData);
    }
  };

  // Load work data on mount and when workId changes
  useEffect(() => {
    const works = loadWorkData();
    setAllWorks(works);
    
    if (workId) {
      const selectedWork = works.find(work => work.id === parseInt(workId));
      const index = works.findIndex(work => work.id === parseInt(workId));
      setWorkData(selectedWork || works[0]); // fallback to first work if not found
      setCurrentIndex(index >= 0 ? index : 0);
    } else {
      setWorkData(works[0]); // fallback to first work if no ID provided
      setCurrentIndex(0);
    }
  }, [workId]);

  // Navigation functions
  const goToPrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setWorkData(allWorks[newIndex]);
    }
  };

  const goToNext = () => {
    if (currentIndex < allWorks.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setWorkData(allWorks[newIndex]);
    }
  };

  // If no work data is loaded yet, show loading
  if (!workData) {
    return (
      <div className="work-details-ref">
        <div className="header">
          <div className="top">
            <div>
              <div className="crumbs">निर्माण / कार्य विवरण</div>
              <div className="title"><h1>निर्माण</h1></div>
            </div>
          </div>
        </div>
        <div className="wrap">
          <div style={{textAlign: 'center', padding: '50px'}}>
            <h3>डेटा लोड हो रहा है...</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="work-details-ref">
      <div className="header">
        <div className="top">
          <div>
            <div className="crumbs">
              <button onClick={onBack} style={{background:'none', border:'none', color:'inherit', cursor:'pointer', textDecoration:'underline'}}>
                निर्माण / कार्य सूची
              </button> / कार्य विवरण
            </div>
            <div className="title">
              <h1>निर्माण - कार्य विवरण ({currentIndex + 1} of {allWorks.length})</h1>
            </div>
          </div>
          <div className="user">
            <div className="ic" tabIndex={0} aria-label="User profile">
              <i className="fa-solid fa-user" />
            </div>
            <button 
              className="logout" 
              aria-label="Logout" 
              type="button" 
              onClick={onLogout || (() => {
                if (window.confirm('क्या आप लॉगआउट करना चाहते हैं?')) {
                  window.location.href = '/';
                }
              })}
            >
              <i className="fa-solid fa-power-off" />
            </button>
          </div>
        </div>
        <div className="subbar">
          <span className="dot" />
          <h2>कार्य विवरण</h2>
        </div>
      </div>

      <div className="wrap">
        <div className="content-grid">
          {/* Main Work Details Section */}
          <div className="main-section">
            <section className="panel work-info">
              <div className="panel-header">
                <h3>कार्य सूची - {workData.type}</h3>
                <div style={{fontSize:'12px', opacity:0.9}}>
                  ID: {workData.id} | कार्य {currentIndex + 1} of {allWorks.length}
                </div>
              </div>
              <div className="p-body">
                <div className="work-details-grid">
                  <div className="detail-row">
                    <label>कार्य का नाम</label>
                    <span>{workData.name}</span>
                  </div>
                  <div className="detail-row">
                    <label>कार्य के प्रकार</label>
                    <span>{workData.type}</span>
                  </div>
                  <div className="detail-row">
                    <label>ग्राम/वार्ड</label>
                    <span>{workData.vname}</span>
                  </div>
                  <div className="detail-row">
                    <label>कार्य एजेंसी</label>
                    <span>{workData.agency}</span>
                  </div>
                  <div className="detail-row">
                    <label>स्वीकृत वर्ष</label>
                    <span>{workData.year}</span>
                  </div>
                  <div className="detail-row">
                    <label>योजना</label>
                    <span>{workData.plan}</span>
                  </div>
                  <div className="detail-row">
                    <label>राशि (लाख में)</label>
                    <span>{workData.amount}</span>
                  </div>
                  <div className="detail-row">
                    <label>कार्य की स्थिति</label>
                    <span className={`status-badge ${workData.status === 'समाप्त' ? 'completed' : 'pending'}`}>
                      {workData.status}
                    </span>
                  </div>
                  <div className="detail-row">
                    <label>अंतिम संशोधन</label>
                    <span>{workData.modified}</span>
                  </div>
                  <div className="detail-row">
                    <label>अनुमानित लागत</label>
                    <span>{workData.agency}</span>
                  </div>
                  <div className="detail-row">
                    <label>स्वीकृत मद</label>
                    <span>{workData.agency}</span>
                  </div>
                  <div className="detail-row">
                    <label>निष्पादन कार्यालय</label>
                    <span>{workData.agency}</span>
                  </div>
                  <div className="detail-row">
                    <label>दिनांक(Longitude)</label>
                    <span>-</span>
                  </div>
                  <div className="detail-row">
                    <label>अक्षांश(Latitude)</label>
                    <span>-</span>
                  </div>
                  <div className="detail-row">
                    <label>विकास</label>
                    <span>हाँ/नहीं</span>
                  </div>
                  <div className="detail-row">
                    <label>कार्य स्वीकृति दिनांक की तिथि</label>
                    <span>15-09-2025</span>
                  </div>
                </div>
                
                {/* Navigation arrows */}
                <div className="nav-arrows">
                  <button 
                    className={`nav-btn left ${currentIndex === 0 ? 'disabled' : ''}`} 
                    aria-label="Previous" 
                    onClick={goToPrevious}
                    disabled={currentIndex === 0}
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </button>
                  <button 
                    className={`nav-btn right ${currentIndex === allWorks.length - 1 ? 'disabled' : ''}`} 
                    aria-label="Next" 
                    onClick={goToNext}
                    disabled={currentIndex === allWorks.length - 1}
                  >
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="sidebar-section">
            {/* Engineer Details */}
            <section className="panel engineer-details">
              <div className="panel-header">
                <h3>इंजीनियर</h3>
              </div>
              <div className="p-body">
                <div className="engineer-info">
                  <div className="detail-row">
                    <label>नाम</label>
                    <span>Devarchan Malakar</span>
                  </div>
                  <div className="detail-row">
                    <label>मोबाइल नं</label>
                    <span>9399730973</span>
                  </div>
                </div>
              </div>
            </section>

            {/* AE Details */}
            <section className="panel ae-details">
              <div className="panel-header">
                <h3>ए.ई</h3>
              </div>
              <div className="p-body">
                <div className="ae-info">
                  <div className="detail-row">
                    <label>मोबाइल नं</label>
                    <span>Son Sai Patnakar</span>
                  </div>
                  <div className="detail-row">
                    <label>मोबाइल नं</label>
                    <span>6261124489</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Department Name */}
            <section className="panel dept-details">
              <div className="panel-header">
                <h3>जाहँत विभाग का नाम</h3>
              </div>
              <div className="p-body">
                <div className="dept-info">
                  <div className="detail-row">
                    <label>नाम</label>
                    <span>Tribal Department</span>
                  </div>
                  <div className="detail-row">
                    <label>मोबाइल नं</label>
                    <span>-</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Current Status */}
            <section className="panel status-details">
              <div className="panel-header">
                <h3>वर्तमान स्थिति</h3>
              </div>
              <div className="p-body">
                <div className="status-info">
                  <h4>कार्य आदेश लंबित</h4>
                  <div className="status-dates">
                    <div className="status-item">
                      <label>कार्य दिनांक</label>
                      <span>18-08-2025</span>
                    </div>
                    <div className="status-item">
                      <label>अंतिम दिनांक</label>
                      <span>18-08-2025</span>
                    </div>
                  </div>
                  <div className="status-actions">
                    <button className="btn green" onClick={handleAccept}>
                      <i className="fa-solid fa-check"></i>
                      स्वीकार करें
                    </button>
                    <button className="btn red">
                      <i className="fa-solid fa-times"></i>
                      रिजेक्ट करें
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Bottom Sections */}
        <div className="bottom-sections">
          <div className="approval-sections">
            {/* Technical Approval */}
            <section className="panel approval-section">
              <div className="panel-header approval-header">
                <h3>तकनीकी स्वीकृति 📝</h3>
              </div>
              <div className="p-body">
                <div className="approval-grid">
                  <div className="approval-item">
                    <label>तकनीकी स्वीकृति क्रमांक</label>
                    <span>1166</span>
                  </div>
                  <div className="approval-item">
                    <label>तकनीकी स्वीकृति दिनांक</label>
                    <span>27-02-2025</span>
                  </div>
                  <div className="approval-item">
                    <label>तकनीकी स्वीकृति राशि</label>
                    <span>10.00</span>
                  </div>
                  <div className="approval-item">
                    <label>तकनीकी स्वीकृति प्रेषण दिनांक</label>
                    <span>27-02-2025</span>
                  </div>
                  <div className="approval-item">
                    <label>टिप्पणी</label>
                    <span>-</span>
                  </div>
                  <div className="approval-item">
                    <label>संलग्न फाइल</label>
                    <span className="file-link">देखें</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Administrative Approval */}
            <section className="panel approval-section">
              <div className="panel-header approval-header">
                <h3>प्रशासकीय स्वीकृति 📝</h3>
              </div>
              <div className="p-body">
                <div className="approval-grid">
                  <div className="approval-item">
                    <label>ए.एस द्वारा</label>
                    <span>ए.एस द्वारा</span>
                  </div>
                  <div className="approval-item">
                    <label>जिला</label>
                    <span>जिला</span>
                  </div>
                  <div className="approval-item">
                    <label>प्रशासकीय स्वीकृति क्रमांक</label>
                    <span>135</span>
                  </div>
                  <div className="approval-item">
                    <label>प्रशासकीय स्वीकृति दिनांक</label>
                    <span>21-04-2025</span>
                  </div>
                  <div className="approval-item">
                    <label>प्रशासकीय स्वीकृति राशि</label>
                    <span>10.00</span>
                  </div>
                  <div className="approval-item">
                    <label>टिप्पणी</label>
                    <span>-</span>
                  </div>
                  <div className="approval-item">
                    <label>संलग्न फाइल</label>
                    <span className="file-link">देखें</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkDetails;
