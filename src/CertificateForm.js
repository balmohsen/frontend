// frontend/src/components/CertificationForm.js

import React, { useState } from 'react';
import axios from 'axios';
import styles from './CertificationForm.module.css';

const CertificationForm = () => {
    // Initialize state with all required fields
    const [formData, setFormData] = useState({
        // General Information
        manager: '',
        vendorName: '',
        contractName: '',
        contractPeriod: '',
        contractNumber: '',
        invoiceNumber: '',
        invoicePeriodFrom: '',
        invoicePeriodTo: '',
        claimAmountNumber: '',
        claimAmountText: '',
        pages: '',
        departmentName: '',
        adminSignature: '',
        projectManager: '',
        vpName: '',
        ssvpName: 'عبدالقادر بن حمدان المعين',

        // Detailed Breakdown - Description 1 to 4
        description1: '',
        quantityRequested1: '',
        quantitySupplied1: '',
        totalBeforeVAT1: '',
        totalAfterVAT1: '',
        description2: '',
        quantityRequested2: '',
        quantitySupplied2: '',
        totalBeforeVAT2: '',
        totalAfterVAT2: '',
        description3: '',
        quantityRequested3: '',
        quantitySupplied3: '',
        totalBeforeVAT3: '',
        totalAfterVAT3: '',
        description4: '',
        quantityRequested4: '',
        quantitySupplied4: '',
        totalBeforeVAT4: '',
        totalAfterVAT4: '',

        // Files
        projectManagerSignatureFile: null,
        vpSignatureFile: null,
        ssvpSignatureFile: null,
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files && files.length > 0) {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        // Append all fields to FormData
        for (const key in formData) {
            if (formData.hasOwnProperty(key)) {
                data.append(key, formData[key]);
            }
        }

        // Optional: Log FormData entries for debugging
        for (let pair of data.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/certification/submit`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust based on your auth implementation
                },
            });
            alert(response.data.message);
        } catch (error) {
            console.error('Error submitting form:', error.response);
            alert(error.response?.data?.message || 'An error occurred while submitting the form.');
        }
    };

    return (
        <div className={styles.container}>
            <h2>شهادة مصادقة وإنجاز أعمال</h2>
            <h3>Completion & Certification of Work Done</h3>
            <form id="certificationForm" onSubmit={handleSubmit} encType="multipart/form-data">
                
                {/* General Information Section */}
                <div className={styles.section}>
                    <h3>المعلومات العامة / General Information</h3>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="manager">إلى مدير عام الإدارة المالية / To the Financial Department General Manager</label>
                        <input
                            type="text"
                            id="manager"
                            name="manager"
                            value={formData.manager}
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                        />
                    </div>

                    {/* Repeat similar blocks for other general information fields */}
                    <div className={styles.formGroup}>
                        <label htmlFor="vendorName">Vendor Name</label>
                        <input
                            type="text"
                            id="vendorName"
                            name="vendorName"
                            value={formData.vendorName}
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="contractName">Contract Name</label>
                        <input
                            type="text"
                            id="contractName"
                            name="contractName"
                            value={formData.contractName}
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                        />
                    </div>

                    {/* Continue adding other general fields as required */}
                </div>
                
                {/* Detailed Breakdown Section */}
                <div className={styles.section}>
                    <h3>Detailed Breakdown</h3>
                    
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Description</th>
                                <th>Quantity Requested</th>
                                <th>Quantity Supplied</th>
                                <th>Total Before VAT</th>
                                <th>Total After VAT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4].map((i) => (
                                <tr key={i}>
                                    <td>{i}</td>
                                    <td>
                                        <input 
                                            type="text" 
                                            name={`description${i}`} 
                                            value={formData[`description${i}`]} 
                                            onChange={handleChange} 
                                            required 
                                            className={styles.inputField}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="number" 
                                            name={`quantityRequested${i}`} 
                                            value={formData[`quantityRequested${i}`]} 
                                            onChange={handleChange} 
                                            required 
                                            className={styles.inputField}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="number" 
                                            name={`quantitySupplied${i}`} 
                                            value={formData[`quantitySupplied${i}`]} 
                                            onChange={handleChange} 
                                            required 
                                            className={styles.inputField}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="number" 
                                            name={`totalBeforeVAT${i}`} 
                                            value={formData[`totalBeforeVAT${i}`]} 
                                            onChange={handleChange} 
                                            required 
                                            className={styles.inputField}
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="number" 
                                            name={`totalAfterVAT${i}`} 
                                            value={formData[`totalAfterVAT${i}`]} 
                                            onChange={handleChange} 
                                            required 
                                            className={styles.inputField}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Signatures Section */}
                <div className={styles.section}>
                    <h3>Signatures</h3>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="projectManagerSignatureFile">Project Manager Signature</label>
                        <input
                            type="file"
                            id="projectManagerSignatureFile"
                            name="projectManagerSignatureFile"
                            accept="image/*,application/pdf"
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="vpSignatureFile">VP Signature</label>
                        <input
                            type="file"
                            id="vpSignatureFile"
                            name="vpSignatureFile"
                            accept="image/*,application/pdf"
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="ssvpSignatureFile">SSVP Signature</label>
                        <input
                            type="file"
                            id="ssvpSignatureFile"
                            name="ssvpSignatureFile"
                            accept="image/*,application/pdf"
                            onChange={handleChange}
                            required
                            className={styles.inputField}
                        />
                    </div>
                </div>
                
                {/* Submit Button */}
                <div className={styles.submitBtn}>
                    <button type="submit" className={styles.submitButton}>Submit / إرسال</button>
                </div>
            </form>
        </div>
    );
};

export default CertificationForm;
