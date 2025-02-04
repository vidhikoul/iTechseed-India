import React from "react";
import { Container, Row, Col, Card, Button, Table, Form } from "react-bootstrap";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Footer from '../../components/Footer';

import Header from '../../components/Header';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar as BarChart, Doughnut as DoughnutChart } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Overview() {
  // Dummy data for charts and KPIs
  const inventoryStats = {
    available: 1200,
    dispatched: 800,
    underRepair: 50,
  };

  const kpis = {
    cycleTime: "5 days",
    defectRate: "2%",
    repairTrends: "10 repairs/day",
  };

  const defectDetectionTrends = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Defects Detected",
        data: [5, 10, 6, 8, 7, 9],
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  const palletMovement = {
    labels: ["Received", "Dispatched", "Under Repair"],
    datasets: [
      {
        data: [1200, 800, 50],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  const userActivityLogs = [
    { user: "Admin", action: "Dispatched 50 pallets", timestamp: "2025-01-23 10:15:00" },
    { user: "Operator", action: "Marked 10 pallets under repair", timestamp: "2025-01-23 09:45:00" },
    { user: "Manager", action: "Generated monthly report", timestamp: "2025-01-22 15:30:00" },
  ];

  // Export reports as Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(userActivityLogs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User Activity Logs");
    XLSX.writeFile(workbook, "UserActivityLogs.xlsx");
  };

  // Export reports as PDF (using JSON data as a Blob for simplicity)
  const exportToPDF = () => {
    const pdfData = JSON.stringify(userActivityLogs, null, 2);
    const blob = new Blob([pdfData], { type: "application/pdf" });
    saveAs(blob, "UserActivityLogs.pdf");
  };

  return (
    <>
      <Header />
      <Container
        className="mt-5"
        style={{
          minHeight: "calc(100vh - 200px)", // Adjust height to account for header and footer
          marginBottom: "100px", // Space for the footer
        }}
      >
        {/* Overview Section */}
        <Row>
          <Col>
            <h2>Overview & Reports</h2>
          </Col>
        </Row>

        <Row className="mt-4">
          {/* Real-Time Inventory Stats */}
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Pallets Available</Card.Title>
                <Card.Text>{inventoryStats.available}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Pallets Dispatched</Card.Title>
                <Card.Text>{inventoryStats.dispatched}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Pallets Under Repair</Card.Title>
                <Card.Text>{inventoryStats.underRepair}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Key Performance Indicators */}
        <Row className="mt-5">
          <Col>
            <h4>Key Performance Indicators (KPIs)</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cycle Time</td>
                  <td>{kpis.cycleTime}</td>
                </tr>
                <tr>
                  <td>Defect Rate</td>
                  <td>{kpis.defectRate}</td>
                </tr>
                <tr>
                  <td>Repair Trends</td>
                  <td>{kpis.repairTrends}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* Visual Dashboards */}
        <Row className="mt-5">
          <Col md={6}>
            <h4>Pallet Movement</h4>
            <DoughnutChart data={palletMovement} />
          </Col>
          <Col md={6}>
            <h4>Defect Detection Trends</h4>
            <BarChart data={defectDetectionTrends} />
          </Col>
        </Row>

        {/* User Activity Logs */}
        <Row className="mt-5">
          <Col>
            <h4>User Activity Logs</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {userActivityLogs.map((log, index) => (
                  <tr key={index}>
                    <td>{log.user}</td>
                    <td>{log.action}</td>
                    <td>{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* Report Export Options */}
        <Row className="mt-4">
          <Col>
            <h4>Generate Reports</h4>
            <Form className="d-flex gap-2">
              <Button variant="success" onClick={exportToExcel}>
                Export as Excel
              </Button>
              <Button variant="danger" onClick={exportToPDF}>
                Export as PDF
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default Overview;
