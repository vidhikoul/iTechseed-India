import React from 'react';
// import Sidebar from '../../components/Sidebar';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminPanel.css'
import Sidebar from '../../components/Sidebar';
const AdminPanel = () => {
  return (
  <>
  {/* <Sidebar/> */}
    <div id="continer">
      <div> <Sidebar/></div>
      <div id="right_content">
        <div id="user_management">User Management <img src ="user_management.png"/></div>
        <div id="inventory_management">Inventory Management <img src ="inventory.png"/></div>
        <div id="client_management">Client & Supplier Master Management  <img src ="client_supply.png"/></div>
        <div id="sap_data">SAP Data Import <img src ="sap.png"/></div>
      </div>
   
</div>

</>
  );
};

export default AdminPanel;
