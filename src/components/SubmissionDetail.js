// frontend/src/components/SubmissionDetail.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import styles from './SubmissionDetail.module.css';

const SubmissionDetail = () => {
    const { id } = useParams();
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/certification/submissions/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                setSubmission(response.data.submission);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchSubmission();
    }, [id]);

    if (loading) return <p>Loading submission details...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!submission) return <p>No submission found.</p>;

    return (
        <div className={styles.container}>
            <h2>Submission Details</h2>
            {/* Display submission details here */}
            <p><strong>Manager:</strong> {submission.manager}</p>
            <p><strong>Vendor Name:</strong> {submission.vendorName}</p>
            <p><strong>Contract Name:</strong> {submission.contractName}</p>
            <p><strong>Contract Period:</strong> {submission.contractPeriod} Days</p>
            <p><strong>Contract Number:</strong> {submission.contractNumber}</p>
            <p><strong>Invoice Number:</strong> {submission.invoiceNumber}</p>
            <p><strong>Invoice Period:</strong> {new Date(submission.invoicePeriodFrom).toLocaleDateString()} to {new Date(submission.invoicePeriodTo).toLocaleDateString()}</p>
            <p><strong>Claim Amount:</strong> {submission.claimAmountNumber} ({submission.claimAmountText})</p>
            <p><strong>Pages:</strong> {submission.pages}</p>
            <p><strong>Department Name:</strong> {submission.departmentName}</p>
            <p><strong>Admin Signature:</strong> {submission.adminSignature}</p>
            <p><strong>Project Manager:</strong> {submission.projectManager}</p>
            <p><strong>VP Name:</strong> {submission.vpName}</p>
            <p><strong>SSVP Name:</strong> {submission.ssvpName}</p>
            <p><strong>Status:</strong> {submission.status || 'N/A'}</p>
            <p><strong>Current Approver:</strong> {submission.currentApprover || 'N/A'}</p>

            {/* Display descriptions */}
            <h3>Detailed Breakdown</h3>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Description</th>
                        <th>Quantity Requested</th>
                        <th>Quantity Supplied</th>
                        <th>Total Before VAT</th>
                        <th>Total After VAT</th>
                    </tr>
                </thead>
                <tbody>
                    {submission.descriptions.map((desc, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{desc.description}</td>
                            <td>{desc.quantityRequested}</td>
                            <td>{desc.quantitySupplied}</td>
                            <td>{desc.totalBeforeVAT}</td>
                            <td>{desc.totalAfterVAT}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Display signatures */}
            <h3>Signatures</h3>
            <p><strong>Project Manager:</strong> {submission.projectManagerSignature}</p>
            <p><strong>VP:</strong> {submission.vpSignature}</p>
            <p><strong>SSVP:</strong> {submission.ssvpSignature}</p>

            {/* Link to go back */}
            <Link to="/view-submissions">Back to Submissions</Link>
        </div>
    );
};

export default SubmissionDetail;
