// src/CertificateList.js

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';

const CertificateList = () => {
    const { auth } = useContext(AuthContext);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/certificates`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`,
                    },
                });
                const userCertificates = response.data.filter(cert => cert.user_id === auth.user.username);
                setCertificates(userCertificates);
            } catch (error) {
                console.error(error);
                alert('Error fetching certificates: ' + (error.response?.data?.error || error.message));
            } finally {
                setLoading(false);
            }
        };
        fetchCertificates();
    }, [auth]);

    if (loading) {
        return <p>Loading your certificates...</p>;
    }

    return (
        <div style={{ marginBottom: '30px' }}>
            <h2>Your Certificates</h2>
            {certificates.length === 0 ? (
                <p>No certificates submitted yet.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>ID</th>
                            <th style={tableHeaderStyle}>Course Name</th>
                            <th style={tableHeaderStyle}>Completion Date</th>
                            <th style={tableHeaderStyle}>Score</th>
                            <th style={tableHeaderStyle}>Status</th>
                            <th style={tableHeaderStyle}>Finance Status</th>
                            <th style={tableHeaderStyle}>Manager Status</th>
                            <th style={tableHeaderStyle}>VP Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {certificates.map(cert => (
                            <tr key={cert.id}>
                                <td style={tableCellStyle}>{cert.id}</td>
                                <td style={tableCellStyle}>{cert.course_name}</td>
                                <td style={tableCellStyle}>{cert.completion_date}</td>
                                <td style={tableCellStyle}>{cert.score}</td>
                                <td style={tableCellStyle}>{cert.status}</td>
                                <td style={tableCellStyle}>{cert.finance_status}</td>
                                <td style={tableCellStyle}>{cert.manager_status}</td>
                                <td style={tableCellStyle}>{cert.vp_status}</td>
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
    backgroundColor: '#f2f2f2',
    textAlign: 'left'
};

const tableCellStyle = {
    border: '1px solid #ddd',
    padding: '8px'
};

export default CertificateList;
