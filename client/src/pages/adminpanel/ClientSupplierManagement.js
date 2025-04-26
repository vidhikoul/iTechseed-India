import React, { useState, useEffect } from "react";
import Sidebar from '../../components/Sidebar';
import './Client.css';
import AddClientModel from "./ClientManagement/AddClientModel";
import AddSupplierModel from "./AddSupplierModel";
import { Link, useNavigate } from 'react-router-dom';

function ClientSupplierManagement() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/customers") // Update with your real endpoint
      .then((response) => response.json())
      .then((result) => {
        const formatted = result.map((item) => ({
          id: item.customer_existing_id,
          name: item.customer_name,
          location: item.city,
          // type: item.type || "Client",     // fallback default if not provided
          // status: item.status || "Active", // fallback default
        }));
        setData(formatted);
      })
      .catch((error) => {
        console.error("Error fetching client/supplier data:", error);
      });
  }, []);
  
  

  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");
  const [sortStatus, setSortStatus] = useState("");
  const navigate = useNavigate();

  // Filter Data Based on Search and Sorting
  const filteredData = data
    .filter((row) => 
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.id.includes(searchTerm) ||
      row.status.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((row) => (sortType ? row.type === sortType : true))
    .filter((row) => (sortStatus ? row.status === sortStatus : true));

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle Sorting Type Change
  const handleSortTypeChange = (e) => {
    setSortType(e.target.value);
  };

  // Handle Sorting Status Change
  const handleSortStatusChange = (e) => {
    setSortStatus(e.target.value);
  };

  const addEntry = (type) => {
    alert(`Add new ${type} functionality to be implemented.`);
  };

  return (
    <>
      <div className="d-flex">
        {/* Sidebar */}
        <div className="sidebar-container">
            <Sidebar />
        </div>
        <div className="content-container flex-grow-1 p-3">
          <div className="container">
            <h2 className="title" id="h2Text" onClick={() => navigate("/AdminPanel")}>&lt; Client & Supplier Master Management</h2>
            <div className="header">
              <div>
                <input
                  type="text"
                  id="search"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="headerRight_content">
                <span>Sort by</span>
                <select id="sortType" value={sortType} onChange={handleSortTypeChange}>
                  <option value="">Type</option>
                  <option value="Client">Client</option>
                  <option value="Supplier">Supplier</option>
                </select>
                <select id="sortStatus" value={sortStatus} onChange={handleSortStatusChange}>
                  <option value="">Status</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                </select>
                <span id="RightBtns">
                  <AddClientModel/>
                  <AddSupplierModel/>
                </span>
                
                {/* <button id="btn" onClick={() => addEntry("Client")}>+ Add Client</button> */}
                {/* <button id="btn" onClick={() => addEntry("Supplier")}>+ Add Supplier</button> */}
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Client / Supplier ID</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.type}</td>
                    <td>{row.location}</td>
                    <td>{row.id}</td>
                    <td>
                      <button className={row.status === "Active" ? "status-active" : "status-pending"}>{row.status}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <div className="paginationLeft">
                <span>Page</span>
                <a href="#" className="prev">&lt;</a>
                <a href="#" className="active">1</a>
                <a href="#">2</a>
                <a href="#">3</a>
                <a href="#">4</a>
                <a href="#" className="next">&gt;</a>
              </div>
              <div className="paginationRight">
                <span>Showing {filteredData.length} of {data.length}</span>
              </div>
            </div>
          </div>
        </div>  
      </div>
    </>
  );
}

export default ClientSupplierManagement;