import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Usermanagement from "./pages/AdminPanel/Usermanagement"; // Ensure correct import
import InventoryManagement from "./pages/AdminPanel/InventoryManagement";
import ClientSupplierManagement from "./pages/AdminPanel/ClientSupplierManagement";
import SAPDataImport from "./pages/AdminPanel/SapDataImport";
import Header from './components/Header';
import Footer from './components/Footer';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Home from './components/Home';
import Registration from "./pages/Registration/Register";
import Dashboard from './components/Dashboard';
import LoginPage from './pages/LoginPage/Login';
import OverviewPage from './pages/Overview/Overview';
import AdminPanel from './pages/AdminPanel/AdminPanel';
// import SapDataImport from './pages/AdminPanel/SapDataImport';
const Sidebar = () => {
  return (
    <div className="bg-info text-white d-flex flex-column p-3" style={{ width: '250px', height: '100vh' }}>
      <h4 className="mb-4">ManuScan</h4>
      <ul className="nav flex-column">
        <li className="nav-item mb-3">
          <Link to="/home" className="nav-link text-white">Dashboard</Link>
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div id="root" className="d-flex">
        {/* <Sidebar /> */}
        <div className="flex-grow-1">
          <main className="main-content">
            <Routes>
              {/* Login Route */}
              <Route path="/" element={!isLoggedIn ? <LoginPage setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/home" />} />

              {/* Home Route */}
              <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/" />} />

              {/* Other Routes */}
              <Route path="/Registration" element={<Registration />} />
              <Route path="/overview" element={<OverviewPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/AdminPanel" element={<AdminPanel/>} />
              <Route path="/Usermanagement" element={<Usermanagement />} /> {/* Ensure path matches navigate() */}
              <Route path="/InventoryManagement" element={<InventoryManagement />} />
              <Route path="/ClientSupplierManagement" element={<ClientSupplierManagement />} />
              <Route path="/SAPDataImport" element={<SAPDataImport />} />
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