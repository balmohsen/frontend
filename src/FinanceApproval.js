// src/FinanceApproval.js

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';

const FinanceApproval = ({ reviewerId }) => {
    const { auth } = useContext(AuthContext);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/certificates/finance/${reviewerId}`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                });
                setCertificates(response.data);
            } catch (error) {
                console.error(error);
                alert('Error fetching certificates: ' + (error.response?.data?.error || error.message));
            } finally {
                setLoading(false);
            }
        };
        if (reviewerId) {
            fetchCertificates();
        }
    }, [reviewerId, auth]);

    const handleAction = async (id, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this certificate?`)) return;

        setActionLoading(true);
        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/approve/finance/${id}`, { action }, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            alert(response.data.message);
            // Refresh the list
            setCertificates(certificates.filter(cert => cert.id !== id));
        } catch (error) {
            console.error(error);
            alert('Error performing action: ' + (error.response?.data?.error || error.message));
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <p>Loading Finance Reviewer Dashboard...</p>;
    }

    return (
        <div style={{ marginBottom: '30px' }}>
            <h2>Finance Reviewer Dashboard</h2>
            {certificates.length === 0 ? (
                <p>No certificates pending your review.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>ID</th>
                            <th style={tableHeaderStyle}>User ID</th>
                            <th style={tableHeaderStyle}>Course Name</th>
                            <th style={tableHeaderStyle}>Completion Date</th>
                            <th style={tableHeaderStyle}>Score</th>
                            <th style={tableHeaderStyle}>Status</th>
                            <th style={tableHeaderStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {certificates.map(cert => (
                            <tr key={cert.id}>
                                <td style={tableCellStyle}>{cert.id}</td>
                                <td style={tableCellStyle}>{cert.user_id}</td>
                                <td style={tableCellStyle}>{cert.course_name}</td>
                                <td style={tableCellStyle}>{cert.completion_date}</td>
                                <td style={tableCellStyle}>{cert.score}</td>
                                <td style={tableCellStyle}>{cert.status}</td>
                                <td style={tableCellStyle}>
                                    <button 
                                        onClick={() => handleAction(cert.id, 'approve')} 
                                        disabled={actionLoading}
                                        style={{ marginRight: '5px', padding: '4px 8px' }}
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleAction(cert.id, 'reject')} 
                                        disabled={actionLoading}
                                        style={{ marginRight: '5px', padding: '4px 8px' }}
                                    >
                                        Reject
                                    </button>
                                    <button 
                                        onClick={() => handleAction(cert.id, 'sendback')} 
                                        disabled={actionLoading}
                                        style={{ padding: '4px 8px' }}
                                    >
                                        Send Back
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const tableHeaderStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    backgroundColor: '#f9f9f9',
    textAlign: 'left'
};

const tableCellStyle = {
    border: '1px solid #ddd',
    padding: '8px'
};

export default FinanceApproval;
