import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TransactionTracking.css";
import Sidebar from "../../components/Sidebar";
import axios from "axios";

const statuses = ["All", "In Transit", "Closed", "Open"];

const TransactionTracking = () => {
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClient, setSelectedClient] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");

    const navigate = useNavigate();

    // Fetch data from backend API
    useEffect(() => {
        axios.get("http://localhost:8800/transaction/challans") // Adjust URL if needed
            .then(response => setTransactions(response.data))
            .catch(error => console.error("Error fetching transactions:", error));
    }, []);

    // Generate client list from dynamic data
    const clients = ["All", ...new Set(transactions.map(t => t.client))];

    // Filtered transactions
    const filteredTransactions = transactions.filter((transaction) => {
        const clientName = transaction.client?.toLowerCase() || "";
        return (
            clientName.includes(searchTerm.toLowerCase()) &&
            (selectedClient === "All" || transaction.client === selectedClient) &&
            (selectedStatus === "All" || transaction.status === selectedStatus)
        );
    });
    
    const handleRowClick = (challanId) => {
        navigate(`/TransactionChallan/${challanId}`);
    };

    return (
        <div className="d-flex">
            <div className="sidebar-container">
                <Sidebar />
            </div>
            <div className="content-container flex-grow-1 p-3">
                <div className="container">
                    <h2 className="title">Transaction Tracking</h2>

                    {/* Top Bar with Search and Filters */}
                    <div className="top-bar">
                        <input
                            type="text"
                            placeholder="Search by client"
                            className="search-bar"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        
                        <div className="filters-container">
                            <select
                                value={selectedClient}
                                onChange={(e) => setSelectedClient(e.target.value)}
                                className="filter-dropdown"
                            >
                                {clients.map((client, index) => (
                                    <option key={index} value={client}>{client}</option>
                                ))}
                            </select>

                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="filter-dropdown"
                            >
                                {statuses.map((status, index) => (
                                    <option key={index} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Table Container with Scroll */}
                    <div className="table-container">
                        <table>
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
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((transaction, index) => (
                                        <tr
                                            key={index}
                                            onClick={() => handleRowClick(transaction.challanId)}
                                            style={{ cursor: "pointer" }}
                                        >
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
                                    ))
                                ) : (
                                    <tr><td colSpan="5">No transactions found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionTracking;