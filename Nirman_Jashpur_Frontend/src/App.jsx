import React, { useState } from 'react';
import {
  Home, LogIn, Download, Map, FileText,
  ClipboardList, BarChart
} from 'lucide-react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate
} from 'react-router-dom';

import './App.css';

import LoginPage from './Before_Login_pages/Login.jsx';
import HomePage from './Before_Login_pages/HomePage.jsx';
import DownloadPage from './Before_Login_pages/DownloadPage.jsx';
import DashboardPage from './After_Login_pages/DashboardPage.jsx';
import GISPage from './After_Login_pages/GISPage.jsx';
import WorkPage from './After_Login_pages/WorkPage.jsx';
import AddWorkPage from './After_Login_pages/AddToWork.jsx';
import TechnicalApprovalPage from './After_Login_pages/TechnicalApprovalPage.jsx';
import AdministrativeApprovalPage from './After_Login_pages/AdministrativeApprovalPage.jsx';
import TenderPage from './After_Login_pages/TenderPage.jsx';
import WorkOrderPage from './After_Login_pages/WorkOrderPage.jsx';
import WorkProgressPage from './After_Login_pages/WorkProgressPage.jsx';
import ReportsPage from './After_Login_pages/ReportsPage.jsx';
import WorkDetailsPage from './After_Login_pages/WorkDetails.jsx';
import Heading from './componentsfront/heading.jsx';
import About from './componentsfront/about.jsx';
import Display from './componentsfront/info.jsx';
import Details from './componentsfront/details.jsx';
import Footer from './componentsfront/footer.jsx';
import './index.css';
import './css/about.css';
import './css/heading.css';
import './css/details.css';
import './css/info.css';
import './css/footer.css';
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="app-container">
        {/* Public navbar (not logged in) */}
        {!isLoggedIn && <TopNavbar setIsLoggedIn={setIsLoggedIn} />}

        {/* Sidebar when logged in */}
        {isLoggedIn && (
          <SideNavbar
            onLogout={() => {
              setIsLoggedIn(false);
            }}
          />
        )}

        <main className={isLoggedIn ? 'logged-in-main' : ''}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />

            {/* Login */}
            <Route
              path="/login"
              element={
                isLoggedIn
                  ? <Navigate to="/dashboard" replace />
                  : <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
              }
            />
            <Route path="/download" element={<DownloadPage />} />

            {/* Private routes */}
            {isLoggedIn && (
              <>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/gis" element={<GISPage />} />
                <Route path="/work" element={<WorkPage onLogout={() => setIsLoggedIn(false)} />} />
                <Route path="/technical" element={<TechnicalApprovalPage onLogout={() => setIsLoggedIn(false)} />} />
                <Route path="/admin" element={<AdministrativeApprovalPage />} />
                <Route path="/tender" element={<TenderPage />} />
                <Route path="/order" element={<WorkOrderPage />} />
                <Route path="/progress" element={<WorkProgressPage />} />
                <Route path="/report" element={<ReportsPage />} />
                 <Route path="/add-work" element={<AddWorkPage />} />
                 <Route path="/work/:id" element={<WorkDetailsPage />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const TopNavbar = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const NavLink = ({ to, label, icon }) => (
    <button
      onClick={() => navigate(to)}
      className="nav-link"
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    // <header className="header">
    //   <div className="container">
    //     <div className="logo-group">
    //       <div className="logo-text">
    //         <span className="logo-cg">CG</span>
    //         <span className="logo-name">निर्माण जशपुर</span>
    //       </div>
    //       <span className="jashpur-text">Jashpur</span>
    //     </div>

    //     <nav className="nav-desktop">
    //       <NavLink to="/" label="मुखपृष्ठ" icon={<Home />} />
    //       <NavLink to="/login" label="विभागीय लॉगिन" icon={<LogIn />} />
    //       <NavLink to="/download" label="ऐप डाउनलोड करे" icon={<Download />} />
    //     </nav>
    //   </div>
    // </header>
    <div className='container'>
      <Heading/>
      <About/>
      <Display/>
      <Details/>
      <Footer/>
    </div>
  );
};

const SideNavbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const items = [
    { to: '/dashboard', label: 'डैशबोर्ड', icon: <Home /> },
    { to: '/work', label: 'कार्य', icon: <ClipboardList /> },
    { to: '/gis', label: 'GIS Fencing (Map)', icon: <Map /> },
    { to: '/technical', label: 'तकनीकी स्वीकृति', icon: <FileText /> },
    { to: '/admin', label: 'प्रशासकीय स्वीकृति', icon: <FileText /> },
    { to: '/tender', label: 'निविदा', icon: <FileText /> },
    { to: '/order', label: 'कार्य आदेश', icon: <ClipboardList /> },
    { to: '/progress', label: 'कार्य प्रगति', icon: <BarChart /> },
    { to: '/report', label: 'रिपोर्ट', icon: <FileText /> }
  ];
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
        {items.map(it => (
          <button key={it.to} onClick={() => navigate(it.to)}>
            {it.icon}<span>{it.label}</span>
          </button>
        ))}
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
