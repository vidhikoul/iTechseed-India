// import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState, useEffect } from 'react';
import Usermanagement from './pages/adminpanel/Usermanagement';
import InventoryManagement from "./pages/adminpanel/InventoryManagement";
import ClientSupplierManagement from "./pages/adminpanel/ClientSupplierManagement";
import SAPDataImport from "./pages/adminpanel/SapDataImport";
import Header from './components/Header';
import Footer from './components/Footer';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Home from './components/Home';
import Challan from './pages/transactionsPage/Challan';
import Registration from "./pages/Registration/Register";
import Dashboard from './components/Dashboard';
import Login from './pages/loginPage/Login'
import Overview from './pages/overview/Overview';
import AdminPanel from './pages/adminpanel/AdminPanel';
import TransactionChallan from './pages/transactionsPage/TransactionChallan';
import DeviceManagement from './pages/DeviceManagement/DeviceManagement';
import TransactionTracking from './pages/transactionsPage/TransactionTracking';
import DefectDetection from './pages/DefectDetection/DefectDetection';
import DefectChallan from './pages/DefectDetection/DefectChallan';
// import SapDataImport from './pages/AdminPanel/SapDataImport';
const Sidebar = () => {
  return (
    <div className="bg-info text-white d-flex flex-column p-3" style={{ width: '250px', height: '100vh' }}>
      <h4 className="mb-4">ManuScan</h4>
      <ul className="nav flex-column">
        <li className="nav-item mb-3">
          <Link to="/Dashboard" className="nav-link text-white">Dashboard</Link>
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);


  return (
    <Router>
      <div id="root" className="d-flex">
        {/* <Sidxebar /> */}
        <div className="flex-grow-1">
          <main className="main-content">
            <Routes>
              {/* Login Route */}
              <Route path="/" element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/Dashboard" />} />

              {/* Home Route */}
              <Route path="/Dashboard" element={isLoggedIn ? <Dashboard setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />} />

              {/* Other Routes */}
              <Route path="/Registration" element={<Registration />} />
              <Route path="/Overview" element={<Overview />} />
              <Route path="/ForgotPassword" element={<ForgotPassword />} />
              <Route path="/Dashboard" element={<Dashboard/>} />
              <Route path="/AdminPanel" element={<AdminPanel/>} />
              <Route path="/Usermanagement" element={<Usermanagement/>} /> {/* Ensure path matches navigate() */}
              <Route path="/InventoryManagement" element={<InventoryManagement />} />
              <Route path="/ClientSupplierManagement" element={<ClientSupplierManagement />} />
              <Route path="/SAPDataImport" element={<SAPDataImport />} />
              <Route path="/transactions" element={<TransactionTracking />} />
              <Route path="/TransactionChallan" element={<TransactionChallan />} />
              <Route path="/defects" element={<DefectDetection/>} />
              <Route path="/defectChallan" element={<DefectChallan />} />
              <Route path="/challans" element={<Challan />} />
              {/* <Route path="/SapDataImport" element={<SapDataImport/>} /> */}
              {/* Example Admin Routes */}
              {/* <Route path="/admin" element={<div>Admin Panel</div>} />
              <Route path="/transactions" element={<div>Transaction Tracking</div>} />
              <Route path="/defects" element={<div>Defect Detection</div>} />
              <Route path="/challans" element={<div>Challan Generation</div>} />
              <Route path="/settings" element={<div>Settings Page</div>} /> */}
            </Routes>
          </main>
          {/* <Footer /> */}
        </div>
      </div>
    </Router>
  );
}

export default App;