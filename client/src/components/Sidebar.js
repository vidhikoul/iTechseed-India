import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'

const Sidebar = () => {
  return (
    <div className="d-flex flex-column text-white p-3 vh-100" style={{ width: '300px', position: 'fixed', top: '0', left: '0', background: '#58A4B0' }}>
      {/* Logo and Title */}
      <div className="text-center mb-5">
        <img src="/Danalogo.png" alt="Logo" style={{ width: '50%', height: '50%' }} /><br></br><br></br>
        <img src="/ManuScan.svg" alt="Logo" style={{ paddingRight: "5%" }} />
        <img src="/ManuScan-Logo.svg" alt="Logo" />
      </div>

      {/* Navigation Links */}
      <ul className="nav flex-column">
        <li className="nav-item mb-3">
          <Link to="/Dashboard" className="nav-link text-white" style={{ fontWeight: "200", fontSize: "15px" }}>
            <img src="/dashboard.svg" alt="Dashboard Icon" className="me-2" />DASHBOARD
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link to="/AdminPanel" className="nav-link text-white" style={{ fontWeight: "200", fontSize: "15px" }}>
            <img src="/factory.svg" alt="Admin Icon" className="me-2" />ADMIN PANEL
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link to="/transactions" className="nav-link text-white" style={{ fontWeight: "200", fontSize: "15px" }}>
            <img src="/transaction.svg" alt="Transaction Icon" className="me-2" />TRANSACTION TRACKING
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link to="/defects" className="nav-link text-white" style={{ fontWeight: "200", fontSize: "15px" }}>
            <img src="/defect.svg" alt="Defect Icon" className="me-2" />DEFECT DETECTION
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link to="/challanGeneration" className="nav-link text-white" style={{ fontWeight: "200", fontSize: "15px" }}>
            <img src="/contract.svg" alt="Challan Icon" className="me-2" />CHALLAN GENERATION
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link to="/DeviceManagement" className="nav-link text-white" style={{ fontWeight: "200", fontSize: "15px" }}>
            <img src="/contract.svg" className="me-2" />DEVICE MANAGEMENT
          </Link>
        </li>
      </ul>

      {/* Settings Link - Push to Bottom */}
      <div className="mt-auto">
        <Link to="/settings" className="nav-link text-white" style={{ fontWeight: "200", fontSize: "15px" }}>
          <img src="/settings.png" alt="Settings Icon" className="me-2" />SETTINGS
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;