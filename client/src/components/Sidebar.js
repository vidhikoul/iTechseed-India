import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = () => {
  return (
    <div className="d-flex flex-column bg-info text-white p-3 vh-100" style={{ width: '300px', position: 'fixed', top: '0', left: '0' }}>
      {/* Logo and Title */}
      <div className="text-center mb-4">
        <img src="/Danalogo.png" alt="Logo" style={{ width: '80px', height: '80px' }} />
        <h4 className="mt-2">ManuScan</h4>
      </div>

      {/* Navigation Links */}
      <ul className="nav flex-column">
        <li className="nav-item mb-3">
          <Link to="/" className="nav-link text-white fw-bold">
            <img src="/dashboard.png" alt="Dashboard Icon" className="me-2" />Dashboard
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link to="/AdminPanel" className="nav-link text-white fw-bold">
            <img src="/factory.png" alt="Admin Icon" className="me-2" />Admin Panel
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link to="/transactions" className="nav-link text-white fw-bold">
            <img src="/transaction.png" alt="Transaction Icon" className="me-2" />Transaction Tracking
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link to="/defects" className="nav-link text-white fw-bold">
            <img src="/transaction.png" alt="Defect Icon" className="me-2" />Defect Detection
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link to="/challans" className="nav-link text-white fw-bold">
            <img src="/contract.png" alt="Challan Icon" className="me-2" />Challan Generation
          </Link>
        </li>
      </ul>

      {/* Settings Link - Push to Bottom */}
      <div className="mt-auto">
        <Link to="/settings" className="nav-link text-white fw-bold">
          <img src="/settings.png" alt="Settings Icon" className="me-2" />Settings
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
