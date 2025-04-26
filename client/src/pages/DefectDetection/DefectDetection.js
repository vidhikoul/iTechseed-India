import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Form, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./DefectDetection.css";
import Sidebar from "../../components/Sidebar";

const DefectDetection = () => {
    const [defectsData, setDefectsData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClient, setSelectedClient] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const defectsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDefects = async () => {
            try {
                const res = await axios.get("http://localhost:8800/defect/challans");
                setDefectsData(res.data);
            } catch (err) {
                console.error("Failed to fetch defect data:", err);
            }
        };

        fetchDefects();
    }, []);

    // Filter clients based on the fetched data
    const clients = ["All", ...new Set(defectsData.map(t => t.client))];

    // Apply search filter and selected client filter
    const filteredDefects = defectsData.filter((defect) => {
        const clientName = defect.client?.toLowerCase() || "";
        return (
            clientName.includes(searchTerm.toLowerCase()) &&
            (selectedClient === "All" || defect.client === selectedClient)
        );
    });

    // Calculate pagination
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
                            <Form.Select
                                value={selectedClient}
                                onChange={(e) => setSelectedClient(e.target.value)}
                                className="filter-dropdown"
                            >
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
                            <tr
                                key={index}
                                onClick={() => navigate(`/DefectChallan/${defect['Challan ID']}`)}
                                className="clickable-row"
                            >
                                <td>{indexOfFirstDefect + index + 1}</td>
                                <td>{defect.client}</td>
                                <td>{defect['Challan ID']}</td>
                                <td>{defect['Date of Return']}</td>
                                <td>{defect.unit}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Pagination className="pagination">
                    {[...Array(Math.ceil(filteredDefects.length / defectsPerPage))].map((_, index) => (
                        <Pagination.Item
                            key={index}
                            active={index + 1 === currentPage}
                            onClick={() => paginate(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>
        </>
    );
};

export default DefectDetection;
