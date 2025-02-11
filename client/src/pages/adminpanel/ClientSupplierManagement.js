import React, { useState, useEffect } from "react";

function ClientSupplierManagement() {
  const [data, setData] = useState([
    { name: "John Deere India", type: "Client", location: "Pune", id: "1001", status: "Active" },
    { name: "Spirit Corporation", type: "Supplier", location: "Mumbai", id: "2001", status: "Pending" },
    { name: "John Deere India", type: "Client", location: "Nashik", id: "1010", status: "Active" },
    { name: "Caterpillar India", type: "Client", location: "Pune", id: "1013", status: "Active" },
    { name: "Force Motors", type: "Client", location: "Pune", id: "1022", status: "Active" },
    { name: "Fabpro Engineering", type: "Supplier", location: "Pune", id: "2030", status: "Pending" },
    { name: "John Deere India", type: "Client", location: "Pune", id: "1045", status: "Active" },
    { name: "Fabpro Engineering", type: "Supplier", location: "Mumbai", id: "2114", status: "Active" },
    { name: "Spirit Corporation", type: "Supplier", location: "Pune", id: "2017", status: "Active" },
    { name: "Fabpro Engineering", type: "Supplier", location: "Mumbai", id: "2169", status: "Pending" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");
  const [sortStatus, setSortStatus] = useState("");

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
    <div>
      <div id="Data_container">
        <div id="LeftContent">Left Side bar</div>
        <div id="RightContent">
          <div className="container">
            <h2 className="title">&lt; User Management</h2>
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
                <button id="btn" onClick={() => addEntry("Client")}>+ Add Client</button>
                <button id="btn" onClick={() => addEntry("Supplier")}>+ Add Supplier</button>
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
                    <td className={row.status === "Active" ? "status-active" : "status-pending"}>
                      {row.status}
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
    </div>
  );
}

export default ClientSupplierManagement;
