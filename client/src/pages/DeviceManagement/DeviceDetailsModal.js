import React, { useEffect, useState } from "react";
import './DeviceDetailsModal.css';

const DeviceDetailsModal = ({ device, onClose, onEdit, onDelete }) => {
  const [deviceDetails, setDeviceDetails] = useState(device || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!device || !device.device_id) {
      setLoading(false);
      return;
    }

    const fetchDeviceDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8800/api/devices/${device.device_id}`);
        const data = await response.json();
        setDeviceDetails(data);
      } catch (error) {
        console.error("Error fetching updated device details:", error);
        setDeviceDetails(device); // fallback to initial prop
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceDetails();
  }, [device]);

  if (!deviceDetails) return null;

  const getFieldValue = (fieldName) => {
    return deviceDetails[fieldName] || "N/A";
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="client-card-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{getFieldValue('device_name')}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading device details...</p>
            </div>
          ) : (
            <div className="client-details-section">
              <h4>Device Information</h4>
              <div className="client-details-grid">
                <div className="client-details-item">
                  <strong>ID:</strong> {getFieldValue('device_id')}
                </div>
                <div className="client-details-item">
                  <strong>Name:</strong> {getFieldValue('device_name')}
                </div>
                <div className="client-details-item">
                  <strong>Type:</strong> {getFieldValue('device_type')}
                </div>
                <div className="client-details-item">
                  <strong>IP Address:</strong> {getFieldValue('ip_address')}
                </div>
                <div className="client-details-item">
                  <strong>Status:</strong> {getFieldValue('status')}
                </div>
                <div className="client-details-item">
                  <strong>MAC Address:</strong> {getFieldValue('mac_address')}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-warning me-2" onClick={onEdit}>Edit</button>
          <button className="btn btn-danger me-2" onClick={onDelete}>Delete</button>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailsModal;
