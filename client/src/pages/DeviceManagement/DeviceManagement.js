import React from 'react';
import '../adminpanel/UserManagement.css';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';

function DeviceManagement() {
  const navigate = useNavigate();

  // Dummy data for devices based on attached image content
  const devices = [
    { id: 1, name: 'Device A', type: 'Scanner', ip: '192.168.1.10', status: 'Active' },
    { id: 2, name: 'Device B', type: 'Printer', ip: '192.168.1.11', status: 'Inactive' },
    { id: 3, name: 'Device C', type: 'Terminal', ip: '192.168.1.12', status: 'Active' },
    { id: 4, name: 'Device D', type: 'Controller', ip: '192.168.1.13', status: 'Maintenance' }
  ];

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
            <input type="text" placeholder="Search" className="search-bar" />
            <span>
              {/* Placeholder button for adding a new device */}
              <button className="add-btn">Add New Device</button>
            </span>
          </div>

          {/* Device Management Table */}
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
                {devices.length > 0 ? (
                  devices.map(device => (
                    <tr key={device.id}>
                      <td>{device.id}</td>
                      <td>{device.name}</td>
                      <td>{device.type}</td>
                      <td>{device.ip}</td>
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
        </div>
      </div>
    </div>
  );
}

export default DeviceManagement;
