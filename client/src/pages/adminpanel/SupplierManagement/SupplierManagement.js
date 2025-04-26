import React, { useState, useEffect, useCallback } from "react";
import Sidebar from '../../../components/Sidebar';
import '../Client.css';
import * as XLSX from "xlsx";
import { useNavigate } from 'react-router-dom';
import AddSupplierModal from "./AddSupplierModal";
import EditSupplierModal from "./EditSupplierModal";
import SupplierDetailsModal from "./SupplierDetailsModal";
import debounce from "lodash/debounce";

function SupplierManagement() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch suppliers from API
  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8800/api/suppliers');
        if (!response.ok) {
          throw new Error('Failed to fetch suppliers');
        }
        const data = await response.json();
        console.log("Fetched Data: ", data);
        if (Array.isArray(data)) {
          setSuppliers(data);
        } else {
          throw new Error('Expected an array, got: ' + JSON.stringify(data));
        }
      } catch (err) {
        console.error('Error fetching supplier data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      console.log('Debounced Search Term:', value);
      setSearchTerm(value);
    }, 200),
    []
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  // Filter suppliers
  const filteredSuppliers = suppliers.filter((supplier) => {
    const name = (supplier.supplier_name || "").toLowerCase();
    const address = (supplier.address || "").toLowerCase();
    const id = (supplier.supplier_id || "").toString();
    const contact = (supplier.contact_number || "").toLowerCase();
    const email = (supplier.email || "").toLowerCase();
    const term = searchTerm.toLowerCase();

    return (
      name.includes(term) ||
      address.includes(term) ||
      id.includes(term) ||
      contact.includes(term) ||
      email.includes(term)
    );
  });

  // Log filtered suppliers for debugging
  console.log('Filtered Suppliers:', filteredSuppliers);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  const handleNextPage = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (e, pageNumber) => {
    e.preventDefault();
    setCurrentPage(pageNumber);
  };

  const handleSupplierClick = (supplier) => {
    setSelectedSupplier(supplier);
    setShowSupplierModal(true);
  };

  const handleCloseModal = () => {
    setShowSupplierModal(false);
    setSelectedSupplier(null);
  };

  // Handle supplier creation
  const handleAddSupplier = async (newSupplier) => {
    try {
      console.log('Adding supplier:', newSupplier);
      setSuppliers([...suppliers, newSupplier]);
      setShowAddModal(false);
    } catch (err) {
      console.error('Add supplier error:', err);
      alert('Failed to add supplier: ' + err.message);
    }
  };

  // Handle supplier update
  const handleUpdateSupplier = async (updatedSupplier) => {
    try {
      console.log('Updating supplier:', updatedSupplier);
      const response = await fetch(`http://localhost:8800/api/suppliers/${updatedSupplier.supplier_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSupplier),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update supplier');
      }

      const updatedData = await response.json();
      console.log('Updated supplier:', updatedData);
      setSuppliers(suppliers.map((s) =>
        s.supplier_id === updatedSupplier.supplier_id ? updatedData : s
      ));
      setEditingSupplier(null);
      setShowSupplierModal(false);
      setSelectedSupplier(null);
    } catch (err) {
      console.error('Update supplier error:', err);
      alert('Failed to update supplier: ' + err.message);
    }
  };

  // Handle supplier deletion
  const handleDeleteSupplier = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        console.log('Deleting supplier ID:', id);
        const response = await fetch(`http://localhost:8800/api/suppliers/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete supplier');
        }

        console.log('Supplier deleted:', id);
        setSuppliers(suppliers.filter((s) => s.supplier_id !== id));
        setShowSupplierModal(false);
        setSelectedSupplier(null);
      } catch (err) {
        console.error('Delete supplier error:', err);
        alert('Failed to delete supplier: ' + err.message);
      }
    }
  };

  // Handle Excel import
  const handleImportClick = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const binaryStr = event.target.result;
          const workbook = XLSX.read(binaryStr, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          console.log("Imported Data: ", jsonData);
          // Optionally, update state or send to API
          // setSuppliers([...suppliers, ...jsonData]);
        } catch (err) {
          console.error('Error reading Excel file:', err);
          alert('Failed to import file: ' + err.message);
        }
      };
      reader.onerror = () => {
        console.error('FileReader error');
        alert('Error reading file');
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
          <h2 className="title" id="h2Text" onClick={() => navigate("/AdminPanel")}>
            Supplier Management
          </h2>

          <div className="header">
            <div>
              <input
                type="text"
                id="search"
                className="form-control"
                placeholder="Search"
                value={inputValue}
                onChange={handleSearchChange}
              />
            </div>

            <div className="headerRight_content d-flex gap-3 align-items-center">
              <button
                className="btn btn-primary"
                onClick={() => {
                  console.log('Opening Add Supplier Modal');
                  setShowAddModal(true);
                }}
              >
                Add Supplier
              </button>
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

          {loading && <div>Loading suppliers...</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Address</th>
                <th>Supplier ID</th>
              </tr>
            </thead>
            <tbody>
              {currentSuppliers.length > 0 ? (
                currentSuppliers.map((supplier) => (
                  <tr key={supplier.supplier_id}>
                    <td
                      className="supplier-name-cell"
                      onClick={() => handleSupplierClick(supplier)}
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                    >
                      {supplier.supplier_name || "N/A"}
                    </td>
                    <td>{supplier.contact_number || "N/A"}</td>
                    <td>{supplier.email || "N/A"}</td>
                    <td>{supplier.address || "N/A"}</td>
                    <td>{supplier.supplier_id}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No suppliers found</td>
                </tr>
              )}
            </tbody>
          </table>

          {showAddModal && (
            <AddSupplierModal
              show={showAddModal}
              onClose={() => {
                console.log('Closing Add Supplier Modal');
                setShowAddModal(false);
              }}
              onSave={(newSupplier) => {
                console.log('Saving New Supplier:', newSupplier);
                handleAddSupplier(newSupplier);
              }}
            />
          )}

          {showSupplierModal && (
            <SupplierDetailsModal
              supplier={selectedSupplier}
              onClose={handleCloseModal}
              onEdit={() => {
                setEditingSupplier(selectedSupplier);
                setShowSupplierModal(false);
              }}
              onDelete={() => handleDeleteSupplier(selectedSupplier.supplier_id)}
            />
          )}

          {editingSupplier && (
            <EditSupplierModal
              supplier={editingSupplier}
              onClose={() => setEditingSupplier(null)}
              onSave={handleUpdateSupplier}
            />
          )}

          <div className="pagination">
            <div className="paginationLeft">
              <span>Page</span>
              <a href="#" className="prev" onClick={handlePrevPage}>
                ←
              </a>
              {[...Array(totalPages)].map((_, index) => (
                <a
                  key={index}
                  href="#"
                  className={currentPage === index + 1 ? "active" : ""}
                  onClick={(e) => handlePageClick(e, index + 1)}
                >
                  {index + 1}
                </a>
              ))}
              <a href="#" className="next" onClick={handleNextPage}>
                →
              </a>
            </div>
            <div className="paginationRight">
              <span>
                Showing {currentSuppliers.length} of {filteredSuppliers.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupplierManagement;