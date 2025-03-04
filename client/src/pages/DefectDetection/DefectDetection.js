import React, { useState } from "react";
import { Table, Form, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./DefectDetection.css"; // Importing updated styles
import Sidebar from "../../components/Sidebar";

const defectsData = [
    { client: "John Deere", date: "03/01/2025", challanId: "ABCD123456789", unit: "EA" },
    { client: "General Motors India", date: "03/01/2025", challanId: "ABCD123456789", unit: "EA" },
    { client: "Force Motors", date: "03/01/2025", challanId: "ABCD123456789", unit: "EA" },
    { client: "VE Commercial Vehicle", date: "03/01/2025", challanId: "ABCD123456789", unit: "EA" },
    { client: "Force Motors", date: "03/01/2025", challanId: "ABCD123456789", unit: "EA" },
    { client: "Deere & Co.", date: "03/01/2025", challanId: "ABCD123456789", unit: "EA" },
    { client: "VE Commercial Vehicle", date: "03/01/2025", challanId: "ABCD123456789", unit: "EA" },
    { client: "Force Motors", date: "03/01/2025", challanId: "ABCD123456789", unit: "EA" },
    { client: "John Deere", date: "03/01/2025", challanId: "ABCD123456789", unit: "EA" },
    { client: "Force Motors", date: "03/01/2025", challanId: "ABCD123456789", unit: "EA" },
    { client: "Tata Motors", date: "03/01/2025", challanId: "XYZD567890123", unit: "EA" },
    { client: "Mahindra & Mahindra", date: "03/01/2025", challanId: "LMNO098765432", unit: "EA" }
];

const clients = [...new Set(defectsData.map(t => t.client))]; // Unique clients

const DefectDetection = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClient, setSelectedClient] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const defectsPerPage = 10;
    const navigate = useNavigate();

    const filteredDefects = defectsData.filter((defect) => {
        return (
            defect.client.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedClient === "All" || defect.client === selectedClient)
        );
    });

    const indexOfLastDefect = currentPage * defectsPerPage;
    const indexOfFirstDefect = indexOfLastDefect - defectsPerPage;
    const currentDefects = filteredDefects.slice(indexOfFirstDefect, indexOfLastDefect);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <Sidebar />
            <div className="defect-container">
                <h2 className="mb-3">Defect Detection</h2>

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
                    </div>
                </div>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Sr. No.</th>
                            <th>Client</th>
                            <th>Challan ID</th>
                            <th>Date of Return</th>
                            <th>Unit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDefects.map((defect, index) => (
                            <tr key={index} onClick={() => navigate(`/DefectChallan/`)} className="clickable-row">
                                <td>{indexOfFirstDefect + index + 1}</td>
                                <td>{defect.client}</td>
                                <td>{defect.challanId}</td>
                                <td>{defect.date}</td>
                                <td>{defect.unit}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Pagination className="pagination">
                    {[...Array(Math.ceil(filteredDefects.length / defectsPerPage))].map((_, index) => (
                        <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                            {index + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>
        </>
    );
};

export default DefectDetection;
