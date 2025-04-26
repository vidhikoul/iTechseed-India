// InventoryManagement.jsx
import React, { useEffect, useState } from "react";
import "./InventoryManagement.css";
import Sidebar from "../../components/Sidebar";
import AddInventoryModel from "./AddInventoryModel";
import Pagination from "./Pagination";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { Button } from "react-bootstrap";

function InventoryManagement() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetch("http://localhost:8800/api/inventory")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Inventory Data:", data);
        setInventory(data || []);
      })
      .catch((err) => console.error("Error fetching inventory data:", err));
  }, []);

  const handleAddInventory = (newItem) => {
    setInventory((prev) => [newItem, ...prev]);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const sheetName = wb.SheetNames[0];
      const sheet = wb.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      setInventory((prev) => [...data, ...prev]);
    };
    reader.readAsBinaryString(file);
  };

  const filteredInventory = inventory.filter(
    (item) =>
      item?.material_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.material_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);

  return (
    <div className="d-flex">
      <div className="sidebar-container">
        <Sidebar />
      </div>

      <div className="content-container flex-grow-1 p-3">
        <div className="container" style={{ overflow: "hidden" }}>
          <h2 className="title" id="h2Text" onClick={() => navigate("/AdminPanel")}>
            &lt; Inventory Management
          </h2>

          <div className="top-bar d-flex justify-content-between align-items-center mb-3 flex-wrap">
  <input
    type="text"
    placeholder="Search by Material Description or Number"
    className="form-control"
    style={{ maxWidth: "400px" }}
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    }}
  />

  <div className="d-flex gap-2 mt-2 mt-md-0">
    <AddInventoryModel onAddInventory={handleAddInventory} />
    <Button variant="outline-success" as="label">
      📥 Import Excel/CSV
      <input type="file" accept=".xlsx,.xls,.csv" hidden onChange={handleImport} />
    </Button>
  </div>
</div>




          <div
            className="table-responsive"
            style={{
              maxHeight: "calc(100vh - 200px)",
              overflow: "auto",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            }}
          >
            {currentItems.length > 0 ? (
              <table className="table table-striped table-hover">
                <thead style={{ position: "sticky", top: 0, background: "white", zIndex: 1 }}>
                  <tr>
                    <th>Inventory ID</th>
                    <th>Plant</th>
                    <th>Material Number</th>
                    <th>Material Description</th>
                    <th>Storage Location</th>
                    <th>Unrestricted Stock</th>
                    <th>Base Unit</th>
                    <th>Value Unrestricted</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => (
                    <tr key={item.inventory_id}>
                      <td>{item.inventory_id}</td>
                      <td>{item.plant}</td>
                      <td>{item.material_number}</td>
                      <td>{item.material_description}</td>
                      <td>{item.storage_location}</td>
                      <td>{item.unrestricted}</td>
                      <td>{item.base_unit_of_measure}</td>
                      <td>{item.value_unrestricted}</td>
                      <td>
                        <button className="btn btn-danger btn-sm">DELETE</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data text-center py-4">No Inventory Data Found</p>
            )}
          </div>

          <div className="mt-3 d-flex justify-content-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryManagement;
