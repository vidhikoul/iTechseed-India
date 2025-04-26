import React, { useState, useEffect } from "react";
import './ClientDetailsModal.css';

const ClientDetailsModal = ({ client, onClose }) => {
  const [clientDetails, setClientDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchClientDetails = () => {
    if (!client) {
      setLoading(false);
      return;
    }

    const clientId = client.customer_id || client.customer_existing_id || client.customer_exisitng_id;
    if (!clientId) {
      setLoading(false);
      return;
    }

    const apiUrl = `http://localhost:8800/api/customers/${clientId}`;
    console.log(`Fetching client details from: ${apiUrl}`);
    
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
        console.log("Fetched client details:", data);
        if (data && (data.customer_id || data.customer_existing_id || data.customer_exisitng_id)) {
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

  const getFieldValue = (fieldName, alternateFieldName) => {
    return displayData[fieldName] || 
           (alternateFieldName && displayData[alternateFieldName]) || 
           "N/A";
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
                <strong>Customer ID:</strong> {getFieldValue('customer_id')}
              </div>
              <div className="client-details-item">
                <strong>Existing ID:</strong> {getFieldValue('customer_existing_id', 'customer_exisitng_id')}
              </div>
              <div className="client-details-item">
                <strong>Previous Account No:</strong> {getFieldValue('previous_account_number')}
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
                <strong>Market Code:</strong> {getFieldValue('market_code')}
              </div>
              <div className="client-details-item">
                <strong>CST No:</strong> {getFieldValue('cst_no')}
              </div>
              <div className="client-details-item">
                <strong>LST No:</strong> {getFieldValue('lst_no')}
              </div>
              <div className="client-details-item">
                <strong>PAN No:</strong> {getFieldValue('pan_no')}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsModal;