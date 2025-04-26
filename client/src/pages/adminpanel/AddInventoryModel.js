import React, { useState } from 'react';
import './AddNewModel.css';
import { Button, Modal, Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';

function AddInventoryModel({ onAddInventory, buttonStyle }) {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    plant: '',
    material_number: '',
    material_description: '',
    storage_location: '',
    unrestricted: '',
    base_unit_of_measure: '',
    value_unrestricted: '',
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:8800/api/inventory/add', formData);
      if (res.status === 201) {
        alert('Item added successfully!');
        onAddInventory && onAddInventory(res.data);
        handleClose();
        setFormData({
          plant: '',
          material_number: '',
          material_description: '',
          storage_location: '',
          unrestricted: '',
          base_unit_of_measure: '',
          value_unrestricted: '',
        });
      }
    } catch (error) {
      console.error('Failed to add item:', error);
      alert('Error adding item!');
    }
  };

  return (
    <>
      <div>
        <Button onClick={handleShow} style={buttonStyle} variant="primary">
          ➕ Add New
        </Button>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        fullscreen
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Inventory Item</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form id="model_form">
            <Row className="mb-3">
              <Col>
                <Form.Label>Plant</Form.Label>
                <Form.Control
                  name="plant"
                  value={formData.plant}
                  onChange={handleChange}
                  placeholder="Enter Plant"
                />
              </Col>
              <Col>
                <Form.Label>Material Number</Form.Label>
                <Form.Control
                  name="material_number"
                  value={formData.material_number}
                  onChange={handleChange}
                  placeholder="Enter Material Number"
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Material Description</Form.Label>
                <Form.Control
                  name="material_description"
                  value={formData.material_description}
                  onChange={handleChange}
                  placeholder="Enter Description"
                />
              </Col>
              <Col>
                <Form.Label>Storage Location</Form.Label>
                <Form.Control
                  name="storage_location"
                  value={formData.storage_location}
                  onChange={handleChange}
                  placeholder="Enter Storage Location"
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Unrestricted Stock</Form.Label>
                <Form.Control
                  name="unrestricted"
                  value={formData.unrestricted}
                  onChange={handleChange}
                  placeholder="Enter Unrestricted Stock"
                />
              </Col>
              <Col>
                <Form.Label>Base Unit of Measure</Form.Label>
                <Form.Control
                  name="base_unit_of_measure"
                  value={formData.base_unit_of_measure}
                  onChange={handleChange}
                  placeholder="Enter Unit"
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Value Unrestricted</Form.Label>
                <Form.Control
                  name="value_unrestricted"
                  value={formData.value_unrestricted}
                  onChange={handleChange}
                  placeholder="Enter Value"
                />
              </Col>
              <Col className="d-flex align-items-end justify-content-end">
                <Button variant="success" onClick={handleSubmit}>
                  ➕ Add Item
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddInventoryModel;
