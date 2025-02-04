import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Sidebar from './Sidebar';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const defectData = {
    labels: ['Not Damaged', 'Damaged'],
    datasets: [
      {
        data: [45, 55],
        backgroundColor: ['#4caf50', '#ff5722'],
        hoverBackgroundColor: ['#66bb6a', '#ff7043'],
      },
    ],
  };

  const palletStatusData = {
    labels: ['Delivered', 'In-Transit', 'In-Stock'],
    datasets: [
      {
        data: [92, 78, 200],
        backgroundColor: ['#4caf50', '#2196f3', '#ffc107'],
        hoverBackgroundColor: ['#66bb6a', '#42a5f5', '#ffd54f'],
      },
    ],
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        <div className="flex-grow-1 p-4 bg-light">
          <h3 className="mb-4">Welcome, John</h3>

          {/* Recent Transactions */}
          <div className="d-flex mb-4">
            <Card className="flex-grow-1 me-3">
              <Card.Body>
                <Card.Title>Recent Transactions</Card.Title>
                <div className="d-flex justify-content-between">
                  <div>
                    <p>Deere & Co.</p>
                    <p>Ashok Leyland</p>
                    <p>Caterpillar India</p>
                    <p>Maruti Suzuki</p>
                  </div>
                  <div>
                    <span className="badge bg-primary">In-transit</span><br />
                    <span className="badge bg-primary">In-transit</span><br />
                    <span className="badge bg-primary">In-transit</span><br />
                    <span className="badge bg-primary">In-transit</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
            <Card className="flex-grow-1 ms-3">
              <Card.Body>
                <Card.Title>Recent Transactions</Card.Title>
                <div className="d-flex justify-content-between">
                  <div>
                    <p>Force Motors</p>
                    <p>General Motors India</p>
                    <p>Mahindra & Mahindra</p>
                    <p>VE Commercial Vehicle</p>
                  </div>
                  <div>
                    <span className="badge bg-success">Delivered</span><br />
                    <span className="badge bg-success">Delivered</span><br />
                    <span className="badge bg-success">Delivered</span><br />
                    <span className="badge bg-success">Delivered</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Charts */}
          <div className="d-flex">
            <Card className="flex-grow-1 me-3">
              <Card.Body>
                <Card.Title>Defect Detection</Card.Title>
                <Doughnut data={defectData} />
                <div className="text-center mt-3">
                  <p><strong>125</strong> Total Pallets Checked</p>
                </div>
              </Card.Body>
            </Card>
            <Card className="flex-grow-1 ms-3">
              <Card.Body>
                <Card.Title>Pallet Status</Card.Title>
                <Doughnut data={palletStatusData} />
                <div className="text-center mt-3">
                  <p><strong>370</strong> Total Pallets</p>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-dark text-white text-center py-3">
          &copy; 2025 ManuScan. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
