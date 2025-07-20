import React, { useState } from 'react';
import './AddDeviceModal.css';

const AddDeviceModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    device_name: '',
    device_type: '',
    ip_address: '',
    status: '',
    mac_address: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('http://localhost:8800/api/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to add device');
      alert('Device added successfully!');
      onSave(); // Close modal and refresh device list
    } catch (err) {
      console.error('Error adding device:', err);
      alert('Error adding device');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-device-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Device</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="input-grid">
          <input
            type="text"
            name="device_name"
            placeholder="Device Name"
            value={formData.device_name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="device_type"
            placeholder="Device Type"
            value={formData.device_type}
            onChange={handleChange}
          />
          <input
            type="text"
            name="ip_address"
            placeholder="IP Address"
            value={formData.ip_address}
            onChange={handleChange}
          />
          <input
            type="text"
            name="status"
            placeholder="Status"
            value={formData.status}
            onChange={handleChange}
          />
          <input
            type="text"
            name="mac_address"
            placeholder="MAC Address"
            value={formData.mac_address}
            onChange={handleChange}
          />
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={handleAdd}>Add Device</button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddDeviceModal;
