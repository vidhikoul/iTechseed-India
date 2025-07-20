import React, { useEffect, useState } from 'react';
import './UserManagement.css';
import AddNewModel from './AddNewModel';
import ProfileCard from './ProfileCard';
import Sidebar from '../../components/Sidebar';
import { useNavigate } from 'react-router-dom';

function Usermanagement() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    const refreshUsers = () => {
        fetch('http://localhost:8800/users')
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error refreshing users:', error));
    };

    useEffect(() => {
        refreshUsers();
    }, []);

    return (
        <div className="d-flex">
            <div className="sidebar-container">
                <Sidebar />
            </div>
            <div className="content-container flex-grow-1 p-3">
                <div className="container">
                    <h2 className="title" id="h2Text" onClick={() => navigate("/AdminPanel")}>&lt; User Management</h2>

                    <div className="top-bar">
                        <input type="text" placeholder="Search" className="search-bar" />
                        <span>
                            <AddNewModel onUserAdded={refreshUsers} />
                        </span>
                    </div>

                    {/* Table with Headers */}
                    <div id="ProfileCard">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody style={{ cursor: "pointer", textDecoration: "underline" }}>
                                {users.length > 0 ? (
                                    users.map(user => (
                                        <ProfileCard key={user.user_id} user={user} onUserDeleted={refreshUsers} />
                                    ))
                                ) : (
                                    <tr><td colSpan="3">No users found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Usermanagement;
