import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage/Login';
import OverviewPage from './pages/Overview/Overview';
import UserManagement from './pages/AdminPanel/Usermanagement';
import InventoryManagement from './pages/AdminPanel/InventoryManagement';
import ClientSupplierManagement from './pages/AdminPanel/ClientSupplierManagement';
import SAPDataImport from './pages/AdminPanel/SapDataImport';
import TransactionTracking from './pages/TransactionsPage/TransactionTracking';
import ChallanManagement from './pages/TransactionsPage/ChallanManagement';
import MobileIntegration from './pages/MobileIntegrationPage/MobileIntegration';
import SettingsPage from './pages/SettingsPage/SettingPage';

function App() {
  return (
    <Router>
      <div className="content">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/overview" element={<OverviewPage />} />
          {/* Test one route at a time */}
        </Routes>
      </div>
    </Router>
  );
}

// function App() {
//   return (
//     <Router>
//       <Header />
//       <Sidebar />
//       <div className="content">
//         <Routes>
//           <Route path="/" element={<LoginPage />} />
//           <Route path="/overview" element={<OverviewPage />} />
//           <Route path="/admin/user-management" element={<UserManagement />} />
//           <Route path="/admin/inventory" element={<InventoryManagement />} />
//           <Route path="/admin/clients" element={<ClientSupplierManagement />} />
//           <Route path="/admin/sap-import" element={<SAPDataImport />} />
//           <Route path="/transactions" element={<TransactionTracking />} />
//           <Route path="/challan-management" element={<ChallanManagement />} />
//           <Route path="/mobile-integration" element={<MobileIntegration />} />
//           <Route path="/settings" element={<SettingsPage />} />
//         </Routes>
//       </div>
//       <Footer />
//     </Router>
//   );
// }

export default App;