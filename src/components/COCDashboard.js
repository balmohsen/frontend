// frontend/src/components/COCDashboard.js

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const COCDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [forms, setForms] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/coc-forms`, {
          headers: {
            'Authorization': `Bearer ${auth.token}`,
          },
        });
        setForms(response.data.forms);
      } catch (err) {
        console.error('Error fetching COC forms:', err);
        setError(err.response?.data?.message || 'Failed to fetch COC forms.');
      }
    };

    fetchForms();
  }, [auth.token]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (forms.length === 0) return <p>No COC forms submitted yet.</p>;

  return (
    <div style={styles.container}>
      <h2>My COC Forms</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Completion Date</th>
            <th>Score</th>
            <th>Comments</th>
            <th>Status</th>
            <th>Current Approver</th>
          </tr>
        </thead>
        <tbody>
          {forms.map((form) => (
            <tr key={form._id}>
              <td>{form.course_name}</td>
              <td>{new Date(form.completion_date).toLocaleDateString()}</td>
              <td>{form.score}</td>
              <td>{form.comments}</td>
              <td>{form.status}</td>
              <td>{form.current_approver}</td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default COCDashboard;
