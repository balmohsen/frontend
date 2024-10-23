// frontend/src/components/AdminDashboard.js

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${auth.token}`,
          },
        });
        setUsers(response.data.users);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.response?.data?.message || 'Failed to fetch users.');
      }
    };

    fetchUsers();
  }, [auth.token]);

  // Handle role assignment
  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) {
      setError('Please select a user and a role.');
      setMessage('');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/assign-role`, {
        username: selectedUser,
        role: selectedRole,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      setMessage(response.data.message);
      setError('');

      // Refresh the users list
      const updatedUsers = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      setUsers(updatedUsers.data.users);
      setSelectedUser(''); // Reset selection
      setSelectedRole('user'); // Reset to default role
    } catch (err) {
      console.error('Error assigning role:', err);
      setError(err.response?.data?.message || 'Failed to assign role.');
      setMessage('');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Admin Dashboard</h2>

      {/* Assign Role Section */}
      <section style={styles.section}>
        <h3>Assign Roles to Users</h3>
        <div style={styles.formGroup}>
          <label htmlFor="username">User:</label>
          <select
            id="username"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            style={styles.select}
          >
            <option value="">--Select User--</option>
            {users.map((user) => (
              <option key={user.username} value={user.username}>
                {user.username} ({user.role})
              </option>
            ))}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            style={styles.select}
          >
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="vp">VP</option>
            <option value="finance">Finance</option>
            <option value="administrator">Administrator</option>
          </select>
        </div>
        <button onClick={handleAssignRole} style={styles.assignButton}>
          Assign Role
        </button>
        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
      </section>

      {/* Users List Section */}
      <section style={styles.section}>
        <h3>All Users</h3>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.username}>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: '800px',
    margin: 'auto',
    padding: '20px',
  },
  section: {
    marginBottom: '40px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '15px',
  },
  select: {
    padding: '8px',
    marginTop: '5px',
    borderRadius: '3px',
    border: '1px solid #ccc',
  },
  assignButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  success: {
    color: 'green',
    marginTop: '10px',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    backgroundColor: '#f2f2f2',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
  },
};

export default AdminDashboard;
