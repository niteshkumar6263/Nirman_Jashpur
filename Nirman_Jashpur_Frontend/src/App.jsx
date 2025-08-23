import React, { useState } from 'react';
import { Home, LogIn, Download, Settings, User, LogOut, Map, FileText, ClipboardList, BarChart, ChevronDown, ChevronRight } from 'lucide-react';
import './App.css';
import LoginPage from './Before_Login_pages/Login.jsx';
import HomePage from './Before_Login_pages/HomePage.jsx';
import DownloadPage from './Before_Login_pages/DownloadPage.jsx';
import DashboardPage from './After_Login_pages/DashboardPage.jsx';
import GISPage from './After_Login_pages/GISPage.jsx';
import WorkPage from './After_Login_pages/WorkPage.jsx';
import TechnicalApprovalPage from './After_Login_pages/TechnicalApprovalPage.jsx';
import AdministrativeApprovalPage from './After_Login_pages/AdministrativeApprovalPage.jsx';
import TenderPage from './After_Login_pages/TenderPage.jsx';
import WorkOrderPage from './After_Login_pages/WorkOrderPage.jsx';
import WorkProgressPage from './After_Login_pages/WorkProgressPage.jsx';
import ReportsPage from './After_Login_pages/ReportsPage.jsx';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Removed standalone early return; WorkPage will be embedded so navigation remains functional.
  const renderPageContent = () => {
    if (!isLoggedIn) {
      switch (currentPage) {
        case 'home':
          return <HomePage />;
        case 'login':
          return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
        case 'download':
          return <DownloadPage />;
        default:
          return <HomePage />;
      }
    } else {
      switch (currentPage) {
        case 'dashboard':
          return <DashboardPage />;
  case 'gis':
          return <GISPage />;
        case 'work':
          return <WorkPage standalone={false} />;
        case 'admin':
          return <AdministrativeApprovalPage />;
        case 'tender':
          return <TenderPage />;
        case 'order':
          return <WorkOrderPage />;
        case 'progress':
          return <WorkProgressPage />;
        case 'financial-year':
          return <ReportsPage reportType="financial-year" />;
        case 'report':
        case 'agency-wise':
        case 'approver-agency':
        case 'document-count':
        case 'time-pending':
        case 'block-wise':
        case 'scheme-wise':
        case 'scheme-work-list':
        case 'scheme-block-info':
        case 'engineer-wise':
        case 'photo-missing':
        case 'engineer-work-info':
        case 'sdo-wise':
        case 'work-type':
        case 'login-status':
        case 'final-status':
          return <ReportsPage reportType={currentPage} />;
        default:
          return <DashboardPage />;
      }
    }
  };

  return (
    <div className="app-container">
      {/* Public top navbar when not logged in */}
      {!isLoggedIn && (
        <TopNavbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
      {/* Sidebar for logged in pages except Technical (it has own full layout) */}
      {isLoggedIn && (
        <SideNavbar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onLogout={() => {
            setIsLoggedIn(false);
            setCurrentPage('home');
          }}
        />
      )}
      <main className={isLoggedIn ? 'logged-in-main' : ''}>
        {currentPage === 'technical' ? <TechnicalApprovalPage /> : renderPageContent()}
      </main>
    </div>
  );
};

const TopNavbar = ({ currentPage, setCurrentPage }) => {
  const NavLink = ({ page, label, icon }) => (
    <button
      onClick={() => setCurrentPage(page)}
      className={`nav-link ${currentPage === page ? 'active' : ''}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <header className="header">
      <div className="container">
        <div className="logo-group">
          <div className="logo-text">
            <span className="logo-cg">CG</span>
            <span className="logo-name">निर्माण जशपुर</span>
          </div>
          <span className="jashpur-text">Jashpur</span>
        </div>

        <nav className="nav-desktop">
          <NavLink page="home" label="मुखपृष्ठ" icon={<Home />} />
          <NavLink page="login" label="विभागीय लॉगिन" icon={<LogIn />} />
          <NavLink page="download" label="ऐप डाउनलोड करे" icon={<Download />} />
        </nav>
      </div>
    </header>
  );
};

const SideNavbar = ({ currentPage, setCurrentPage, onLogout }) => {
  const [expandedReports, setExpandedReports] = useState(false);

  const mainItems = [
    { k:'dashboard', label:'डैशबोर्ड', icon:<Home /> },
    { k:'work', label:'कार्य', icon:<ClipboardList /> },
    { k:'gis', label:'GIS Fencing (Map)', icon:<Map /> },
    { k:'technical', label:'तकनीकी स्वीकृति', icon:<FileText /> },
    { k:'admin', label:'प्रशासकीय स्वीकृति', icon:<FileText /> },
    { k:'tender', label:'निविदा', icon:<FileText /> },
    { k:'order', label:'कार्य आदेश', icon:<ClipboardList /> },
    { k:'progress', label:'कार्य प्रगति', icon:<BarChart /> },
    { k:'financial-year', label:'वित्तीय वर्ष', icon:<FileText /> },
  ];

  const reportSubItems = [
    { k:'agency-wise', label:'कार्य एजेंसीवार रिपोर्ट', icon:<FileText /> },
    { k:'approver-agency', label:'स्वीकृतकर्ता एजेंसीवार रिपोर्ट', icon:<FileText /> },
    { k:'document-count', label:'एजेंसीवार दस्तावेज़ों की संख्या रिपोर्ट', icon:<FileText /> },
    { k:'time-pending', label:'समय अवधि से लंबित रिपोर्ट', icon:<FileText /> },
    { k:'block-wise', label:'ब्लॉकवार रिपोर्ट', icon:<FileText /> },
    { k:'scheme-wise', label:'योजनावार रिपोर्ट', icon:<FileText /> },
    { k:'scheme-work-list', label:'योजनावार कार्य की सूची', icon:<FileText /> },
    { k:'scheme-block-info', label:'योजनावार ब्लॉक की जानकारी', icon:<FileText /> },
    { k:'engineer-wise', label:'इंजीनियर वाइज कार्य जानकारी', icon:<FileText /> },
    { k:'photo-missing', label:'फोटो रहित कार्य की जानकारी', icon:<FileText /> },
    { k:'engineer-work-info', label:'इंजीनियर कार्य जानकारी', icon:<FileText /> },
    { k:'sdo-wise', label:'एसडीओ वाइज रिपोर्ट', icon:<FileText /> },
    { k:'work-type', label:'कार्य के प्रकार तहत रिपोर्ट', icon:<FileText /> },
    { k:'login-status', label:'लॉगिन स्थिति रिपोर्ट', icon:<FileText /> },
    { k:'final-status', label:'कार्य की अंतिम स्थिति रिपोर्ट', icon:<FileText /> },
  ];

  const toggleReports = () => {
    setExpandedReports(!expandedReports);
  };

  const isReportPage = (page) => {
    return page === 'report' || reportSubItems.some(item => item.k === page);
  };

  return (
    <aside className="sidebar">
      <div className="s-logo">
        <div className="badge"><i className="fa-solid fa-certificate" style={{ color:'#fff' }}></i></div>
        <div className="hide-sm">
          <div className="s-name">Jashpur — निर्माण</div>
          <div className="s-sub">आदिवासी विकास विभाग</div>
        </div>
      </div>
      <nav className="menu" aria-label="मुख्य नेविगेशन">
        {mainItems.map(it => (
          <button key={it.k} className={currentPage===it.k? 'active': ''} onClick={()=>setCurrentPage(it.k)}>
            <i className="fa-solid fa-circle" style={{fontSize:6, display:'none'}}></i>{it.icon}<span>{it.label}</span>
          </button>
        ))}
        
        {/* Reports Section with Expandable Sub-items */}
        <div className="report-section">
          <button 
            className={`report-main ${isReportPage(currentPage) ? 'active' : ''}`} 
            onClick={toggleReports}
          >
            <FileText />
            <span>रिपोर्ट</span>
            {expandedReports ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          {expandedReports && (
            <div className="report-submenu">
              {reportSubItems.map(item => (
                <button 
                  key={item.k} 
                  className={`report-sub-item ${currentPage === item.k ? 'active' : ''}`}
                  onClick={() => setCurrentPage(item.k)}
                >
                  <span>• {item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="logout-btn" onClick={onLogout}>
          <i className="fa-solid fa-power-off" style={{width:26,textAlign:'center'}}></i>
          <span>लॉगआउट</span>
        </button>
      </nav>
      <div className="tribal"><div className="art" /></div>
    </aside>
  );
};
export default App;
