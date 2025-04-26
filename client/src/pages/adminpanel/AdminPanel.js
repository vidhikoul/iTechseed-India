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
        <div className="box" id="user_management" onClick={() => navigate("/Usermanagement")}>
          User Management
          <Link to="/Usermanagement"></Link>
          <img src="user_management.svg" alt="User Management" />
        </div>

        <div className="box" id="inventory_management" onClick={() => navigate("/InventoryManagement")}>
          Inventory Management
          <Link to="/InventoryManagement"></Link>
          <img src="inventory_management.svg" alt="Inventory Management" />
        </div>

        {/* Centered Device Management Box */}
        <div className="box" id="device_management" onClick={() => navigate("/DeviceManagement")}>
          Device Management
          <img src="user_management.svg" alt="Device Management" />
        </div>

        <div className="box" onClick={() => navigate("/ClientManagement")}>
          Client Master Management
          <img src="client_supplier_management.svg" alt="Client Management" />
        </div>

        <div className="box" onClick={() => navigate("/SupplierManagement")}>
          Supplier Master Management
          <img src="client_supplier_management.svg" alt="Supplier Management" />
        </div>

        <div className="box" id="sap_data" onClick={() => navigate("/SapDataImport")}>
          SAP Data Import
          <img src="sap_data_import.svg" alt="SAP Data Import" />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
