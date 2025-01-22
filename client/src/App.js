import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/loginPage/Login';
import OverviewPage from './pages/overview/Overview';
import UserManagement from './pages/adminpanel/Usermanagement';
import InventoryManagement from './pages/adminpanel/InventoryManagement';
import ClientSupplierManagement from './pages/adminpanel/ClientSupplierManagement';
import SAPDataImport from './pages/adminpanel/SapDataImport';
import TransactionTracking from './pages/transactionsPage/TransactionTracking';
import ChallanManagement from './pages/transactionsPage/ChallanManagement';
import MobileIntegration from './pages/mobileIntegrationPage/MobileIntegration';
import SettingsPage from './pages/settingsPage/SettingPage';

function App() {
  return (
    <Router>
      <Header />
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/admin/user-management" element={<UserManagement />} />
          <Route path="/admin/inventory" element={<InventoryManagement />} />
          <Route path="/admin/clients" element={<ClientSupplierManagement />} />
          <Route path="/admin/sap-import" element={<SAPDataImport />} />
          <Route path="/transactions" element={<TransactionTracking />} />
          <Route path="/challan-management" element={<ChallanManagement />} />
          <Route path="/mobile-integration" element={<MobileIntegration />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;