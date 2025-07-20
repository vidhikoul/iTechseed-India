import React, { useState, useEffect } from 'react';
import './DeviceDetailsModal.css';

const EditDeviceModal = ({ device, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    device_name: '',
    device_type: '',
    ip_address: '',
    status: '',
    mac_address: ''
  });

  useEffect(() => {
    if (device) {
      setFormData({
        device_name: device.device_name || '',
        device_type: device.device_type || '',
        ip_address: device.ip_address || '',
        status: device.status || '',
        mac_address: device.mac_address || ''
      });
    }
  }, [device]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    fetch(`http://localhost:8800/api/devices/${device.device_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update device");
        return res.json();
      })
      .then(data => {
        alert("Device updated successfully");
        onSave(); // Refresh parent state
        onClose();
      })
      .catch(err => {
        console.error("Update error:", err);
        alert("Failed to update device");
      });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="client-card-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Device</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="client-details-grid">
            {Object.entries(formData).map(([key, value]) => (
              <div className="client-details-item" key={key}>
                <label><strong>{key.replace('_', ' ')}:</strong></label>
                <input
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-success me-2" onClick={handleSubmit}>Save</button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditDeviceModal;
