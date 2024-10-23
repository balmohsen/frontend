// frontend/src/components/COCForm.js

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const COCForm = () => {
  const { auth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    submissionDate: '',
    department: '',
    comments: '',
    agreeToTerms: false,
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.department) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the terms.');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/coc/submit`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      setMessage(response.data.message);
      setFormData({
        fullName: '',
        email: '',
        submissionDate: '',
        department: '',
        comments: '',
        agreeToTerms: false,
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(
        err.response?.data?.message || 'An error occurred while submitting the form.'
      );
    }
  };

  return (
    <div style={styles.container}>
      <h2>Certificate of Completion Submission</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Full Name */}
        <div style={styles.formGroup}>
          <label htmlFor="fullName" style={styles.label}>
            Full Name<span style={styles.required}>*</span>:
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        {/* Email Address */}
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>
            Email Address<span style={styles.required}>*</span>:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        {/* Date of Submission */}
        <div style={styles.formGroup}>
          <label htmlFor="submissionDate" style={styles.label}>
            Date of Submission:
          </label>
          <input
            type="date"
            id="submissionDate"
            name="submissionDate"
            value={formData.submissionDate}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        {/* Department */}
        <div style={styles.formGroup}>
          <label htmlFor="department" style={styles.label}>
            Department<span style={styles.required}>*</span>:
          </label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">--Select Department--</option>
            <option value="Finance">Finance</option>
            <option value="Human Resources">Human Resources</option>
            <option value="IT">IT</option>
            <option value="Marketing">Marketing</option>
            {/* Add more departments as needed */}
          </select>
        </div>

        {/* Comments */}
        <div style={styles.formGroup}>
          <label htmlFor="comments" style={styles.label}>
            Comments:
          </label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            style={styles.textarea}
          ></textarea>
        </div>

        {/* Agree to Terms */}
        <div style={styles.formGroupCheckbox}>
          <input
            type="checkbox"
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            style={styles.checkbox}
          />
          <label htmlFor="agreeToTerms" style={styles.checkboxLabel}>
            I agree to the terms and conditions<span style={styles.required}>*</span>
          </label>
        </div>

        {/* Submit Button */}
        <button type="submit" style={styles.submitButton}>
          Submit
        </button>

        {/* Success Message */}
        {message && <p style={styles.success}>{message}</p>}

        {/* Error Message */}
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

// Inline styles (You can replace these with CSS or styled-components)
const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  formGroupCheckbox: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  required: {
    color: 'red',
    marginLeft: '2px',
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  select: {
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    minHeight: '100px',
    resize: 'vertical',
  },
  checkbox: {
    marginRight: '10px',
  },
  checkboxLabel: {
    fontSize: '14px',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#6666cc', // Banner color as button color
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  success: {
    color: 'green',
    marginTop: '10px',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};

export default COCForm;
