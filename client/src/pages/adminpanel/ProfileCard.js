import React, { useState } from 'react';
import './UserManagement.css';
import './ProfileCard.css';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios';

function ProfileCard({ user, onUserDeleted }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    console.log("User Object:", user);
    console.log("User Created At:", user.created_at);

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${user.first_name}?`)) {
            try {
                await axios.delete(`http://localhost:8800/api/users/${user.user_id}`);
                alert("User deleted successfully");
                handleClose();     // Close the modal
                onUserDeleted();   // Refresh user list
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user.");
            }
        }
    };

    const handleEdit = () => {
        alert(`Edit clicked for user ID: ${user.user_id}`);
        // Add edit modal or logic here if needed
    };

    return (
        <>
            <tr onClick={handleShow}>
                <td>{user.first_name} {user.last_name}</td>
                <td>{user.user_name}</td>
                <td>{user.role}</td>
            </tr>

            <Modal show={show} onHide={handleClose} id="profileCard_model">
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Row>
                        <Col md={4}>
                            <img src="photoId.svg" alt="User Profile" className="img-fluid" />
                        </Col>
                        <Col md={8}>
                            <div className="UserDetail"><strong>First Name:</strong> {user.first_name}</div>
                            <div className="UserDetail"><strong>Last Name:</strong> {user.last_name}</div>
                            <div className="UserDetail"><strong>Username (Email):</strong> {user.user_name}</div>
                            <div className="UserDetail"><strong>Role:</strong> {user.role}</div>
                            <div className="UserDetail">
                                <strong>Created At:</strong> {
                                    user.created_at
                                    ? new Date(user.created_at.replace(' ', 'T')).toLocaleString('en-IN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        })
                                    : 'N/A'
                                }
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <button className="btn btn-warning" onClick={handleEdit}>Edit</button>
                    <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ProfileCard;