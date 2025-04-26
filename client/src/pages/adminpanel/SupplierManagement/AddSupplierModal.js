// src/pages/adminpanel/SupplierManagement/AddSupplierModal.js
import React, { useState } from 'react';
import './AddSupplierModel.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import axios from 'axios';

function AddSupplierModal({ show, onClose, onSave }) {
  console.log('AddSupplierModal rendered, show:', show); // Debug log

  const [formData, setFormData] = useState({
    supplier_name: '',
    contact_number: '',
    email: '',
    address: '',
    gstin: '',
    pan_no: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending POST request to /api/suppliers with data:', formData);
      const response = await axios.post('http://localhost:8800/api/add/suppliers', formData);
      console.log('Response from server:', response.data);
      alert("Supplier added successfully!");
      onSave(response.data);
      onClose();
    } catch (err) {
      const errorMessage = err.response && err.response.data && err.response.data.error
        ? err.response.data.error
        : err.message || 'Unknown error';
      console.error("Error adding supplier:", err.response ? err.response.data : err.message);
      alert("Failed to add supplier: " + errorMessage);
    }
  };

  return (
    <Modal show={show} onHide={onClose} fullscreen>
      <Modal.Header closeButton>
        <Modal.Title>Add Supplier</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="model_form" onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Label>Supplier Name</Form.Label>
              <Form.Control name="supplier_name" value={formData.supplier_name} onChange={handleChange} required />
            </Col>
            <Col>
              <Form.Label>Contact Number</Form.Label>
              <Form.Control name="contact_number" value={formData.contact_number} onChange={handleChange} required />
            </Col>
            <Col>
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" value={formData.email} onChange={handleChange} required />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Address</Form.Label>
              <Form.Control name="address" value={formData.address} onChange={handleChange} required />
            </Col>
           
            
          </Row>
          <Row className="mb-3">
            <Col></Col>
            <Col></Col>
            <Col>
              <Button variant="secondary" type="submit">Confirm</Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddSupplierModal;