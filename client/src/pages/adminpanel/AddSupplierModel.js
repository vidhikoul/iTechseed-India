import React from 'react'
import { useState } from 'react';
import './AddNewModel.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

function AddSupplierModel() {
     const [show, setShow] = useState(false);
        
          const handleClose = () => setShow(false);
          const handleShow = () => setShow(true);
  return (
    <>
        <div>
            <button id="btn" onClick={handleShow}>+ Add Supplier</button>
        </div>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Supplier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form id="model_form">
            <Row>
                <Col>
                <Form.Label>Supplier Name</Form.Label>
                <Form.Control placeholder="" />
                </Col>
                <Col>
                <Form.Label>Address</Form.Label>
                <Form.Control placeholder="" />
                </Col>
                <Col>
                <Form.Label>Contact Person</Form.Label>
                <Form.Control placeholder="" />
                </Col>
            </Row> <br/>
            <Row>
                <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Email</Form.Label>    
                <Form.Control type="email" placeholder="" />
                </Form.Group>
                <Col>
                <Form.Label>Phone No.</Form.Label>  
                <Form.Control placeholder="" />
                </Col>
                <Col>
                <Form.Label>Supplier ID</Form.Label>  
                <Form.Control placeholder="" />
                </Col>
            </Row><br/>
            <Row>
                <Col>
                <Form.Label>Product Supplied</Form.Label>  
                <Form.Control placeholder="" />
                </Col>
                <Col>
                <Form.Label>Payment Terms</Form.Label>  
                <Form.Control placeholder="" />
                </Col>
                <Col>
                <Button variant="secondary">CONFIRM</Button>
                </Col>
            </Row>
        </Form>
        </Modal.Body>
       
      </Modal>
       
    </>
  )
}

export default AddSupplierModel