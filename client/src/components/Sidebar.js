import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = () => {
  return (
    <div className="bg-info text-white d-flex flex-column p-3" style={{ width: '250px', height: '100vh' }}>
      <h4 className="mb-4">ManuScan</h4>
      <ul className="nav flex-column">
        <li className="nav-item mb-3">
          <Link to="/" className="nav-link text-white">Dashboard</Link>
        </li>
        <li className="nav-item mb-3">
          <Link to="/admin" className="nav-link text-white">Admin Panel</Link>
        </li>
        <li className="nav-item mb-3">
          <Link to="/transactions" className="nav-link text-white">Transaction Tracking</Link>
        </li>
        <li className="nav-item mb-3">
          <Link to="/defects" className="nav-link text-white">Defect Detection</Link>
        </li>
        <li className="nav-item mb-3">
          <Link to="/challans" className="nav-link text-white">Challan Generation</Link>
        </li>
      </ul>
      <div className="mt-auto">
        <Link to="/settings" className="nav-link text-white">Settings</Link>
      </div>
    </div>
  );
};

export default Sidebar;
