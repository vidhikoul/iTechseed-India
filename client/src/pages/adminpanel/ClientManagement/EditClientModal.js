import React, { useState } from 'react';
import './ClientDetailsModal.css';

const EditClientModal = ({ client, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    customer_name: client.customer_name || '',
    contact_number: client.contact_number || '',
    email: client.email || '',
    address_1: client.address_1 || '',
    address_2: client.address_2 || '',
    city: client.city || '',
    postal_code: client.postal_code || '',
    region_name: client.region_name || '',
    country_name: client.country_name || '',
    gstin: client.gstin || '',
    pan_no: client.pan_no || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8800/api/clients/${client.customer_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update client');
      }
      
      onSave(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="client-card-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Client</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            <div className="mb-3">
              <label className="form-label">Client Name</label>
              <input
                type="text"
                className="form-control"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Contact Number</label>
              <input
                type="text"
                className="form-control"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Address Line 1</label>
              <input
                type="text"
                className="form-control"
                name="address_1"
                value={formData.address_1}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Address Line 2</label>
              <input
                type="text"
                className="form-control"
                name="address_2"
                value={formData.address_2}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Postal Code</label>
              <input
                type="text"
                className="form-control"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Region</label>
              <input
                type="text"
                className="form-control"
                name="region_name"
                value={formData.region_name}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Country</label>
              <input
                type="text"
                className="form-control"
                name="country_name"
                value={formData.country_name}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">GSTIN</label>
              <input
                type="text"
                className="form-control"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">PAN No</label>
              <input
                type="text"
                className="form-control"
                name="pan_no"
                value={formData.pan_no}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              type="submit" 
              className="btn btn-primary me-2"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClientModal;