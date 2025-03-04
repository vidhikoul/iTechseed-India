import React from 'react'
import { useState } from 'react';
import './AddNewModel.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

function AddInventoryModel() {
    const [show, setShow] = useState(false);
            
              const handleClose = () => setShow(false);
              const handleShow = () => setShow(true);
  return (
    <>
      <div>
            <button id="btn" onClick={handleShow}>+ Add New</button>
        </div>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form id="model_form">
            <Row>
                <Col>
                <Form.Label>Supplier Name</Form.Label>
                <Form.Control placeholder="" />
                </Col>
                <Col>
                <Form.Label>Material Code</Form.Label>
                <Form.Control placeholder="" />
                </Col>
            </Row> <br/>
            <Row>
                <Col>
                <Form.Label>Material Description</Form.Label>  
                <Form.Control placeholder="" />
                </Col>
                <Col>
                <Form.Label>HSN Code</Form.Label>  
                <Form.Control placeholder="" />
                </Col>
            </Row><br/>
            <Row>
                <Col>
                <Form.Label>Status</Form.Label>  
                <Form.Control placeholder="" />
                </Col>
                <Col>
                <Button variant="secondary">ADD ITEM</Button>
                </Col>
            </Row>
        </Form>
        </Modal.Body>
       
      </Modal>
       
    </>
  )
}

export default AddInventoryModel