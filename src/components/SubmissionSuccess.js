// frontend/src/components/SubmissionSuccess.js

import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SubmissionSuccess.module.css'; // Optional: Create CSS for styling

const SubmissionSuccess = () => {
    return (
        <div className={styles.container}>
            <h2>Form Submitted Successfully!</h2>
            <p>Your certification form has been submitted successfully.</p>
            <Link to="/">Submit Another Form</Link>
            <br />
            <Link to="/view-submissions">View Submissions</Link>
        </div>
    );
};

export default SubmissionSuccess;
