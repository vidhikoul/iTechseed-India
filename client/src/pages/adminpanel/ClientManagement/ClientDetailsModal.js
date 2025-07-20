import React, { useState, useEffect } from "react";
import './ClientDetailsModal.css';

const ClientDetailsModal = ({ client, onClose, onEditClick, onDelete }) => {
  const [clientDetails, setClientDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchClientDetails = () => {
    if (!client || !client.customer_id) {
      setLoading(false);
      return;
    }

    const apiUrl = `http://localhost:8800/api/clients/${client.customer_id}`;
    
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
        if (data && data.customer_id) {
          setClientDetails(data);
        } else {
          throw new Error("Invalid client data received");
        }
      })
      .catch(err => {
        console.error("Error fetching client details:", err);
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
    fetchClientDetails();
  }, [client, retryCount]);

  if (!client) return null;

  const displayData = clientDetails || client;

  const getFieldValue = (fieldName) => {
    return displayData[fieldName] || "N/A";
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="client-card-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{getFieldValue('customer_name')}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {loading && (
            <div className="loading-spinner">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading client details...</p>
              {retryCount > 0 && (
                <p className="text-muted">Attempt {retryCount + 1} of 3</p>
              )}
            </div>
          )}
          
          {error && (
            <div className="alert alert-danger" role="alert">
              <p><strong>Error loading client details:</strong></p>
              <p>{error}</p>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <small>Displaying basic client information instead.</small>
                {retryCount < 3 && (
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => fetchClientDetails()}
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          )}
          
          <div className="client-details-section">
            <h4>Basic Information</h4>
            <div className="client-details-grid">
              <div className="client-details-item">
                <strong>Client ID:</strong> {getFieldValue('customer_id')}
              </div>
              <div className="client-details-item">
                <strong>Name:</strong> {getFieldValue('customer_name')}
              </div>
              <div className="client-details-item">
                <strong>Contact Number:</strong> {getFieldValue('contact_number')}
              </div>
              <div className="client-details-item">
                <strong>Email:</strong> {getFieldValue('email')}
              </div>
            </div>
          </div>
          
          <div className="client-details-section">
            <h4>Address Information</h4>
            <div className="client-details-grid">
              <div className="client-details-item">
                <strong>Address Line 1:</strong> {getFieldValue('address_1')}
              </div>
              <div className="client-details-item">
                <strong>Address Line 2:</strong> {getFieldValue('address_2')}
              </div>
              <div className="client-details-item">
                <strong>City:</strong> {getFieldValue('city')}
              </div>
              <div className="client-details-item">
                <strong>Postal Code:</strong> {getFieldValue('postal_code')}
              </div>
              <div className="client-details-item">
                <strong>Region:</strong> {getFieldValue('region_name')}
              </div>
              <div className="client-details-item">
                <strong>Country:</strong> {getFieldValue('country_name')}
              </div>
            </div>
          </div>
          
          <div className="client-details-section">
            <h4>Tax Information</h4>
            <div className="client-details-grid">
              <div className="client-details-item">
                <strong>GSTIN:</strong> {getFieldValue('gstin')}
              </div>
              <div className="client-details-item">
                <strong>PAN No:</strong> {getFieldValue('pan_no')}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            className="btn btn-warning me-2" 
            onClick={onEditClick}
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
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsModal;