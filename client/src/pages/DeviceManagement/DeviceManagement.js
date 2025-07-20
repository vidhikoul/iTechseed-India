import React, { useState, useEffect } from 'react';
import '../adminpanel/UserManagement.css';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import DeviceDetailsModal from './DeviceDetailsModal';
import EditDeviceModal from './EditDeviceModal';
import AddDeviceModal from './AddDeviceModal';

function DeviceManagement() {
  const [devices, setDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8800/api/devices')
      .then(res => res.json())
      .then(data => setDevices(data))
      .catch(error => console.error('Error fetching devices:', error));
  }, []);

  const refreshDevices = () => {
    fetch('http://localhost:8800/api/devices')
      .then(res => res.json())
      .then(data => setDevices(data))
      .catch(error => console.error('Error refreshing devices:', error));
  };

  const handleDeviceClick = (device) => {
    setSelectedDevice(device);
    setShowDeviceModal(true);
  };

  const handleCloseModal = () => {
    setShowDeviceModal(false);
    setSelectedDevice(null);
  };

  const handleEditDevice = (device) => {
    setEditingDevice(device);
  };

  const handleDeleteDevice = (device) => {
    if (!window.confirm(`Are you sure you want to delete device "${device.device_name}"?`)) return;

    fetch(`/api/devices/${device.device_id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to delete device");
        }
        setDevices(prev => prev.filter(d => d.device_id !== device.device_id));
        setShowDeviceModal(false);
        alert(`Device "${device.device_name}" deleted successfully.`);
      })
      .catch(err => {
        console.error("Error deleting device:", err);
        alert("Error deleting device");
      });
  };

  // Filter devices based on search term
  const filteredDevices = devices.filter(device =>
    device.device_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.device_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.ip_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(device.device_id).includes(searchTerm)
  );

  return (
    <div className="d-flex">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content-container flex-grow-1 p-3">
        <div className="container">
          <h2 className="title" id="h2Text" onClick={() => navigate("/AdminPanel")}>
            &lt; Device Management
          </h2>

          <div className="top-bar">
            <input
              type="text"
              placeholder="Search"
              className="search-bar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span>
              <button className="add-btn" onClick={() => setShowAddModal(true)}>+ Add New Device</button>
            </span>
          </div>

          <div id="ProfileCrad">
            <table>
              <thead>
                <tr>
                  <th>Device ID</th>
                  <th>Device Name</th>
                  <th>Device Type</th>
                  <th>IP Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.length > 0 ? (
                  filteredDevices.map(device => (
                    <tr key={device.device_id} onClick={() => handleDeviceClick(device)} style={{ cursor: "pointer", textDecoration: "underline" }}>
                      <td>{device.device_id}</td>
                      <td>{device.device_name}</td>
                      <td>{device.device_type}</td>
                      <td>{device.ip_address}</td>
                      <td>{device.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No devices found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {showDeviceModal && selectedDevice && (
            <DeviceDetailsModal
              device={selectedDevice}
              onClose={handleCloseModal}
              onEdit={() => handleEditDevice(selectedDevice)}
              onDelete={() => handleDeleteDevice(selectedDevice)}
            />
          )}

          {editingDevice && (
            <EditDeviceModal
              device={editingDevice}
              onClose={() => setEditingDevice(null)}
              onSave={() => {
                setEditingDevice(null);
                setShowDeviceModal(false);
                refreshDevices();
              }}
            />
          )}

          {showAddModal && (
            <AddDeviceModal
              onClose={() => setShowAddModal(false)}
              onSave={() => {
                setShowAddModal(false);
                refreshDevices();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default DeviceManagement;