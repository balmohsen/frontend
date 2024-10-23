// frontend/src/components/ViewSubmissions.js

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import styles from './ViewSubmissions.module.css';

const ViewSubmissions = () => {
    const { auth } = useContext(AuthContext);
    const [submissions, setSubmissions] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/certification/submissions`, {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`,
                    },
                });
                setSubmissions(response.data.submissions);
            } catch (err) {
                console.error('Error fetching submissions:', err);
                setError(err.response?.data?.message || 'Failed to fetch submissions.');
            }
        };

        fetchSubmissions();
    }, [auth.token]);

    if (error) return <p className={styles.error}>{error}</p>;
    if (submissions.length === 0) return <p>No submissions found.</p>;

    return (
        <div className={styles.container}>
            <h2>All Submissions</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Contract Name</th>
                        <th>Status</th>
                        <th>Current Approver</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map((submission) => (
                        <tr key={submission._id}>
                            <td>
                                <Link to={`/submission/${submission._id}`} className={styles.link}>
                                    {submission.contractName}
                                </Link>
                            </td>
                            <td>{submission.status || 'N/A'}</td>
                            <td>
                                {submission.currentApprover
                                    ? submission.currentApprover.charAt(0).toUpperCase() + submission.currentApprover.slice(1)
                                    : 'N/A'}
                            </td>
                            <td>
                                <Link to={`/submission/${submission._id}`} className={styles.viewButton}>
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewSubmissions;
