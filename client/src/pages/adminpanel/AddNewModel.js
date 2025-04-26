import React, { useState } from 'react';
import './UserManagement.css';
import './AddNewModel.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import axios from 'axios';

function AddNewModel({ onUserAdded }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    user_name: '',
    password: '',
    role: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8800/api/users/add', formData);
      alert('User added successfully!');
      handleClose();
      setFormData({ first_name: '', last_name: '', user_name: '', password: '', role: '' });
      if (onUserAdded) onUserAdded(); // <-- refresh user list
    } catch (err) {
      console.error(err);
      alert('Failed to add user.');
    }
  };

  return (
    <>
      <div>
        <button onClick={handleShow} className="add-btn">+ Add New</button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="model_form" onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </Col>
            </Row><br />
            <Row>
              <Form.Group as={Col}>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Row><br />
            <Row>
              <Col>
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Role</option>   
                  <option value="admin">Admin</option>
                  <option value="operator">Operator</option>
                  <option value="manager">Manager</option>
                  <option value="security_guard">Security Guard</option>
                  
                </Form.Select>
              </Col>
            </Row><br />
            <Row>
              <Col>
                <Button type="submit" variant="secondary">ADD USER</Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddNewModel;
