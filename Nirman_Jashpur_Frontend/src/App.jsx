import React, { useState } from 'react';
import { Home, LogIn, Download, Settings, User, LogOut, Map, FileText, ClipboardList, BarChart } from 'lucide-react';
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
          return <WorkPage />;
        case 'technical':
          return <TechnicalApprovalPage />;
        case 'admin':
          return <AdministrativeApprovalPage />;
        case 'tender':
          return <TenderPage />;
        case 'order':
          return <WorkOrderPage />;
        case 'progress':
          return <WorkProgressPage />;
        case 'report':
          return <ReportsPage />;
        default:
          return <DashboardPage />;
      }
    }
  };

  return (
    <div className="app-container">
      {!isLoggedIn ? (
        <TopNavbar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      ) : (
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
        {renderPageContent()}
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
  const NavItem = ({ page, label, icon }) => (
    <button
      onClick={() => setCurrentPage(page)}
      className={`side-nav-link ${currentPage === page ? 'active' : ''}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/logo.png" alt="Logo" className="sidebar-logo" />
        <p className="dept-name">Tribal Department</p>
        <p className="dept-sub">आदिवासी विकास विभाग, जशपुर</p>
      </div>
      <nav className="side-nav">
        <NavItem page="dashboard" label="डैशबोर्ड" icon={<Home />} />
        <NavItem page="gis" label="GIS Fencing (Map)" icon={<Map />} />
        <NavItem page="work" label="कार्य" icon={<ClipboardList />} />
        <NavItem page="technical" label="तकनीकी स्वीकृति" icon={<FileText />} />
        <NavItem page="admin" label="प्रशासकीय स्वीकृति" icon={<FileText />} />
        <NavItem page="tender" label="निविदा" icon={<FileText />} />
        <NavItem page="order" label="कार्य आदेश" icon={<ClipboardList />} />
        <NavItem page="progress" label="कार्य प्रगति" icon={<BarChart />} />
        <NavItem page="report" label="रिपोर्ट" icon={<FileText />} />
        <button onClick={onLogout} className="side-nav-link logout">
          <LogOut />
          <span>लॉगआउट</span>
        </button>
      </nav>
    </aside>
  );
};
export default App;
