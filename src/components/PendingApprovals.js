// frontend/src/components/PendingApprovals.js

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import styles from './PendingApprovals.module.css'; // Ensure this CSS module exists

const PendingApprovals = () => {
  const { auth } = useContext(AuthContext);
  const [forms, setForms] = useState([]);
  const [error, setError] = useState('');
  const [sendBackComments, setSendBackComments] = useState({}); // To store comments for each form

  useEffect(() => {
    const fetchPendingForms = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/certification/pending`, {
          headers: {
            'Authorization': `Bearer ${auth.token}`,
          },
        });
        setForms(response.data.pendingSubmissions);
      } catch (err) {
        console.error('Error fetching pending forms:', err);
        setError(err.response?.data?.message || 'Failed to fetch pending forms.');
      }
    };

    fetchPendingForms();
  }, [auth.token]);

  const handleApprove = async (formId) => {
    try {
      const endpoint = `${process.env.REACT_APP_API_URL}/api/certification/approve`;
      const payload = { submissionId: formId };

      const response = await axios.post(endpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      // Remove the form from the list upon successful action
      setForms(forms.filter(form => form._id !== formId));
      alert(response.data.message);
    } catch (err) {
      console.error('Error approving submission:', err);
      alert(err.response?.data?.message || 'Approval failed.');
    }
  };

  const handleReject = async (formId) => {
    try {
      const reason = sendBackComments[formId]?.rejectReason || '';
      if (!reason.trim()) {
        alert('Rejection reason is required.');
        return;
      }

      const endpoint = `${process.env.REACT_APP_API_URL}/api/certification/reject`;
      const payload = { submissionId: formId, rejectionReason: reason };

      const response = await axios.post(endpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      // Remove the form from the list upon successful action
      setForms(forms.filter(form => form._id !== formId));
      alert(response.data.message);
    } catch (err) {
      console.error('Error rejecting submission:', err);
      alert(err.response?.data?.message || 'Rejection failed.');
    }
  };

  const handleSendBack = async (formId) => {
    try {
      const comments = sendBackComments[formId]?.sendBackComments || '';
      // Comments are optional, so no need to validate

      const endpoint = `${process.env.REACT_APP_API_URL}/api/certification/sendback`;
      const payload = { submissionId: formId, comments };

      const response = await axios.post(endpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      // Remove the form from the list upon successful action
      setForms(forms.filter(form => form._id !== formId));
      alert(response.data.message);
    } catch (err) {
      console.error('Error sending back submission:', err);
      alert(err.response?.data?.message || 'Send Back failed.');
    }
  };

  const toggleSendBackInput = (formId) => {
    setSendBackComments(prev => ({
      ...prev,
      [formId]: {
        ...prev[formId],
        showSendBackInput: !prev[formId]?.showSendBackInput,
      },
    }));
  };

  const handleInputChange = (formId, field, value) => {
    setSendBackComments(prev => ({
      ...prev,
      [formId]: {
        ...prev[formId],
        [field]: value,
      },
    }));
  };

  if (error) return <p className={styles.error}>{error}</p>;
  if (forms.length === 0) return <p>No pending approvals.</p>;

  return (
    <div className={styles.container}>
      <h2>Pending Approvals</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Contract Name</th>
            <th>Submitted By</th>
            <th>Current Stage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {forms.map((form) => (
            <React.Fragment key={form._id}>
              <tr>
                <td>{form.contractName}</td>
                <td>{form.submittedBy}</td>
                <td>{form.currentApprover.charAt(0).toUpperCase() + form.currentApprover.slice(1)}</td>
                <td>
                  <button onClick={() => handleApprove(form._id)} className={styles.approveButton}>
                    Approve
                  </button>
                  <button onClick={() => handleReject(form._id)} className={styles.rejectButton}>
                    Reject
                  </button>
                  <button onClick={() => toggleSendBackInput(form._id)} className={styles.sendBackButton}>
                    {sendBackComments[form._id]?.showSendBackInput ? 'Cancel' : 'Send Back'}
                  </button>
                </td>
              </tr>
              {sendBackComments[form._id]?.showSendBackInput && (
                <tr>
                  <td colSpan="4">
                    <div className={styles.sendBackContainer}>
                      <label>Comments (optional):</label>
                      <textarea
                        value={sendBackComments[form._id]?.sendBackComments || ''}
                        onChange={(e) => handleInputChange(form._id, 'sendBackComments', e.target.value)}
                        placeholder="Enter comments here..."
                        className={styles.textarea}
                      />
                      <button onClick={() => handleSendBack(form._id)} className={styles.submitSendBackButton}>
                        Submit Send Back
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingApprovals;
