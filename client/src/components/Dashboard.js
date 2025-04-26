import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Modal, Button } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FiLink } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const [first_name, setFirstName] = useState('');
  const [user, setUser] = useState(null);
  const handleLogout = () => {
    setShowLogout(false);
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    navigate('/');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:8800/api/firstNames', {
          credentials: 'include',
          method: "GET",
        });
    
        const data = await response.json();
        console.log('User:', data);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    

    fetchUser();
  }, []);

  const defectData = {
    labels: ['Not Damaged', 'Damaged'],
    datasets: [
      {
        data: [45, 55],
        backgroundColor: ['#F4A261', '#D2691E'],
      },
    ],
  };

  const palletStatusData = {
    labels: ['Delivered', 'In-Transit', 'In-Stock'],
    datasets: [
      {
        data: [92, 78, 200],
        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107'],
      },
    ],
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar-container">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="content-container flex-grow-1 p-3">
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center mb-3 mx-10">
            <h3><i style={{ fontWeight: '800' }}>Welcome, {first_name}</i></h3>
            <img 
              src={`${process.env.PUBLIC_URL}/Signout.svg`} 
              alt="Logout" 
              onClick={() => setShowLogout(true)} 
              style={{ cursor: 'pointer', width: '30px', height: '30px' }}
            />
          </div>

          {/* Logout Confirmation Modal */}
          <Modal 
            show={showLogout} 
            onHide={() => setShowLogout(false)} 
            centered
            style={{ borderRadius: '20px', overflow: 'hidden' }}
          >
            <div style={{ padding: '20px', borderRadius: '20px' }}>
              <Modal.Header closeButton className="border-0">
                <Modal.Title 
                  className="w-100 text-center" 
                  style={{ fontWeight: 'bold', color: '#333' }}
                >
                  Logout Confirmation
                </Modal.Title>
              </Modal.Header>

              <Modal.Body 
                className="text-center" 
                style={{ fontSize: '16px', color: '#555' }}
              >
                Are you sure you want to log out?
              </Modal.Body>

              <Modal.Footer className="border-0 d-flex justify-content-center">
                <Button 
                  variant="light"
                  onClick={handleLogout}
                  style={{ 
                    color: '#FFFFFF', 
                    backgroundColor: '#373F51', 
                    padding: '8px 20px', 
                    borderRadius: '20px', 
                    width: '160px' 
                  }}
                >
                  CONFIRM
                </Button>

                <Button 
                  variant="light" 
                  onClick={() => setShowLogout(false)}
                  style={{ 
                    backgroundColor: '#D8DBE2', 
                    borderRadius: '20px',  
                    color: '#333', 
                    padding: '8px 20px', 
                    width: '160px' 
                  }}
                >
                  CANCEL
                </Button>
              </Modal.Footer>
            </div>
          </Modal>

          {/* Transactions Section */}
          <Row className="custom-row g-3 mt-2">
            <Col md={5} className="custom-col">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Card.Title>Recent Transactions(In-transit)</Card.Title>
                    <Link to="/transactions">
                      <FiLink size={20} />
                    </Link>
                  </div>
                  <Table responsive className="w-100">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody style={{fontWeight: 600}}>
                      {['Deere & Co.', 'Ashok Leyland', 'Caterpillar India', 'Maruti Suzuki'].map((client, index) => (
                        <tr key={index}>
                          <td>{client}</td>
                          <td>
                            <Link to="/transactions">
                              <span className="badge bg-primary">In-transit</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>

            <Col md={5} className="custom-col">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Card.Title>Recent Transactions(Closed)</Card.Title>
                    <Link to="/transactions">
                      <FiLink size={20} />
                    </Link>
                  </div>
                  <Table responsive className="w-100">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['Force Motors', 'General Motors India', 'Mahindra & Mahindra', 'VE Commercial Vehicle'].map((client, index) => (
                        <tr key={index}>
                          <td>{client}</td>
                          <td>
                            <Link to="/transactions">
                              <span className="badge bg-success">Closed</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Charts Section */}
          <Row className="custom-row g-3 mt-3">
            <Col md={5} className="custom-col">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="d-flex justify-content-between align-items-center w-100 mb-3">
                    <Card.Title>Defect Detection</Card.Title>
                    <Link to="/Defect Detection">
                      <FiLink size={20} />
                    </Link>
                  </div>
                  <div className="chart-container">
                    <Doughnut data={defectData} />
                  </div>
                  <div className="text-center mt-3">
                    <p><strong>125</strong> Total Pallets Checked</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={5} className="custom-col">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column align-items-center">
                  <div className="d-flex justify-content-between align-items-center w-100 mb-3">
                    <Card.Title>Pallet Status</Card.Title>
                    <Link to="/Dashboard">
                      <FiLink size={20} />
                    </Link>
                  </div>
                  <div className="chart-container">
                    <Doughnut data={palletStatusData} />
                  </div>
                  <div className="text-center mt-3">
                    <p><strong>370</strong> Total Pallets</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
