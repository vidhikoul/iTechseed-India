import React, { useState, useEffect } from "react";
import './SupplierDetailsModal.css';

const SupplierDetailsModal = ({ supplier, onClose, onEdit, onDelete }) => {
  const [supplierDetails, setSupplierDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    supplier_name: '',
    contact_number: '',
    email: '',
    address: ''
  });

  const fetchSupplierDetails = () => {
    if (!supplier || !supplier.supplier_id) {
      setLoading(false);
      return;
    }

    const apiUrl = `http://localhost:8800/api/suppliers/${supplier.supplier_id}`;
    
    setLoading(true);
    setError(null);

    fetch(apiUrl)
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || `Request failed with status ${response.status}`);
        }
        return data;
      })
      .then(data => {
        if (data && data.supplier_id) {
          setSupplierDetails(data);
          setEditFormData({
            supplier_name: data.supplier_name || '',
            contact_number: data.contact_number || '',
            email: data.email || '',
            address: data.address || ''
          });
        } else {
          throw new Error("Invalid supplier data received");
        }
      })
      .catch(err => {
        console.error("Error fetching supplier details:", err);
        setError(err.message);
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSupplierDetails();
  }, [supplier, retryCount]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (supplierDetails) {
      setEditFormData({
        supplier_name: supplierDetails.supplier_name || '',
        contact_number: supplierDetails.contact_number || '',
        email: supplierDetails.email || '',
        address: supplierDetails.address || ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8800/api/suppliers/${supplier.supplier_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update supplier');
      }

      setSupplierDetails(data);
      setIsEditing(false);
      if (onEdit) onEdit(data);
      onClose(); // Close the modal after saving
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!supplier) return null;

  const displayData = supplierDetails || supplier;

  const getFieldValue = (fieldName) => {
    return displayData[fieldName] || "N/A";
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="client-card-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditing ? "Edit Supplier" : getFieldValue('supplier_name')}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {loading && (
            <div className="loading-spinner">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading supplier details...</p>
              {retryCount > 0 && (
                <p className="text-muted">Attempt {retryCount + 1} of 3</p>
              )}
            </div>
          )}
          
          {error && (
            <div className="alert alert-danger" role="alert">
              <p><strong>Error loading supplier details:</strong></p>
              <p>{error}</p>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <small>Displaying basic supplier information instead.</small>
                {retryCount < 3 && (
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => fetchSupplierDetails()}
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          )}
          
          {!isEditing ? (
            <>
              <div className="client-details-section">
                <h4>Basic Information</h4>
                <div className="client-details-grid">
                  <div className="client-details-item">
                    <strong>Supplier ID:</strong> {getFieldValue('supplier_id')}
                  </div>
                  <div className="client-details-item">
                    <strong>Name:</strong> {getFieldValue('supplier_name')}
                  </div>
                </div>
              </div>
              
              <div className="client-details-section">
                <h4>Contact Information</h4>
                <div className="client-details-grid">
                  <div className="client-details-item">
                    <strong>Contact Number:</strong> {getFieldValue('contact_number')}
                  </div>
                  <div className="client-details-item">
                    <strong>Email:</strong> {getFieldValue('email')}
                  </div>
                  <div className="client-details-item">
                    <strong>Address:</strong> {getFieldValue('address')}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="edit-form">
              <div className="mb-3">
                <label className="form-label">Supplier Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="supplier_name"
                  value={editFormData.supplier_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Contact Number</label>
                <input
                  type="text"
                  className="form-control"
                  name="contact_number"
                  value={editFormData.contact_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={editFormData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  name="address"
                  value={editFormData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="modal-footer">
            {!isEditing ? (
              <>
                <button 
                  className="btn btn-warning me-2" 
                  onClick={handleEditClick}
                  disabled={loading}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-danger me-2" 
                  onClick={onDelete}
                  disabled={loading}
                >
                  Delete
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={onClose}
                  disabled={loading}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn btn-primary me-2" 
                  onClick={handleSaveEdit}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetailsModal;