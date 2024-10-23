// src/Approvals.js

import React, { useState, useContext } from 'react';
import FinanceApproval from './FinanceApproval';
import ManagerApproval from './ManagerApproval';
import VPApproval from './VPApproval';
import { AuthContext } from './context/AuthContext';

const Approvals = () => {
    const { auth, logout } = useContext(AuthContext);
    const [role, setRole] = useState('');
    const [id, setId] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (role && id.trim()) {
            setSubmitted(true);
        } else {
            alert('Please select a role and enter your ID.');
        }
    };

    const handleReset = () => {
        setRole('');
        setId('');
        setSubmitted(false);
    };

    return (
        <div>
            <h2>Approvals Dashboard</h2>
            {!submitted ? (
                <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ marginRight: '10px' }}>Select Role:</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} required style={{ padding: '6px', width: '200px' }}>
                            <option value="">-- Select Role --</option>
                            <option value="finance">Finance Reviewer</option>
                            <option value="manager">Manager</option>
                            <option value="vp">VP</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <input 
                            type="text" 
                            placeholder="Enter Your ID" 
                            value={id} 
                            onChange={(e) => setId(e.target.value)} 
                            required 
                            style={{ padding: '8px', width: '220px' }}
                        />
                    </div>
                    <button type="submit" style={{ padding: '8px 16px', marginRight: '10px' }}>Load Dashboard</button>
                    <button type="button" onClick={handleReset} style={{ padding: '8px 16px' }}>Cancel</button>
                </form>
            ) : (
                <div>
                    <button onClick={handleReset} style={{ padding: '6px 12px', marginBottom: '20px' }}>Back</button>
                    {role === 'finance' && <FinanceApproval reviewerId={id} />}
                    {role === 'manager' && <ManagerApproval managerId={id} />}
                    {role === 'vp' && <VPApproval vpId={id} />}
                </div>
            )}
        </div>
    );
};

export default Approvals;
