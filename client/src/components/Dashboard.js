import React from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FiLink } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  // Defect Detection Data
  const defectData = {
    labels: ['Not Damaged', 'Damaged'],
    datasets: [
      {
        data: [45, 55],
        backgroundColor: ['#F4A261', '#D2691E'],
      },
    ],
  };

  // Pallet Status Data
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
            <h3>Welcome, John</h3>
            <img 
              src={`${process.env.PUBLIC_URL}/Signout.png`} 
              alt="Logout" 
              onClick={handleLogout} 
              style={{ cursor: 'pointer', width: '30px', height: '30px' }}
            />
          </div>

          {/* Transactions Section */}
          <Row className="custom-row g-3">
            <Col md={5} className="custom-col">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Card.Title>Recent Transactions</Card.Title>
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
                    <Card.Title>Recent Transactions</Card.Title>
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
                              <span className="badge bg-success">Delivered</span>
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
