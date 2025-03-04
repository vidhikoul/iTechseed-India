import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminPanel.css";
import Sidebar from "../../components/Sidebar";

const AdminPanel = () => {
  const navigate = useNavigate();

  return (
    <div id="container">
      {/* Left Sidebar */}
      <div id="left_content">
        <Sidebar />
      </div>

      {/* Right Content */}
      <div id="right_content">
        <div id="user_management" onClick={() => navigate("/Usermanagement")}>
          User Management
          <Link to="/Usermanagement"></Link>
          <img src="user_management.svg" alt="User Management" />
        </div>

        <div id="inventory_management" onClick={() => navigate("/InventoryManagement")}>
          Inventory Management
          <Link to="/InventoryManagement"></Link>
          <img src="inventory_management.svg" alt="Inventory Management" />
        </div>

        {/* Centered Device Management Box */}
        <div id="device_management" onClick={() => navigate("/DeviceManagement")}>
          Device Management
          <img src="client_supplier_management.svg" alt="Device Management" />
        </div>

        <div id="client_management" onClick={() => navigate("/ClientSupplierManagement")}>
          Client & Supplier Master Management
          <img src="client_supplier_management.svg" alt="Client & Supplier Management" />
        </div>

        <div id="sap_data" onClick={() => navigate("/SapDataImport")}>
          SAP Data Import
          <img src="sap_data_import.svg" alt="SAP Data Import" />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
