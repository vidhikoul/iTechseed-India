import React, { useEffect, useState } from "react";
import "./UserManagement.css";
import Sidebar from "../../components/Sidebar";
import AddInventoryModel from "./AddInventoryModel";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";

function InventoryManagement() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch inventory data from the database
  useEffect(() => {
    fetch("http://localhost:8800/api/inventory")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Inventory Data:", data); // Debugging
        setInventory(data || []);
      })
      .catch((err) => console.error("Error fetching inventory data:", err));
  }, []);

  // Search Functionality (Filter by Material Description or Material Number)
  const filteredInventory = inventory.filter(
    (item) =>
      item?.material_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.material_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar-container">
        <Sidebar />
      </div>

      <div className="content-container flex-grow-1 p-3">
        <div className="container">
          <h2 className="title" id="h2Text" onClick={() => navigate("/AdminPanel")}>
            &lt; Inventory Management
          </h2>

          {/* Search & Add New Button */}
          <div className="top-bar">
            <input
              type="text"
              placeholder="Search by Material Description or Number"
              className="search-bar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <AddInventoryModel />
          </div>

          {/* Inventory Table */}
          {filteredInventory.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Inventory ID</th>
                  <th>Plant</th>
                  <th>Material Number</th>
                  <th>Material Description</th>
                  <th>Storage Location</th>
                  <th>Unrestricted Stock</th>
                  <th>Base Unit</th>
                  <th>Storage Location Description</th>
                  <th>Value Unrestricted</th>
                  <th>Special Stock</th>
                  <th>Special Stock Number</th>
                  <th>In Quality Insp</th>
                  <th>Blocked</th>
                  <th>Returns</th>
                  <th>Restricted Use Stock</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.inventory_id}>
                    <td>{item.inventory_id}</td>
                    <td>{item.plant}</td>
                    <td>{item.material_number}</td>
                    <td>{item.material_description}</td>
                    <td>{item.storage_location}</td>
                    <td>{item.unrestricted}</td>
                    <td>{item.base_unit_of_measure}</td>
                    <td>{item.storage_loc_description}</td>
                    <td>{item.value_unrestricted}</td>
                    <td>{item.special_stock}</td>
                    <td>{item.special_stock_number || "-"}</td>
                    <td>{item.in_quality_insp}</td>
                    <td>{item.blocked}</td>
                    <td>{item.returns}</td>
                    <td>{item.restricted_use_stock}</td>
                    <td>
                      <button className="delete-btn">DELETE</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No Inventory Data Found</p>
          )}

          {/* Pagination Component */}
          <Pagination />
        </div>
      </div>
    </div>
  );
}

export default InventoryManagement;
