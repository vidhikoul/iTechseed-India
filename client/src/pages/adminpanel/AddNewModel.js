import React from 'react'
import { useState } from 'react';
import './UserManagement.css';
import './AddNewModel.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

function AddNewModel() {
    const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
        <div>
            <button variant="primary" onClick={handleShow} class="add-btn">+ Add New</button>
        </div>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form id="model_form">
            <Row>
                <Col>
                <Form.Label>First name</Form.Label>
                <Form.Control placeholder="" />
                </Col>
                <Col>
                <Form.Label>Last name</Form.Label>
                <Form.Control placeholder="" />
                </Col>
            </Row> <br/>
            <Row>
                <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Enter email</Form.Label>    
                <Form.Control type="email" placeholder="" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Password</Form.Label>  
                <Form.Control type="password" placeholder="" />
                </Form.Group>
            </Row><br/>
            <Row>
                <Col>
                <Form.Label>Phone No.</Form.Label>  
                <Form.Control placeholder="" />
                </Col>
                <Col>
                <Button variant="secondary">ADD USER</Button>
                </Col>
            </Row>
        </Form>
        </Modal.Body>
       
      </Modal>
       
    </>
  )
}

export default AddNewModel