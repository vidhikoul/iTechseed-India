import React from "react";
// import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import "./AdminPanel.css";
import { FiLink } from "react-icons/fi"; // ✅ Import FiLink

import { Link, useNavigate } from 'react-router-dom';
import Sidebar from "../../components/Sidebar";
// import Usermanagement from "./Usermanagement"; // ✅ Import the component
// import Inventory from "./pages/Inventory";
// import ClientSupplier from "./pages/ClientSupplier";
// import SAPData from "./pages/SAPData";

const AdminPanel = () => {
  const navigate = useNavigate(); // ✅ Initialize useNavigate

  return (
    <div id="continer">
      {/* Left Sidebar */}
      <div id="left_content">
        <Sidebar />
      </div>

      {/* Right Content */}
      <div id="right_content">
        <div id="user_management" onClick={() => navigate("/Usermanagement")}>
          User Management
          <Link to="/Usermanagement">
                      <FiLink size={20} />
                    </Link>
          <img src="user_management.png" alt="Usermanagement" />
        </div>

        <div id="inventory_management" onClick={() => navigate("/InventoryManagement")}>
          Inventory Management
          <Link to="/InventoryManagement">
                      <FiLink size={20} />
                    </Link>
          <img src="inventory.png" alt="Inventory Management" />
        </div>

        <div id="client_management" onClick={() => navigate("/ClientSupplierManagement")}>
          Client & Supplier Master Management
          <img src="client_supply.png" alt="Client & Supplier Management" />
        </div>

        <div id="sap_data" onClick={() => navigate("/SapDataImport")}>
          SAP Data Import
          <img src="sap.png" alt="SAP Data Import" />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
