import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ClientCard = ({ client, onDelete, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [editedClient, setEditedClient] = useState(client);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedClient({ ...editedClient, [name]: value });
  };

  const handleSave = () => {
    onUpdate(editedClient);
    handleClose();
  };

  return (
    <div className="card shadow p-4 mb-4 bg-white rounded">
      <div className="d-flex justify-content-between align-items-start">
        <h4 className="fw-bold">{client.name}</h4>
        <button className="btn btn-outline-dark" onClick={() => onDelete(client.id)}>✖</button>
      </div>

      <p><strong>Email:</strong> {client.email}</p>
      <p><strong>Contact Person:</strong> {client.contactPerson}</p>
      <p><strong>Phone No.:</strong> {client.phone}</p>

      <p><strong>Address:</strong><br />
        {client.address.street}, {client.address.city}, {client.address.zip}<br />
        {client.address.state}, {client.address.country}
      </p>

      <p><strong>Client ID:</strong> {client.clientId}</p>
      <p><strong>Industry Type:</strong> {client.industry}</p>
      <p><strong>Storage Requirements:</strong> {client.storage}</p>
      <p><strong>Account Status:</strong> {client.status}</p>
      <p><strong>Created At:</strong> {client.createdAt}</p>
      <p><strong>Updated At:</strong> {client.updatedAt}</p>

      <div className="d-flex justify-content-between">
        <Button variant="dark" onClick={handleShow}>Edit</Button>
        <Button variant="danger" onClick={() => onDelete(client.id)}>Delete</Button>
      </div>

      {/* Edit Client Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Client Name</Form.Label>
              <Form.Control type="text" name="name" value={editedClient.name} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={editedClient.email} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" name="phone" value={editedClient.phone} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Industry Type</Form.Label>
              <Form.Control type="text" name="industry" value={editedClient.industry} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Storage Requirements</Form.Label>
              <Form.Control type="text" name="storage" value={editedClient.storage} onChange={handleChange} />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ClientCard;
