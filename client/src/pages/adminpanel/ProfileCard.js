import React, { useState } from 'react';
import './UserManagement.css';
import './ProfileCard.css';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function ProfileCard({ user }) {
    const [show, setShow] = useState(false);
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            {/* Table Row */}
            <tr onClick={handleShow}>
                <td>{user.first_name} {user.last_name}</td>
                <td>{user.user_name}</td>
                <td>{user.role}</td>
            </tr>

            {/* Modal for User Details */}
            <Modal show={show} onHide={handleClose} id="profileCard_model">
                <Modal.Header closeButton>
                    <Row>
                        <Col><img src="photoId.svg" alt="User Profile" /></Col>
                        <Col>
                            <div className="UserName"><h6>{user.first_name} {user.last_name}</h6></div>
                            <div className="UserEmail">Email: {user.user_name}</div>
                            <div className="UserRole">Role: {user.role}</div>
                        </Col>
                    </Row>
                </Modal.Header>
            </Modal>
        </>
    );
}

export default ProfileCard;
