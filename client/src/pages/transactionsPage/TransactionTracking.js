import React, { useState } from "react";
import { Table, Form } from "react-bootstrap";
import "./TransactionTracking.css"; // Importing updated styles
import Sidebar from "../../components/Sidebar";

const transactionsData = [
    { client: "John Deere India", date: "03/01/2025", materialCode: "ABCD123456789", challanId: "1234567889", status: "In Transit" },
    { client: "Spirit Corporation", date: "03/01/2025", materialCode: "ABCD123456789", challanId: "1234567889", status: "Closed" },
    { client: "Caterpillar India", date: "03/01/2025", materialCode: "ABCD123456789", challanId: "1234567889", status: "Open" },
    { client: "Force Motors", date: "03/01/2025", materialCode: "ABCD123456789", challanId: "1234567889", status: "In Transit" },
    { client: "Fabpro Engineering", date: "03/01/2025", materialCode: "ABCD123456789", challanId: "1234567889", status: "Open" },
    { client: "Fabpro Engineering", date: "03/01/2025", materialCode: "ABCD123456789", challanId: "1234567889", status: "Closed" },
    { client: "Spirit Corporation", date: "03/01/2025", materialCode: "ABCD123456789", challanId: "1234567889", status: "Closed" }
];

const clients = [...new Set(transactionsData.map(t => t.client))]; // Unique clients
const statuses = ["All", "In Transit", "Closed", "Open"];

const TransactionTracking = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClient, setSelectedClient] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");

    // Filter transactions based on search, client, and status
    const filteredTransactions = transactionsData.filter((transaction) => {
        return (
            transaction.client.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedClient === "All" || transaction.client === selectedClient) &&
            (selectedStatus === "All" || transaction.status === selectedStatus)
        );
    });

    return (
        <>
        <Sidebar/>
        <div className="transaction-container">
            <h2 className="mb-3">All Transactions</h2>

            {/* Filters Section */}
            <div className="filters">
                <Form.Control
                    type="text"
                    placeholder="Search"
                    className="search-bar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="dropdown-container">
                    <div className="dropdown-group">
                        <label className="filter-label">Sort by: Client</label>
                        <Form.Select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} className="filter-dropdown">
                            <option value="All">All Clients</option>
                            {clients.map((client, index) => (
                                <option key={index} value={client}>{client}</option>
                            ))}
                        </Form.Select>
                    </div>

                    <div className="dropdown-group">
                        <label className="filter-label">Sort by: Status</label>
                        <Form.Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="filter-dropdown">
                            {statuses.map((status, index) => (
                                <option key={index} value={status}>{status}</option>
                            ))}
                        </Form.Select>
                    </div>
                </div>
            </div>

            {/* Transaction Table */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Client</th>
                        <th>Date of Dispatch</th>
                        <th>Material Code</th>
                        <th>Challan ID</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTransactions.map((transaction, index) => (
                        <tr key={index}>
                            <td>{transaction.client}</td>
                            <td>{transaction.date}</td>
                            <td>{transaction.materialCode}</td>
                            <td>{transaction.challanId}</td>
                            <td>
                                <span className={`status-badge ${transaction.status.replace(/\s/g, "-").toLowerCase()}`}>
                                    {transaction.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
        </>
    );
};

export default TransactionTracking;
