import React, { useState } from 'react';
import './AddClientModel.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import axios from 'axios';

function AddClientModel() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [formData, setFormData] = useState({
    customer_id: '',
    customer_exisitng_id: '',
    customer_name: '',
    previous_account_number: '',
    address_1: '',
    address_2: '',
    gstin: '',
    market_code: '',
    city: '',
    postal_code: '',
    region_id: '',
    region_name: '',
    country_id: '',
    country_name: '',
    cst_no: '',
    lst_no: '',
    pan_no: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8800/api/clients', formData);
      alert("Client added successfully!");
      handleClose();
    } catch (err) {
      console.error("Error adding client", err);
      alert("Failed to add client");
    }
  };

  return (
    <>
      <div>
        <button id="btn" onClick={handleShow}>+ Add Client</button>
      </div>
      <Modal show={show} onHide={handleClose} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Add Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="model_form" onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Label>Customer ID</Form.Label>
                <Form.Control name="customer_id" value={formData.customer_id} onChange={handleChange} />
              </Col>
              <Col>
                <Form.Label>Existing Customer ID</Form.Label>
                <Form.Control name="customer_exisitng_id" value={formData.customer_exisitng_id} onChange={handleChange} />
              </Col>
              <Col>
                <Form.Label>Customer Name</Form.Label>
                <Form.Control name="customer_name" value={formData.customer_name} onChange={handleChange} />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label>Previous Account Number</Form.Label>
                <Form.Control name="previous_account_number" value={formData.previous_account_number} onChange={handleChange} />
              </Col>
              <Col>
                <Form.Label>Address 1</Form.Label>
                <Form.Control name="address_1" value={formData.address_1} onChange={handleChange} />
              </Col>
              <Col>
                <Form.Label>Address 2</Form.Label>
                <Form.Control name="address_2" value={formData.address_2} onChange={handleChange} />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label>GSTIN</Form.Label>
                <Form.Control name="gstin" value={formData.gstin} onChange={handleChange} />
              </Col>
              <Col>
                <Form.Label>Market Code</Form.Label>
                <Form.Control name="market_code" value={formData.market_code} onChange={handleChange} />
              </Col>
              <Col>
                <Form.Label>City</Form.Label>
                <Form.Control name="city" value={formData.city} onChange={handleChange} />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label>Postal Code</Form.Label>
                <Form.Control name="postal_code" value={formData.postal_code} onChange={handleChange} />
              </Col>
              <Col>
                <Form.Label>Region ID</Form.Label>
                <Form.Control name="region_id" value={formData.region_id} onChange={handleChange} />
              </Col>
              <Col>
                <Form.Label>Region Name</Form.Label>
                <Form.Control name="region_name" value={formData.region_name} onChange={handleChange} />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label>Country ID</Form.Label>
                <Form.Control name="country_id" value={formData.country_id} onChange={handleChange} />
              </Col>
              <Col>
                <Form.Label>Country Name</Form.Label>
                <Form.Control name="country_name" value={formData.country_name} onChange={handleChange} />
              </Col>
              <Col>
                <Form.Label>CST No</Form.Label>
                <Form.Control name="cst_no" value={formData.cst_no} onChange={handleChange} />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Label>LST No</Form.Label>
                <Form.Control name="lst_no" value={formData.lst_no} onChange={handleChange} />
              </Col>
              <Col>
                <Form.Label>PAN No</Form.Label>
                <Form.Control name="pan_no" value={formData.pan_no} onChange={handleChange} />
              </Col>
              <Col>
                <Button variant="secondary" type="submit">Confirm</Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddClientModel;
