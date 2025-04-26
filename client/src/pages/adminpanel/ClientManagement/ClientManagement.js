import React, { useState, useEffect } from "react";
import Sidebar from '../../../components/Sidebar';
import '../Client.css';
import * as XLSX from "xlsx";
import { useNavigate } from 'react-router-dom';
import AddClientModel from "./AddClientModel";
import ClientDetailsModal from "./ClientDetailsModal";

function ClientManagement() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8800/api/customers')
      .then(res => res.json())
      .then(data => {
        console.log("Fetched Data: ", data);
        if (Array.isArray(data)) {
          setData(data);
        } else {
          console.error('Expected an array, got:', data);
        }
      })
      .catch(err => {
        console.error('Error fetching client data:', err);
      });
  }, []);

  const filteredData = data.filter((row) =>
    (row.customer_name && row.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (row.city && row.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (row.customer_exisitng_id && row.customer_exisitng_id.toString().includes(searchTerm))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleClientClick = (client) => {
    setSelectedClient(client);
    setShowClientModal(true);
  };

  const handleCloseModal = () => {
    setShowClientModal(false);
    setSelectedClient(null);
  };

  const handleImportClick = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log("Imported Data: ", jsonData);
  
        // 🚀 Send imported Excel data to backend
        fetch('http://localhost:8800/api/customers/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(jsonData)
        })
        .then(response => response.json())
        .then(result => {
          console.log('Data imported successfully:', result);
          window.location.reload(); // Refresh page to reload data
        })
        .catch(error => {
          console.error('Error importing data:', error);
        });
      };
      reader.readAsBinaryString(file);
    }
  };
  

  return (
    <div className="d-flex">
      <div className="sidebar-container">
        <Sidebar />
      </div>

      <div className="content-container flex-grow-1 p-3">
        <div className="container">
          <h2 className="title" id="h2Text" onClick={() => navigate("/AdminPanel")}>&lt; Client Management</h2>

          <div className="header">
            <div>
              <input
                type="text"
                id="search"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ color: '#000', backgroundColor: '#fff', border: '1px solid #ccc', padding: '5px' }}
              />
            </div>

            <div className="headerRight_content d-flex gap-3 align-items-center">
              <AddClientModel selectedClient={selectedClient} />
              <label htmlFor="importFile" className="btn btn-outline-secondary" style={{ cursor: "pointer" }}>
                📁 Import
              </label>
              <input
                type="file"
                id="importFile"
                accept=".xlsx, .xls, .csv"
                style={{ display: "none" }}
                onChange={handleImportClick}
              />
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Client ID</th>
                <th>GSTIN</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((row) => (
                  <tr key={row.customer_exisitng_id}>
                    <td 
                      className="client-name-cell" 
                      onClick={() => handleClientClick(row)}
                      style={{cursor: "pointer", textDecoration: "underline"}}
                    >
                      {row.customer_name}
                    </td>
                    <td>{row.city}</td>
                    <td>{row.customer_exisitng_id}</td>
                    <td>{row.gstin || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No clients found</td>
                </tr>
              )}
            </tbody>
          </table>

          {showClientModal && (
            <ClientDetailsModal 
              client={selectedClient} 
              onClose={handleCloseModal} 
            />
          )}

          <div className="pagination">
            <div className="paginationLeft">
              <span>Page</span>
              <a href="#" className="prev" onClick={handlePrevPage}>&lt;</a>
              {[...Array(totalPages)].map((_, index) => (
                <a
                  key={index}
                  href="#"
                  className={currentPage === index + 1 ? "active" : ""}
                  onClick={() => handlePageClick(index + 1)}
                >
                  {index + 1}
                </a>
              ))}
              <a href="#" className="next" onClick={handleNextPage}>&gt;</a>
            </div>
            <div className="paginationRight">
              <span>Showing {currentData.length} of {filteredData.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientManagement;